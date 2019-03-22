//This JavaScript file changes the number of passengers selected being displayed
//According to the range slider

var slider = document.getElementById("myRange"); //Gets slider element and stores it in local variable
var output = document.getElementById("demo"); //Gets text element and stores it in local variable

//Initialising the output
output.innerHTML = "Number of passengers: " + slider.value;


//Responding to manipulation of slider
slider.oninput = function() {
  output.innerHTML = "Number of passengers: " + this.value;
}
