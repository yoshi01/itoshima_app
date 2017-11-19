var rendererOptions = {
    suppressMarkers : true
}
var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
var directionsService = new google.maps.DirectionsService();
var map = handler.getMap();
var spotMarkers = [];
var markerId = 0;
var markerMode= false;

function searchRoute() {
    var points = $('#route-list li');

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
        addRoute("選択地点 (" + roundLng.toString() + ", " + roundLng.toString() + ")", lat, lng, markerId);
        markerId = markerId + 1;
        map.setOptions({ draggableCursor: "default"});
        markerMode = false;
    }
}

function addMarker(){
    if(!markerMode) {
        markerMode = true;
        map.setOptions({ draggableCursor: "crosshair"});
    }
}

function addRoute(name, lat, lng, marker_id){
    var li = $('<li>').text(name);
    $(li).attr("data-lat", lat.toString());
    $(li).attr("data-long", lng.toString());
    $(li).addClass("list-group-item");
    var btn = $('<button>').text("×");
    $(btn).addClass("delete-btn");
    $(btn).addClass("btn btn-secondary");
    if (marker_id != null && marker_id != undefined ) {
        $(btn).addClass("marked");
        $(btn).attr("data-marker-id", marker_id.toString());
    }
    li = $(li).prepend(btn);
    if (!isRouteListExists(li)) {
        $('#route-list').append(li);
        checkDisabled();
    };
}

function checkDisabled() {
    var listSize = $('#route-list li').length;
    if (listSize == 2) {
        $('#search-btn').removeAttr("disabled");
    } else if (listSize == 1) {
        $('#search-btn').attr("disabled", "true");
    }
}

function isRouteListExists(li) {
    var exist = false;
    $('#route-list li').each(function() {
        if($(this).text() == $(li).text()) {
            exist = true;
        }
    })
    return exist;
}

$('#route-list').on("click", ".marked", function() {
    var id = $(this).attr("data-marker-id");
    spotMarkers[id].setMap(null);
});

$('#route-list').on("click", ".delete-btn", function() {
    directionsDisplay.setDirections({routes: []});
    $(this).parents('li').remove();
    checkDisabled();
});
