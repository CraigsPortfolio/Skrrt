//This JavaScript file makes the calculation section visible
//Using JQuery
function showRecommendation(){
$(document).ready(function(){ //Waiting until document is fully loaded
  select(""){
    case document.getElementById("reg-box").value:
      alert("Mwo");
      break;
    default:
      alert("measdasd");
  }
  if(document.getElementById("Start").value !="" && document.getElementById("End").value !=""  && document.getElementById("fuelPrice-box").value !="" && document.getElementById("reg-box").value !=""){
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
