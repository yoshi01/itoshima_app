var rendererOptions = {
    suppressMarkers : true
}
var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
var directionsService = new google.maps.DirectionsService();
var map = handler.getMap();
var spotMarkers = [];
var markerId = 0;
var markerMode= false;
var infowindow;

$(document).ready( function(){
    courseChanged($('#select-course').get(0));
});

function searchRoute() {
    var points = $('#route-list tr');

    if (points.length >= 2){
        var origin;
        var destination;
        var waypoints = [];

        for (var i = 0; i < points.length; i++) {
            points[i] = new google.maps.LatLng($(points[i]).attr("data-lat"), $(points[i]).attr("data-long"));
            if (i == 0){
                origin = points[i];
            } else if (i == points.length-1){
                destination = points[i];
            } else {
                waypoints.push({ location: points[i], stopover: true });
            }
        }
        var request = {
            origin:      origin,
            destination: destination,
            waypoints: waypoints,
            travelMode:  google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
    }
}

function markerListener(){
    if (infowindow != null) {
        infowindow.close();
    }
}

function mapListener(event){
    if (markerMode) {
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        var roundLat = Math.round(lat * 1000)/1000;
        var roundLng = Math.round(lng * 1000)/1000;
        var marker = new google.maps.Marker({
            position: event.latLng,
            icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        });
        marker.setMap(map);
        spotMarkers.push(marker);
        addRoute(null, "選択地点", "(" + roundLat.toString() + ", " + roundLng.toString() + ")", null, lat, lng, markerId);
        markerId = markerId + 1;
        map.setOptions({ draggableCursor: "default"});
        markerMode = false;
    }
}

function markerChangeListener(id, color){
    $.each(Gmaps.store.markers, function() {
        if (this.serviceObject.id == id) {
            if (color === "green") {
                this.serviceObject.label.color = "black";
                this.serviceObject.setIcon({
                    url: "http://maps.google.com/mapfiles/ms/icons/green.png",
                    size: new google.maps.Size(32, 32),
                    labelOrigin: new google.maps.Point(16, 10),
                });
            } else if (color === "red") {
                this.serviceObject.label.color = "white";
                this.serviceObject.setIcon(null);
            }
        }
    });
}

function infowindowListener(id){
    $.each(Gmaps.store.markers, function() {
        if (this.serviceObject.id == id) {
            if (infowindow != null) {
                infowindow.close();
            }
            if (handler.currentInfowindow()) {
                handler.currentInfowindow().close();
            }
            infowindow = new google.maps.InfoWindow({
                content: this.serviceObject.infowindow
            });
            infowindow.open(this.serviceObject.map, this.serviceObject);
        }
    });
}

function addMarker(){
    if(!markerMode) {
        markerMode = true;
        map.setOptions({ draggableCursor: "crosshair"});
    }
}

function addRoute(id, name, desc, path, lat, lng, marker_id){
    var tr = $('<tr>');
    var td = $('<td>');
    var tag;
    if (path != null) {
      tag = $('<a>', {
        "class": "table-spot-name",
        href: path,
        text: name
      });
    } else {
      tag = $('<h4>', {
        "class": "table-spot-name",
        text: name
      });
    }
    var p = $('<p>', {
      "class": "text-muted",
      text: desc
    });
    var btn = $('<button>', {
      "class": "btn btn-secondary delete-btn",
      text: "×"
    });
    if (id != null) {
        google.maps.event.trigger(handler.getMap(), "change", id, "green");
        $(tr).attr("data-id", id.toString());
    }
    if (marker_id != null && marker_id != undefined ) {
        $(btn).addClass("marked");
        $(btn).attr("data-marker-id", marker_id.toString());
    }
    $(tr).attr("data-lat", lat.toString());
    $(tr).attr("data-long", lng.toString());
    td = $(td).append(tag);
    td = $(td).append(p);
    tr = $(tr).append(td);
    tr = $(tr).append($('<td>').append(btn));
    if (!isRouteListExists(tr)) {
        $('#route-list').append(tr);
        checkDisabled();
    };
}

function checkDisabled() {
    var listSize = $('#route-list tr').length;
    if (listSize == 2) {
        $('#search-btn').removeAttr("disabled");
    } else if (listSize == 1) {
        $('#search-btn').attr("disabled", "true");
    }
}

function isRouteListExists(tr) {
    var exist = false;
    $('#route-list tr').each(function() {
        if($('p', this).text() == $('p', tr).text()) {
            exist = true;
        }
    })
    return exist;
}

function courseChanged(obj) {
    var idx = obj.selectedIndex;
    var id  = obj.options[idx].value;
    var token = $("#authenticity_token").val();
    $.ajax({
        url: 'map',
        type:'POST',
        data:{
            "ajax_handler": "selectbox-ajax",
            "authenticity_token": token,
            "course_id": id
        }
    })
        .done(function(data){
            clearRoute();
            for(var i = 0; i < data.length; i++) {
                var spot = data[i].tourist_spot;
                var spot_path = "/tourist_spots/" + spot.id.toString();
                addRoute(spot.id, spot.name, spot.description, spot_path,
                    spot.latitude, spot.longitude)
            }
            searchRoute();
        })
        .fail(function(data){
            console.log("ajax failed");
        });
}

function clearRoute() {
    var route_spots = $('#route-list tr');
    for (var i = 0; i < route_spots.length; i++) {
        removeRoute(route_spots[i]);
    }
}

function removeRoute(tr) {
    var id = $(tr).attr("data-id");
    var marker_id = $(tr).find('.marked').attr('data-marker-id');
    if (id != null && id != undefined) {
        google.maps.event.trigger(handler.getMap(), "change", id, "red");
    }
    if (marker_id != null && marker_id != undefined) {
        spotMarkers[marker_id].setMap(null);
    }
    directionsDisplay.setDirections({routes: []});
    $(tr).remove();
    checkDisabled();
}

$(document).on("click", '#route-list tr', function() {
    var id = $(this).attr("data-id");
    if (id != null && id != undefined) {
        google.maps.event.trigger(handler.getMap(), "open", id);
    }
});

$('#route-list').on("click", ".delete-btn", function() {
    removeRoute($(this).parents('tr'));
});
