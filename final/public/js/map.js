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
      alert("Please make sure location isn't blank")
  })
}

//This function calculates the journey cost
function calculateJourney() {
  //Get the input information from the page
  var startDest = $("#Start").val();
  var endDest = $("#End").val();
  var fuelPrice = $("#fuelPrice-box").val();
  var carDetails = $("#reg-box").val();
  var passValue = $("#myRange").val();
  var profValue = $("#myRange2").val();
  var returned = $("#return").is(':checked');

  //Doing the calculation
  recommendedCost = parseInt(distance) / 1000; //Converting to km
  recommendedCost = recommendedCost / 100; //Calculating fuel consumption / 100 km
  recommendedCost = recommendedCost * 100 / ((parseInt(mpg) * 1.609) / 4.546); //Calculating amount of fuel burned
  recommendedCost = recommendedCost * parseInt(fuelPrice); //Multiplying by fuel price to find cost of journey
  recommendedCost = recommendedCost / parseInt(passValue); //Splitting cost between passengers
  recommendedCost = recommendedCost * parseInt(profValue); //Adding the profit multiplier
  recommendedCost = Math.ceil(recommendedCost / 1) * 1; //Rounding to the nearest whole number

  //Displaying the information in the recommendation section
  $("#startDest").html(startDest);
  $("#endDest").html(endDest);
  $("#vehicleDetail").html(carDetails);
  $("#noPassengers").html(passValue);
  $("#fuelCost").html(fuelPrice);
  $("#prof").html(profValue);

  //Checking if the journey is a return one or not
  if(returned){ //Journey is a return
    recommendedCost = recommendedCost * 2; //Multiply journey cost by 2
    $("#type").html("Return");//Displaying the return journey type
  }else{ //Journey is one-way
    $("#type").html("One Way"); //Displaying the return journey type
  }

  //Displaying the recommended journey charge
  $("#recommendedPrice").html("£" + recommendedCost.toFixed(2) + "/pp");
}

//This function makes an API call to UKVehicleData to get the MPG of a car given the registration number
function getMPG() {
  $(document).ready(function() {
    var reg = $("#reg-box").val();
    var url = "https://uk1.ukvehicledata.co.uk/api/datapackage/VehicleData?v=2&api_nullitems=1&auth_apikey=7c455d3e-d468-4a9b-9486-82b6c82b1a32&user_tag=&key_VRM="+reg;
    $.getJSON(url, function(jsondata) {
      mpg = jsondata.Response.DataItems.TechnicalDetails.Consumption.Combined.Mpg;
      $("#vehicleMPG").html(mpg+"mpg");
      window.location.href = "/main#4";
    });
  });
}

//This function sends data to the server to save a journey
function postJourney(){
  //Get the input information from the main page
  startDest = $("#startDest").html();
  endDest = $("#endDest").html();
  reg = $("#vehicleDetail").html();
  passValue = $("#noPassengers").html();
  fuelPrice = $("#fuelCost").html();
  mpg = $("#vehicleMPG").html();
  recommendedPrice = $("#recommendedPrice").html();
  profValue = $("#myRange2").val();
  name = $("#jny-box").val();

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
  $("#msg").html("Journey saved succesfully");
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
    $("#car-reg").html(data.reg);
    $("#car-make").html(data.make);
    $("#car-model").html(data.model);
    $("#car-mpg").html(data.mpg);
    $("#car-fuel").html(data.ftype);

    //Update the drop down box on the 'Garage' page
    $("#dropgarage").empty(); //Empty the drop down box of the old cars

    //Add a new option to the drop down box for every car saved for the user
    for(var i=0; i < data.options.length + 1; i++){
      var option = $('<option></option>').text(data.options[i].reg);
      $("#dropgarage").append(option);
    }
}else{ //User has no saved cars left
  //Hide all the car fields
  $("#car-make-row").hide();
  $("#car-model-row").hide();
  $("#car-mpg-row").hide();
  $("#car-fuel-row").hide();
  $("#car-reg-row").hide();
  $("#dropgarage").hide();
  $("#delcar").hide();

  //Display that the user has no cars saved
  $("#garage-blurb").html("You have no cars saved in your garage :(");
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
    $("#jny-name").html(data.name);
    $("#jny-start").html(data.start);
    $("#jny-end").html(data.end);
    $("#jny-reg").html(data.reg);
    $("#jny-mpg").html(data.mpg);
    $("#jny-pass").html(data.pass);
    $("#jny-fuel").html(data.fuel);
    $("#jny-prof").html(data.profit);
    $("#jny-rec").html(data.rec);

    //Update the drop down box
    $("#dropjourney").empty(); //Remove old journeys from the drop down boxes

    //Add a new option for every journey
    for(var i=0; i < data.options.length + 1; i++){
    var option = $('<option></option>').text(data.options[i].name);
    $("#dropjourney").append(option);
  }
}else{ //User has no saved journeys left
  //Hide all the journey fields on the journey page
  $("#jny-name-row").hide();
  $("#jny-start-row").hide();
  $("#jny-end-row").hide();
  $("#jny-reg-row").hide();
  $("#jny-mpg-row").hide();
  $("#jny-pass-row").hide();
  $("#jny-fuel-row").hide();
  $("#jny-rec-row").hide();
  $("#jny-prof-row").hide();
  $("#dropjourney").hide();
  $("#deljny").hide();

  //Inform the user they have no saved journeys left
  $("#journey-blurb").html("You have no saved journeys :(")
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
           $("#car-reg").html(data.reg);
           $("#car-make").html(data.make);
           $("#car-model").html(data.model);
           $("#car-mpg").html(data.mpg);
           $("#car-fuel").html(data.ftype);
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
           $("#jny-name").html(data.name);
           $("#jny-start").html(data.start);
           $("#jny-end").html(data.end);
           $("#jny-reg").html(data.reg);
           $("#jny-pass").html(data.pass);
           $("#jny-fuel").html(data.fcost);
           $("#jny-rec").html(data.rec);
           $("#jny-prof").html(data.profit);
           $("#jny-mpg").html(data.mpg);
         });
    });
});

//This function asks the server to edit the user's profile
function editProfile(){
  //Get the input information from the profile page
  var fname = $("#NewFirst").val();
  var surname = $("#NewLast").val();
  var username = $("#NewUser").val();
  var pword = $("#NewPass").val();

  //Checking that no fields are blank
  if(fname==""||surname==""||username==""||pword==""){ //A field is blank
    //Display error message
    $("#msg").html("Please check that all fields are filled in before submitting!");
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
      $("#msg").html("Profile Changed");
    $("#pro-first").html("Name: " + data.fname + " " + data.surname);
     $("#pro-user").html("Username: " + data.username);
  }else{ //Username is taken
    //Inform user that username is taken
    $("#msg").html(data.msg);
  }
  });
}


//This function runs when the garage page is loaded to check if there is any saved cars or not
function getGarage(){
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
}

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

//This function tells the server to add a car to the database
function addCar(){
  //Get the data from the form
  var make = $("#newmake").val();
  var model = $("#newmodel").val();
  var year = $("#newyear").val();
  var mpg = $("#newmpg").val()
  var fuel = $("#newfuel").val();
  var reg = $("#newreg").val();

  //Check that no fields are empty
  if(make==""||model==""||year==""||mpg==""||fuel==""||reg==""){ //A field is empty
    //Display error message
    $("#newmsg").html("Please check that no fields are left blank before submitting");
    return; //Stop the function
  }

  //Fields are not empty so check that the reg isn't in use
  $.post('/checkreg', { //Asking our server to run the '/checkreg' route
    reg:reg}, //Sending our reg to the server
  function(data){
    if(data.msg!=""){ //Reg is taken
      $("#newmsg").html(data.msg); //Displaying error message
    }else{ //Reg is available
      $("#newmsg").html("");; //Clear error message
      $("#newcarform").submit(); //Add the car to the database
    }
  })
}

$(document).ready(function(){
//This JavaScript section changes the number of passengers selected being displayed
//According to the passenger range slider

var slider = document.getElementById("myRange"); //Gets passenger slider element and stores it in local variable
var output = document.getElementById("demo"); //Gets text element and stores it in local variable

//Initialising the output
output.innerHTML = "Number of passengers: " + slider.value;

//Responding to manipulation of passenger slider
slider.oninput = function() {
  output.innerHTML = "Number of passengers: " + this.value;
}

//This JavaScript section changes the profit multiplier selected being displayed
//According to the profit range slider
var slider2 = document.getElementById("myRange2"); //Gets profit slider element and stores it in local variable
var output2 = document.getElementById("demo2"); //Gets text element and stores it in local variable

//Initialising the output
output2.innerHTML = "Break Even";

//Responding to manipulation of profit slider
slider2.oninput = function() {
  if(this.value==1){
    output2.innerHTML = "Break Even";
  }
  if(this.value==2){
    output2.innerHTML = "Reasonable";
  }
  if(this.value==3){
    output2.innerHTML = "Fair";
  }
  if(this.value==4){
    output2.innerHTML = "Greedy";
  }
  if(this.value==5){
    output2.innerHTML = "Taking The P**S";
  }
}

});

//This function makes the calculation section visible
//Using JQuery
function showRecommendation(){
$(document).ready(function(){ //Waiting until document is fully loaded
  //Checking that the fields aren't blank
  if(document.getElementById("Start").value !="" && document.getElementById("End").value !=""  && document.getElementById("fuelPrice-box").value !="" && document.getElementById("reg-box").value !=""){
    //Fields are valid
  $("#recommendation").show(); //Showing recommendation section
  //Scrolling to the recommendation
  $('html, body').animate({
        scrollTop: $("#7").offset().top
    }, 0);
  }else{ //Fields are invalid
    //Show error message
    document.getElementById("msg-show").innerHTML = "Please make sure all data is entered correctly before calculating!";
  }
});
}


$(document).ready(function() {
  //on load hide the Car info and Location forms.
  $(".car-info-form").hide();
  $(".car-info").css("background", "#c4c4c4");

  //When details tab clicked show details and hide car info and location.
  $(".details").click(function() {
    $(".details-form").show();
    $(".car-info-form").hide();
    $(".car-info").css("background", "#c4c4c4");
    $(".details").css("background", "#fff");
  });

  //When car info tab clicked show car info and hide details and location.
  $(".car-info").click(function() {
    $(".details-form").hide();
    $(".car-info-form").show();
    $(".details").css("background", "#c4c4c4");
    $(".car-info").css("background", "#fff");
  });

  //Validates form 1 on the details tab. If all fields are entered correctly lets you move on to next tab.
  var validate1 = $("#validate1");
  $("#personal-details_btn").click(function() {
    if (validate1.valid() === true) {
      $(".car-info").click();
    } else {
      console.log("Please supply correct information"); //logs when incorrect user input is entered
    }
  });

  $("#confirm_btn").click(function() {
    $(".details-form").show();
    if (validate1.valid() === true){
      document.forms['validate1'].submit();
      $(".details-form").hide();
    } else {
      $(".details-form").hide();
      $("#reg-error").html("Please ensure you leave no fields blank before pressing submit! These may be on the other tab.");
    }
  });

  //this is the rules for form 1. Specifies the input box and what kind of validation you want.
  validate1.validate({
    rules: {
      fname: {
        required: true,
      },
      surname: {
        required: true,
      },
      username: {
        required: true,
      },
      password: {
        required: true
      },
      make: {
        required: true,
      },
      model: {
        required: true,
      },
      year: {
        required: true,
      },
      ftype: {
        required: true,
      },
      mpg: {
        required: true,
      },
      reg: {
        required: true,
      }
    }
  });
});


$(window).on('load', function() {
	/*------------------
		Preloder
	--------------------*/
	$(".loader").fadeOut();
	$("#preloder").delay(400).fadeOut("slow");

});

(function($) {
	/*------------------
		Navigation
	--------------------*/
	$('.nav-switch').on('click', function(event) {
		$(this).toggleClass('active');
		$('.nav-warp').slideToggle(400);
		event.preventDefault();
	});


	/*------------------
		Background Set
	--------------------*/
	$('.set-bg').each(function() {
		var bg = $(this).data('setbg');
		$(this).css('background-image', 'url(' + bg + ')');
	});


	/*------------------
		Progress Bar
	--------------------*/
	$('.progress-bar-style').each(function() {
		var progress = $(this).data("progress");
		var bgcolor = $(this).data("bgcolor");
		var prog_width = progress + '%';
		if (progress <= 100) {
			$(this).append('<div class="bar-inner" style="width:' + prog_width + '; background: '+ bgcolor +';"><span>' + prog_width + '</span></div>');
		}
		else {
			$(this).append('<div class="bar-inner" style="width:100%; background: '+ bgcolor +';"><span>100%</span></div>');
		}
	});

	/*------------------
		Circle progress
	--------------------*/
	$('.circle-progress').each(function() {
		var cpvalue = $(this).data("cpvalue");
		var cpcolor = $(this).data("cpcolor");
		var cptitle = $(this).data("cptitle");
		var cpid 	= $(this).data("cpid");

		$(this).append('<div class="'+ cpid +' loader-circle"></div><div class="progress-info"><h2>'+ cpvalue +'%</h2><p>'+ cptitle +'</p></div>');

		if (cpvalue < 100) {

			$('.' + cpid).circleProgress({
				value: '0.' + cpvalue,
				size: 110,
				thickness: 7,
				fill: cpcolor,
				emptyFill: "rgba(0, 0, 0, 0)"
			});
		} else {
			$('.' + cpid).circleProgress({
				value: 1,
				size: 110,
				thickness: 7,
				fill: cpcolor,
				emptyFill: "rgba(0, 0, 0, 0)"
			});
		}

	});

})(jQuery);
