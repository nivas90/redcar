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

(function initialize() {
  autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('search')),
      { types: ['geocode'] });
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    console.log("Place changed in Search box!");
  });
}());

(function(window, mapster) {

  var options = mapster.MAP_OPTIONS,
  element = document.getElementById('map-canvas'),
  map = mapster.create(element, options);

  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

      map.setCenter(geolocation);

      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());

      // User location
      map.addMarker({
        pos: geolocation,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          strokeColor: 'DodgerBlue',
          strokeWeight: 5,
          scale: 8
        }
      });

      var pickupLocationMarker = map.addMarker({
        pos: geolocation,
        draggable: true,
        showContent: true,
        content: '<h5>Pickup location</h5>',
        icon: 'icons/pin-64px.png',
        event: {
          name: 'dragend',
          callback: function() {
            var pos = pickupLocationMarker.getPosition();
            console.log("Marker dragged! to " + pos);
          }
        }
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
