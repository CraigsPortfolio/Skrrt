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

function autoComp() {
  var coor1 = 0;
  var coor2 = 1;
  var input = document.getElementById('Start');
  var autocomplete = new google.maps.places.Autocomplete(input);
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    var place = autocomplete.getPlace();
    var placeName = place.name;
    var placeLat = place.geometry.location.lat();
    var placeLng = place.geometry.location.lng();
    var coor1 = placeLat.toString() + "," + placeLng.toString();
    initialize();
  });

  var input2 = document.getElementById('End');
  var autocomplete2 = new google.maps.places.Autocomplete(input2);
  google.maps.event.addListener(autocomplete2, 'place_changed', function() {
    var place2 = autocomplete2.getPlace();
    var placeName2 = place2.name;
    var placeLat2 = place2.geometry.location.lat();
    var placeLng2 = place2.geometry.location.lng();
    var coor2 = placeLat2.toString() + "," + placeLng2.toString();
    initialize();
  });
  return [coor1, coor2]
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

function calculateJourney() {
  var startDest = document.getElementById("Start").value;
  var endDest = document.getElementById("End").value;
  var fuelPrice = document.getElementById("fuelPrice-box").value;
  var carDetails = document.getElementById("reg-box").value;
  var passSlider = document.getElementById('myRange');
  var passValue = passSlider.value;
  var profitSlider = document.getElementById('myRange2');
  var profValue = profitSlider.value;
  var returned = document.getElementById("return").checked

  document.getElementById("startDest").innerHTML = startDest;
  document.getElementById("endDest").innerHTML = endDest;
  document.getElementById("vehicleDetail").innerHTML = carDetails;
  document.getElementById("noPassengers").innerHTML = passValue;
  document.getElementById("fuelCost").innerHTML = fuelPrice;

  //var recommendedCost = ((((parseInt(distance) / 100)*parseInt(carDetails))*parseInt(fuelPrice))*1.20)/parseInt(passValue);
  recommendedCost = parseInt(distance) / 1000; //convert to miles
  recommendedCost = recommendedCost / 100; //get fuel consumption / 100 mi
  recommendedCost = recommendedCost * 100 / ((parseInt(mpg) * 1.609) / 4.546);
  recommendedCost = recommendedCost * parseInt(fuelPrice); //multiply by fuel cost
  recommendedCost = recommendedCost / parseInt(passValue); //split cost between passengers
  recommendedCost = recommendedCost * parseInt(profValue); //profit multiplier
  recommendedCost = Math.ceil(recommendedCost / 1) * 1;

  if(returned){
    recommendedCost = recommendedCost * 2;
    document.getElementById("type").innerHTML = "Return";
  }else{
    document.getElementById("type").innerHTML = "One Way";
  }
  console.log("Distance " + distance + " MPG " + carDetails + " Price " + fuelPrice + " Passenegers " + passValue + "Profit" + profValue);
  document.getElementById("recommendedPrice").innerHTML = "£" + recommendedCost.toFixed(2) + "/pp";
}

function getMPG() {
  $(document).ready(function() {
    var reg = document.getElementById("reg-box").value;
    var url = "https://uk1.ukvehicledata.co.uk/api/datapackage/VehicleData?v=2&api_nullitems=1&auth_apikey=7c455d3e-d468-4a9b-9486-82b6c82b1a32&user_tag=&key_VRM="+reg;
    $.getJSON(url, function(jsondata) {
      console.log(jsondata.Response.DataItems.TechnicalDetails.Consumption.Combined.Mpg);
      mpg = jsondata.Response.DataItems.TechnicalDetails.Consumption.Combined.Mpg;
      document.getElementById("vehicleMPG").innerHTML = mpg+"mpg";
      window.location.href = "/main#4";
    });
  });
}

function postJourney(){
  startDest = document.getElementById("startDest").innerHTML;
  endDest = document.getElementById("endDest").innerHTML;
  reg = document.getElementById("vehicleDetail").innerHTML;
  passValue = document.getElementById("noPassengers").innerHTML;
  fuelPrice = document.getElementById("fuelCost").innerHTML;
  mpg = document.getElementById("vehicleMPG").innerHTML;
  recommendedPrice = document.getElementById("recommendedPrice").innerHTML;
  $.post('/addjourney',{
    Start: startDest,
    End: endDest,
    pass: passValue,
    reg: reg,
    fcost: fuelPrice,
    mpg: mpg,
    rec:recommendedPrice
  });
}

$(document).ready(function(){
    $('#dropgarage').change(function(){
         var reg= this.value;
         document.getElementById("gar-reg").innerHTML = reg;

    });
});

var host = window.location.host;
var url = window.location.href;

// if(url.indexOf(url + "#loginError") != -1) {
//   url = "http://" + host +
//
//   ur = url + "#loginError"
//   alert("YAYEET "+url)
//   alert(ur)
//   document.getElementById('id01').style.display = "block";
// } else{
//   ur = url + "#loginError"
//   alert("YAYEET "+url)
//   alert(ur)
// }

function isValidPath(str, path) {
  str = str.substring(str.indexOf('://') + 3);
  str = str.substring(str.indexOf('#') + 1);
  return (str.indexOf(path) == 0);
}
$(window).load(function(){
  if (isValidPath(url, 'loginError') == true){
    document.getElementById('id01').style.display = "block";
  }else{
    alert("YAYEET")
  }
});
