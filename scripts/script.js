new gnMenu( document.getElementById( 'gn-menu' ) );

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

(function(window, mapster) {

  var options = mapster.MAP_OPTIONS,
  element = document.getElementById('map-canvas'),
  map = mapster.create(element, options);

  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

      map.setCenter(pos);

      // User location
      map.addMarker({
        pos: pos,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          strokeColor: 'DodgerBlue',
          strokeWeight: 4,
          scale: 6
        }
      });

      var pickupLocationMarker = map.addMarker({
        pos: pos,
        draggable: true,
        showContent: true,
        content: "Pickup location",
        icon: 'icons/pin-24px.png'
      });
      pickupLocationMarker.setZIndex(1000);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }

}(window, window.Mapster));
