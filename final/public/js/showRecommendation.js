//This JavaScript file makes the calculation section visible
//Using JQuery
function showRecommendation(){
$(document).ready(function(){ //Waiting until document is fully loaded
  if($("Start").text !="" && $("End").text !="" && $("fuelPrice-box").text !="" && $("reg-box").text !=""){
  $("#recommendation").show(); //Showing recommendation section
  alert(document.getElementById("fuelPrice-box").innerHTML);
  //Scrolling to the recommendation
  $('html, body').animate({
        scrollTop: $("#7").offset().top
    }, 0);
  }else{
    alert("asdasd");
  }
});
}
