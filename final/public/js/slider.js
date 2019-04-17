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
  switch (this.value) {
    case 1:
      output2.innerHTML = "Break Even";
      break;
    case 2:
      output2.innerHTML = "Reasonable";
      break;
    case 3:
      output2.innerHTML = "Fair";
      break;
    case 4:
      output2.innerHTML = "Greedy";
      break;
    case 5:
      output2.innerHTML = "Taking The P**S";
      break;
    default:
  }
}
