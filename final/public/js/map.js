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
  var coor1 = 0;
  var coor2 = 1;
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
  return [coor1,coor2]
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

function T() {
  var directionsService = new google.maps.DirectionsService();
  var directionsRequest = {
    origin: document.getElementById("Start").value,
    destination: document.getElementById("End").value,
    travelMode: google.maps.DirectionsTravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC
  };
  directionsService.route(directionsRequest, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      distance = response['routes'][0]['legs'][0]['distance']['value'];
      window.location.href = "/main#2";
    } else
      alert("F")
  })
}

function calculateJourney(){
  var startDest = document.getElementById("Start").value;
  var endDest = document.getElementById("End").value;
  var fuelPrice = document.getElementById("fuelPrice-box").value;
  var carDetails = document.getElementById("reg-box").value;
  var passSlider = document.getElementById('myRange');
  var passValue = passSlider.value;

  document.getElementById("startDest").innerHTML = startDest;
  document.getElementById("endDest").innerHTML = endDest;
  document.getElementById("vehicleDetail").innerHTML = carDetails;
  document.getElementById("noPassengers").innerHTML = passValue;
  document.getElementById("fuelCost").innerHTML = fuelPrice;

  //var recommendedCost = ((((parseInt(distance) / 100)*parseInt(carDetails))*parseInt(fuelPrice))*1.20)/parseInt(passValue);
  recommendedCost = (parseInt(distance)*0.62) / 100; //convert to miles
  recommendedCost = recommendedCost / 100; //get fuel consumption / 100 mi
  recommendedCost = recommendedCost * 100/((parseInt(carDetails) * 1.609)/4.546); //multiply by mpg (convert to litres/100km)
  recommendedCost = recommendedCost * parseInt(fuelPrice); //multiply by fuel cost
  recommendedCost = recommendedCost / parseInt(passValue); //split cost between passengers
  recommendedCost = recommendedCost * 1.2; //profit multiplier
  console.log("Distance " + distance + " MPG " + carDetails + " Price " + fuelPrice + " Passenegers " + passValue);
  document.getElementById("recommendedPrice").innerHTML = recommendedCost.toFixed(2);

  // $.post('/main', {
  //   Start: startDest,
  //   End: endDest,
  //   distance: distance,
  //   fuelPrice: fuelPrice,
  //   carDetails: carDetails,
  //   passengers: passValue
  // });
}
