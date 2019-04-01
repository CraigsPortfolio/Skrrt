//This JavaScript file makes the calculation section visible
//Using JQuery
function showRecommendation(){
$(document).ready(function(){ //Waiting until document is fully loaded
  $("#recommendation").show(); //Showing recommendation section

  //Scrolling to the recommendation
  $('html, body').animate({
        scrollTop: $("#5").offset().top
    }, 0);
});
}
