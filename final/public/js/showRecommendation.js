//This JavaScript file makes the calculation section visible
//Using JQuery
function showRecommendation(){
$(document).ready(function(){ //Waiting until document is fully loaded
  if(document.getElementById("Start").innerHTML !="" && document.getElementById("End").innerHTML !="" !="" && document.getElementById("fuelPrice-box").innerHTML !="" && document.getElementById("reg").innerHTML !=""){
  $("#recommendation").show(); //Showing recommendation section
  //Scrolling to the recommendation
  $('html, body').animate({
        scrollTop: $("#7").offset().top
    }, 0);
  }else{
    alert("Error, empty fields present. Please make sure all data is entered correctly before calculating!");
  }
});
}
