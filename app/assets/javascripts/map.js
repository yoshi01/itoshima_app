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
    var points = $('#route-list tr.spot');

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
                displayRouteDetail(response.routes[0].legs);
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
        addRoute(null, null, "選択地点", "(" + roundLat.toString() + ", " + roundLng.toString() + ")", null, lat, lng, markerId);
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

function focusListener(lat, lng){
    if (infowindow != null) {
        infowindow.close();
    }
    if (handler.currentInfowindow()) {
        handler.currentInfowindow().close();
    }
    handler.getMap().setCenter(new google.maps.LatLng(lat, lng));
}

function addMarker(){
    if(!markerMode) {
        markerMode = true;
        map.setOptions({ draggableCursor: "crosshair"});
    }
}

function addRoute(id, rank, name, desc, path, lat, lng, marker_id){
    var tr = $('<tr>');
    var td = $('<td>');
    var tag;
    var route_spots = $('#route-list tr.spot');

    if (path != null) {
      tag = $('<a>', {
        "class": "table-spot-name",
        href: path,
        text: rank + "位 " + name
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
        $(tr).addClass("marked");
        $(tr).attr("data-marker-id", marker_id.toString());
    }
    $(tr).attr("data-lat", lat.toString());
    $(tr).attr("data-long", lng.toString());
    td = $(td).append(tag);
    td = $(td).append(p);
    tr = $(tr).append(td);
    tr = $(tr).append($('<td>').append(btn));
    $(tr).addClass("spot");

    if (!isRouteListExists(tr)) {
        if (route_spots.length != 0) {
            var div_arrow = $('<div>', {
                "class": "div-arrow"
            });
            var div_triangle = $('<div>', {
                "class": "triangle"
            });
            var div_icon = $('<div>', {
                "class": "icon-route-detail"
            });
            var p_detail = $('<p>', {
                "class": "route-detail text-muted"
            });
            var td_arrow = $('<td>').attr("colspan", "2");
            var tr_arrow = $('<tr>', {
                "class": "arrow"
            });
            div_arrow = $(div_arrow).append(div_triangle);
            div_arrow = $(div_arrow).append(div_icon);
            div_arrow = $(div_arrow).append(p_detail);
            td_arrow = $(td_arrow).append(div_arrow);
            tr_arrow = $(tr_arrow).append(td_arrow);
            $('#route-list').append(tr_arrow);
        }
        $('#route-list').append(tr);
        checkDisabled();
    };
}

function displayRouteDetail(data) {
    var p_details = $('#route-list p.route-detail');
    var div_icon = $('#route-list div.icon-route-detail');
    for (var i = 0; i < data.length; i++) {
        var distance = data[i].distance.text;
        var duration = data[i].duration.text;
        $(p_details[i]).text("約" + duration + " (" + distance + ")");
        $(div_icon[i]).addClass("icon-car");
    }
}

function clearRouteDetail() {
    var p_details = $('#route-list p.route-detail');
    var div_icon = $('#route-list div.icon-route-detail');
    for (var i = 0; i < p_details.length; i++) {
        $(p_details[i]).text("");
        $(div_icon[i]).removeClass("icon-car");
    }
}

function checkDisabled() {
    var listSize = $('#route-list tr.spot').length;
    if (listSize == 2) {
        $('#search-btn').removeAttr("disabled");
    } else if (listSize == 1) {
        $('#search-btn').attr("disabled", "true");
    }
}

function isRouteListExists(tr) {
    var exist = false;
    $('#route-list tr.spot').each(function() {
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
                addRoute(spot.id, spot.rank, spot.name, spot.description, spot_path,
                    spot.latitude, spot.longitude)
            }
            searchRoute();
        })
        .fail(function(data){
            console.log("ajax failed");
        });
}

function clearRoute() {
    var route_spots = $('#route-list tr.spot');
    for (var i = 0; i < route_spots.length; i++) {
        removeRoute(route_spots[i]);
    }
}

function removeRoute(tr) {
    var id = $(tr).attr("data-id");
    var marker_id = $(tr).attr('data-marker-id');
    var route_spots = $('#route-list tr.spot');
    if (id != null && id != undefined) {
        google.maps.event.trigger(handler.getMap(), "change", id, "red");
    }
    if (marker_id != null && marker_id != undefined) {
        spotMarkers[marker_id].setMap(null);
    }
    directionsDisplay.setDirections({routes: []});
    if (route_spots.length != 0) {
        var arrow;
        if($(tr).next().attr("class") == "arrow") {
            arrow = $(tr).next();
        } else {
            arrow = $(tr).prev();
        }
        arrow.remove();
    }
    $(tr).remove();
    clearRouteDetail();
    checkDisabled();
}

$(document).on("click", '#route-list tr.spot', function() {
    var id = $(this).attr("data-id");
    if (id != null && id != undefined) {
        google.maps.event.trigger(handler.getMap(), "open", id);
    }
});

$(document).on("click", '#route-list tr.marked', function() {
    var lat = $(this).attr("data-lat");
    var lng = $(this).attr("data-long");
    google.maps.event.trigger(handler.getMap(), "focus", lat, lng);
});

$('#route-list').on("click", ".delete-btn", function() {
    removeRoute($(this).parents('tr'));
});
