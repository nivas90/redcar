var sourceLatLng, destLatLng;

new gnMenu( document.getElementById( 'gn-menu' ) );

var vehicleIconEnum = {
  'UberX': 'icons/uber-small-32px.png',
  'UberTaxi': 'icons/uber-medium-32px.png',
  'UberBlack': 'icons/uber-large-32px.png',
  'OlaX': 'icons/ola-small-32px.png',
  'OlaTaxi': 'icons/ola-medium-32px.png',
  'OlaBlack': 'icons/ola-large-32px.png',
  'T4SX': 'icons/t4s-small-32px.png',
  'T4STaxi': 'icons/t4s-medium-32px.png',
  'T4SBlack': 'icons/t4s-large-32px.png',
  'MeruX': 'icons/meru-small-32px.png',
  'MeruTaxi': 'icons/meru-medium-32px.png',
  'MeruBlack': 'icons/meru-large-32px.png'
}

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

  destinationAutocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('destination-selection')),
      { types: ['geocode'] });
  google.maps.event.addListener(destinationAutocomplete, 'place_changed', function() {
    console.log("Place changed in Destination box!");
  });
}());

function plotCar(map, lat, lng, carType) {
  var geolocation = new google.maps.LatLng(lat, lng);

  map.addMarker({
    pos: geolocation,
    draggable: false,
    icon: vehicleIconEnum[carType],
  });
}

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
          strokeColor: '#eb5d1e',
          strokeWeight: 5,
          scale: 8
        }
      });

      var pickupLocationMarker = map.addMarker({
        pos: geolocation,
        draggable: true,
        showContent: true,
        content: '<h5>Choose a pickup location</h5>',
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

      plotCar(map, position.coords.latitude+0.001, position.coords.longitude-0.003, 'UberX');
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }

}(window, window.Mapster));
