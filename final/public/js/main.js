
'use strict';

//Writing button handlers

$('#sub1').click(function() {
	T();
	return false;
});

$('#sub2').click(function() {
	getMPG();
	return false;
});

$('#addj').click(function() {
	$.get( "/userLoggedIn", function(data) {
			if(data == ""){
				document.getElementById("msg").innerHTML = "Please Login";
			} else {
				var jnyBox = document.getElementById('jny-box').value
				if(jnyBox == ""){
					document.getElementById("msg").innerHTML = "Please supply a journey name";
				} else {
					postJourney();
				}
      }});
	return false;
});

$('#editbtn').click(function() {
	editProfile();
	return false;
});

$('#edit-switch').click(function(){
	editSwitch();
	return false;
})

//Check if the 'Remove Car' button is clicked on the 'Garage' page
$('#delcar').click(function() {
	//'Remove Car' is clicked
	postRemCar(); //Run the script to remove the car from the database
	return false;
});

//Check if the 'Remove Journey' button is clicked on the 'Saved Journeys' page
$('#deljny').click(function() {
	//'Remove Journey' is clicked
	postRemJny(); //Run the script to remove the journey from the database
	return false;
});

//Check if the 'Calculate Journey' button is clicked on the 'Main' page
$('#recbtn').click(function() {
	//'Calculate Journey' is clicked
	calculateJourney(); //Calculate the journey
	return false;
});
