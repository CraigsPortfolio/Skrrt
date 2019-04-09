function initialize() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var options = {
    zoom: 13,
    center: {
      lat: 57.1185,
      lng: -2.1408
    }
  }

  var map = new google.maps.Map(document.getElementById('map'), options);
  // var map2 = new google.maps.Map(document.getElementById('map2'), options);
  directionsDisplay.setMap(map);
  calculateAndDisplayRoute(directionsService, directionsDisplay);
  autoComp();
  // ____________________________________________________________________________
}

function autoComp(){
  var input = document.getElementById('Start');
  var autocomplete = new google.maps.places.Autocomplete(input);
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    var place = autocomplete.getPlace();
    var placeName = place.name;
    var placeLat = place.geometry.location.lat();
    var placeLng = place.geometry.location.lng();
    var coor1 = placeLat.toString()+ "," + placeLng.toString();
    initialize();
  });

  var input2 = document.getElementById('End');
  var autocomplete2 = new google.maps.places.Autocomplete(input2);
  google.maps.event.addListener(autocomplete2, 'place_changed', function() {
    var place2 = autocomplete2.getPlace();
    var placeName2 = place2.name;
    var placeLat2 = place2.geometry.location.lat();
    var placeLng2 = place2.geometry.location.lng();
    var coor2 = placeLat2.toString()+ "," + placeLng2.toString();
    initialize();
  });
}

function C(){
  $.post('/main', {
    lat: 'xxx@example.com',
    long: 'xyx@example.com'
  });
  window.location.href = "http://harvard-navy-8080.codio.io/main#2";
}


function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    origin: document.getElementById("Start").value,
    destination: document.getElementById("End").value,
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
