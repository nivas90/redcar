var sourceLatLng;
var destLatLng;
var distance;
var globalMap;
var pickupLocationMarker;

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

var cabArray = [
  'UberX', 'UberTaxi', 'UberBlack', 'OlaX', 'OlaTaxi', 'OlaBlack', 'T4SX', 'T4STaxi', 'T4SBlack', 'MeruX', 'MeruTaxi', 'MeruBlack'
];

function randomIndex(max) {
  return Math.floor((Math.random() * max) + 1);
}

function randomFloat() {
  return ((Math.random()-0.5)/100)*1.5;
}

function singleCabTable(cabArray) {
  $('#map-canvas').hide();
  $('#footer').hide();
  console.log("Loading table for single cab!");
  var tableElem = $('<table class="table" id="cabs-result-table"><thead><tr><th>Service</th><th>Cost</th></tr></thead><tbody></tbody></table>');
  $('#cab-result').html(tableElem);
  for (var i = 0; i < cabArray.length; i++) {
    var cost;
    if(cabArray[i].Cost) {
      if(cabArray[i].service == 'UberX') {
        $('#cabs-result-table > tbody:last').append('<tr><td>'+'<a href="uber://?action=setPickup&pickup=my_location">'+cabArray[i].service+'</a>'+'</td><td>'+cabArray[i].Cost+'</td></tr>');
      } else {
        $('#cabs-result-table > tbody:last').append('<tr><td>'+cabArray[i].service+'</td><td>'+cabArray[i].Cost+'</td></tr>');
      }
    }
  };
  $('#cab-result').show();
}

function multipleCabTable(cabArray) {
  $('#map-canvas').hide();
  $('#footer').hide();
  console.log("Loading table for multiple cabs!");
  var tableElem = $('<table class="table" id="cabs-result-table"><thead><tr><th>No. of Riders</th><th>Service</th><th>Cost</th></tr></thead><tbody></tbody></table>');
  $('#cab-result').html(tableElem);
  for (var i = 0; i < cabArray.length; i++) {
    var cost;
    if(cabArray[i].minimumCost) {
      $('#cabs-result-table > tbody:last').append('<tr><td>'+cabArray[i].ridersCount+'</td><td>'+cabArray[i].service+'</td><td>'+cabArray[i].minimumCost+'</td></tr>');
    }
  };
  $('#cab-result').show();
}

$(document).ready($('#suggestion').click(function(){
  console.log("Distance: "+distance);
  var expSelection = $('#experience-selection').val();
  console.log("ExpSelc: "+expSelection);
  var cabArray;
  if (expSelection == 'single') {
    cabArray = findCabSorted(1, parseInt(distance), 30);
    findMinForChart(1, parseInt(distance), 30);
    singleCabTable(cabArray);
    $('#chart-result').show();
  } else if (expSelection == 'multiple') {
    cabArray = getMinRange(parseInt(distance), 30);
    findMinForChart(1, parseInt(distance), 30);
    multipleCabTable(cabArray);
    $('#chart-result').show();
  }
}));

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

function codeAddress(geocoder, address) {
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      destLatLng = results[0].geometry.location;
      console.log("source: "+sourceLatLng+", dest: "+destLatLng);
      var service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix({
        origins: [sourceLatLng],
        destinations: [destLatLng],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }, geoCodingcallback);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function geoCodingcallback(response, status) {
  if (status != google.maps.DistanceMatrixStatus.OK) {
    alert('Error was: ' + status);
  } else {
    var origins = response.originAddresses;
    for (var i = 0; i < origins.length; i++) {
      var results = response.rows[i].elements;
      distance = results[0].distance.text;
    }
  }
}

function plotIndividualCar(map, lat, lng, carType) {
  var geolocation = new google.maps.LatLng(lat, lng);

  map.addMarker({
    pos: geolocation,
    draggable: false,
    icon: vehicleIconEnum[carType],
  });
}

function plotCars(position) {
  // plotIndividualCar(map, position.coords.latitude+0.001, position.coords.longitude+0.003, 'UberX');
  for (var i = 0; i <= 10; i++) {
    plotIndividualCar(globalMap, position.lat()+randomFloat(), 
        position.lng()+randomFloat(), cabArray[randomIndex(10)]);
  }
}

function sourceAddress(geocoder, address) {
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      sourceLatLng = results[0].geometry.location;
      globalMap.setCenter(sourceLatLng);
      pickupLocationMarker.setPosition(sourceLatLng);
      plotCars(sourceLatLng);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

(function initialize() {
  geocoder = new google.maps.Geocoder();

  autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('search')),
      { types: ['geocode'] });
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    console.log("Place changed in Search box!");
    var address = $('#search').val();
    console.log("Place changed in Source box! " + address);
    sourceAddress(geocoder, address);
    $('#exp-select-group').show();
  });

  destinationAutocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('destination-selection')),
      { types: ['geocode'] });
  google.maps.event.addListener(destinationAutocomplete, 'place_changed', function() {
    var address = $('#destination-selection').val();
    console.log("Place changed in Destination box! " + address);
    codeAddress(geocoder, address);
    $('#exp-select-group').show();
  });
}());

(function(window, mapster) {

  var options = mapster.MAP_OPTIONS,
  element = document.getElementById('map-canvas'),
  map = mapster.create(element, options);
  globalMap = map;

  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      sourceLatLng = geolocation;

      globalMap.setCenter(geolocation);

      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());

      // User location
      globalMap.addMarker({
        pos: geolocation,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          strokeColor: '#eb5d1e',
          strokeWeight: 5,
          scale: 8
        }
      });

      pickupLocationMarker = globalMap.addMarker({
        pos: geolocation,
        draggable: true,
        showContent: true,
        content: '<h5>Choose a pickup location</h5>',
        icon: 'icons/pin-64px.png',
        event: {
          name: 'dragend',
          callback: function() {
            var pos = pickupLocationMarker.getPosition();
            sourceLatLng = pos;
            globalMap.setCenter(sourceLatLng);
            pickupLocationMarker.setPosition(sourceLatLng);
            plotCars(sourceLatLng);
            console.log("Marker dragged! to " + pos);
          }
        }
      });
      pickupLocationMarker.setZIndex(1000);

      // plotIndividualCar(map, position.coords.latitude+0.001, position.coords.longitude+0.003, 'UberX');
      for (var i = 0; i <= 10; i++) {
        plotIndividualCar(globalMap, position.coords.latitude+randomFloat(), 
            position.coords.longitude+randomFloat(), cabArray[randomIndex(10)]);
      }
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }

}(window, window.Mapster));
