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
