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

//This function calculates the journey cost
function calculateJourney() {
  //Get the input information from the page
  var startDest = document.getElementById("Start").value;
  var endDest = document.getElementById("End").value;
  var fuelPrice = document.getElementById("fuelPrice-box").value;
  var carDetails = document.getElementById("reg-box").value;
  var passSlider = document.getElementById('myRange');
  var passValue = passSlider.value;
  var profitSlider = document.getElementById('myRange2');
  var profValue = profitSlider.value;
  var returned = document.getElementById("return").checked

  //Doing the calculation
  recommendedCost = parseInt(distance) / 1000; //Converting to km
  recommendedCost = recommendedCost / 100; //Calculating fuel consumption / 100 km
  recommendedCost = recommendedCost * 100 / ((parseInt(mpg) * 1.609) / 4.546); //Calculating amount of fuel burned
  recommendedCost = recommendedCost * parseInt(fuelPrice); //Multiplying by fuel price to find cost of journey
  recommendedCost = recommendedCost / parseInt(passValue); //Splitting cost between passengers
  recommendedCost = recommendedCost * parseInt(profValue); //Adding the profit multiplier
  recommendedCost = Math.ceil(recommendedCost / 1) * 1; //Rounding to the nearest whole number

  //Displaying the information in the recommendation section
  document.getElementById("startDest").innerHTML = startDest;
  document.getElementById("endDest").innerHTML = endDest;
  document.getElementById("vehicleDetail").innerHTML = carDetails;
  document.getElementById("noPassengers").innerHTML = passValue;
  document.getElementById("fuelCost").innerHTML = fuelPrice;
  document.getElementById("prof").innerHTML = profValue;

  //Checking if the journey is a return one or not
  if(returned){ //Journey is a return
    recommendedCost = recommendedCost * 2; //Multiply journey cost by 2
    document.getElementById("type").innerHTML = "Return"; //Displaying the return journey type
  }else{ //Journey is one-way
    document.getElementById("type").innerHTML = "One Way"; //Displaying the return journey type
  }

  //Displaying the recommended journey charge
  document.getElementById("recommendedPrice").innerHTML = "£" + recommendedCost.toFixed(2) + "/pp";
}

//This function makes an API call to UKVehicleData to get the MPG of a car given the registration number
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

//This function sends data to the server to save a journey
function postJourney(){
  //Get the input information from the main page
  startDest = document.getElementById("startDest").innerHTML;
  endDest = document.getElementById("endDest").innerHTML;
  reg = document.getElementById("vehicleDetail").innerHTML;
  passValue = document.getElementById("noPassengers").innerHTML;
  fuelPrice = document.getElementById("fuelCost").innerHTML;
  mpg = document.getElementById("vehicleMPG").innerHTML;
  recommendedPrice = document.getElementById("recommendedPrice").innerHTML;
  profitSlider = document.getElementById('myRange2');
  profValue = profitSlider.value;
  name = document.getElementById("jny-box").value;

  //Send the data to the server
  $.post('/addjourney',{ //Tells the server to run the '/addjourney' route
    //Setting the data
    jnyName: name,
    Start: startDest,
    End: endDest,
    pass: passValue,
    reg: reg,
    fcost: fuelPrice,
    mpg: mpg,
    rec:recommendedPrice,
    prof: profValue
  });

  //Display a confirmation message to the user
  document.getElementById("msg").innerHTML = "Journey saved succesfully";
}

//This function tells the server to delete a car from a profile
function postRemCar(){
  //Get the registration plate of the car to be deleted from the drop down box in the 'Garage' page
  reg= $("#dropgarage option:selected").text();

  //Tell the server to run the 'remcar' route to delete the car
  $.post('/remcar',{
    reg: reg, //Sending the reg to the server
  },function(data){
    //Check if there are any cars left saved for the user
    if(data.reg!="No car"){ //The user has saved cars
    //Display the first car on the screen
    document.getElementById("car-reg").innerHTML = data.reg;
    document.getElementById("car-make").innerHTML = data.make;
    document.getElementById("car-model").innerHTML = data.model;
    document.getElementById("car-mpg").innerHTML = data.mpg;
    document.getElementById("car-fuel").innerHTML = data.ftype;

    //Update the drop down box on the 'Garage' page
    $("#dropgarage").empty(); //Empty the drop down box of the old cars

    //Add a new option to the drop down box for every car saved for the user
    for(var i=0; i < data.options.length + 1; i++){
      var option = $('<option></option>').text(data.options[i].reg);
      $("#dropgarage").append(option);
    }
}else{ //User has no saved cars left
  //Hide all the car fields
  document.getElementById("car-make-row").hidden = true;
  document.getElementById("car-model-row").hidden = true;
  document.getElementById("car-mpg-row").hidden = true;
  document.getElementById("car-fuel-row").hidden = true;
  document.getElementById("car-reg-row").hidden = true;
  document.getElementById("dropgarage").hidden = true;
  document.getElementById("delcar").hidden = true;

  //Display that the user has no cars saved
  document.getElementById("garage-blurb").innerHTML = "You have no cars saved in your garage :(";
}
  });
}

//This function tells the server to delete a journey for a user
function postRemJny(){
  //Gets the name of the journey to be deleted from the users journeys
  name= $("#dropjourney option:selected").text();

  //Tells the server to run the 'remjourney' route to delete the journey
  $.post('/remjourney',{
    name: name, //Sends the name of the journey to the server
  },function(data){
    //Check if the user has any saved journeys left
    if(data.name!= "No journey"){ //User has saved journeys
      //Display the first journey to the screen
    document.getElementById("jny-name").innerHTML = data.name;
    document.getElementById("jny-start").innerHTML = data.start;
    document.getElementById("jny-end").innerHTML = data.end;
    document.getElementById("jny-reg").innerHTML = data.reg;
    document.getElementById("jny-mpg").innerHTML = data.mpg;
    document.getElementById("jny-pass").innerHTML = data.pass;
    document.getElementById("jny-fuel").innerHTML = data.fuel;
    document.getElementById("jny-prof").innerHTML = data.prof;
    document.getElementById("jny-rec").innerHTML = data.rec;

    //Update the drop down box
    $("#dropjourney").empty(); //Remove old journeys from the drop down boxes

    //Add a new option for every journey
    for(var i=0; i < data.options.length + 1; i++){
    var option = $('<option></option>').text(data.options[i].name);
    $("#dropjourney").append(option);
  }
}else{ //User has no saved journeys left
  //Hide all the journey fields on the journey page
  document.getElementById("jny-name-row").hidden = true;
  document.getElementById("jny-start-row").hidden = true;
  document.getElementById("jny-end-row").hidden = true;
  document.getElementById("jny-reg-row").hidden = true;
  document.getElementById("jny-mpg-row").hidden = true;
  document.getElementById("jny-pass-row").hidden = true;
  document.getElementById("jny-fuel-row").hidden = true;
  document.getElementById("jny-rec-row").hidden = true;
  document.getElementById("jny-prof-row").hidden = true;
  document.getElementById("dropjourney").hidden = true;
  document.getElementById("deljny").hidden=true;

  //Inform the user they have no saved journeys left
  document.getElementById("journey-blurb").innerHTML = "You have no saved journeys :(";
}
  });
}


//This function runs every time the user changes the selection in the 'Garage' drop down box
$(document).ready(function(){
    $('#dropgarage').change(function(){
         //Get the registration plate of the car selected
         var reg= this.value;

         //Ask the server to run the '/refresh' route to get the details of the car selected
         $.post('/refresh', {
           newreg: reg //Sending the reg to the server
         },function(data){
           //Displaying the car details on the screen
           document.getElementById("car-reg").innerHTML = data.reg;
           document.getElementById("car-make").innerHTML = data.make;
           document.getElementById("car-model").innerHTML = data.model;
           document.getElementById("car-mpg").innerHTML = data.mpg;
           document.getElementById("car-fuel").innerHTML = data.ftype;
         });
    });
});

//This function runs every time the user changes the selection in the 'Saved Journeys' drop down box
$(document).ready(function(){
    $('#dropjourney').change(function(){
         //Gets the name of the selected journey
         var name= this.value;

         //Asks the server to run the '/refreshJourney' route to get the details of the journey selected
         $.post('/refreshJourney', {
           name: name //Sends the name of the journey to the server
         },function(data){
           //Display the selected journey on the screen
           document.getElementById("jny-name").innerHTML = data.name;
           document.getElementById("jny-start").innerHTML = data.start;
           document.getElementById("jny-end").innerHTML = data.end;
           document.getElementById("jny-reg").innerHTML = data.reg;
           document.getElementById("jny-pass").innerHTML = data.pass;
           document.getElementById("jny-fuel").innerHTML = data.fcost;
           document.getElementById("jny-rec").innerHTML = data.rec;
           document.getElementById("jny-prof").innerHTML = data.profit;
           document.getElementById("jny-mpg").innerHTML = data.mpg;
         });
    });
});

//This function asks the server to edit the user's profile
function editProfile(){
  //Get the input information from the profile page
  var fname = document.getElementById("NewFirst").value;
  var surname = document.getElementById("NewLast").value;
  var username = document.getElementById("NewUser").value;
  var pword = document.getElementById("NewPass").value;

  //Checking that no fields are blank
  if(fname==""||surname==""||username==""||pword==""){ //A field is blank
    //Display error message
    document.getElementById("msg").innerHTML = "Please check that all fields are filled in before submitting!";
    return; //Do not update profile
  }
  //Asks the server to run the '/editprofile' route to edit the profile
  $.post('/editprofile',{
    //Sending the users edited first name, surname, username and password to the server
    fname:fname,
    surname:surname,
    username:username,
    pword:pword
  },function(data){
    //Checks if the username is taken or not
    if(data.msg == ""){ //Username is valid
      //Display the edited profile on the screen
    document.getElementById("msg").innerHTML = "";
    document.getElementById("pro-first").innerHTML = "Name: " + data.fname + " " + data.surname;
    document.getElementById("pro-user").innerHTML = "Username : " + data.username;
  }else{ //Username is taken
    //Inform user that username is taken
    document.getElementById("msg").innerHTML = data.msg;
  }
  });
}


//This function runs when the garage page is loaded to check if there is any saved cars or not
$(document).ready(function(){
  //Checking for saved cars
    if(document.getElementById("car-reg").innerHTML == "No car"){ //User has no saved cars
      //Hide all the car fields
      document.getElementById("car-make-row").hidden = true;
      document.getElementById("car-model-row").hidden = true;
      document.getElementById("car-mpg-row").hidden = true;
      document.getElementById("car-fuel-row").hidden = true;
      document.getElementById("car-reg-row").hidden = true;
      document.getElementById("dropgarage").hidden = true;
      document.getElementById("delcar").hidden = true;

      //Inform the user they have no saved cars
      document.getElementById("garage-blurb").innerHTML = "You have no cars saved in your garage :(";
    }
});

//This function runs when the 'Saved Journeys' page is loaded
$(document).ready(function(){
    //Check if the user has saved journeys
    if(document.getElementById("jny-name").innerHTML == "No journey"){ //User has no saved Journeys
      //Hide all the journey fields
      document.getElementById("jny-name-row").hidden = true;
      document.getElementById("jny-start-row").hidden = true;
      document.getElementById("jny-end-row").hidden = true;
      document.getElementById("jny-reg-row").hidden = true;
      document.getElementById("jny-mpg-row").hidden = true;
      document.getElementById("jny-pass-row").hidden = true;
      document.getElementById("jny-fuel-row").hidden = true;
      document.getElementById("jny-rec-row").hidden = true;
      document.getElementById("jny-prof-row").hidden = true;
      document.getElementById("dropjourney").hidden = true;
      document.getElementById("deljny").hidden=true;

      //Inform the user they have no saved journeys
      document.getElementById("journey-blurb").innerHTML = "You have no saved journeys :(";
    }
});

function addCar(){
  var make = document.getElementById("newmake").innerHTML;
  var model = document.getElementById("newmodel").innerHTML;
  var year = document.getElementById("newyear").innerHTML;
  var mpg = document.getElementById("newmpg").innerHTML;
  var fuel = document.getElementById("newfuel").innerHTML;
  var reg = document.getElementById("newreg").innerHTML;
  var msg = "";
  if(make==""||model==""||year==""||mpg==""||fuel==""||reg==""){
    msg = "Please check that no fields are left blank before submitting";
    document.getElementById("newmsg").innerHTML =msg;
    return;
  }

  $.post('checkreg', {
      reg:reg}, function(data){
    if(data.msg!=""){
      msg += data.msg;
    }else{
      msg="";
      document.forms['newcarform'].submit();
    }
  })
  document.getElementById("newmsg").innerHTML =msg;
}
