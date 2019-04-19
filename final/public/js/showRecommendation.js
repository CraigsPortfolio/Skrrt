//This function makes the calculation section visible
//Using JQuery
function showRecommendation(){
$(document).ready(function(){ //Waiting until document is fully loaded
  //Checking that the fields aren't blank
  if( $("#Start").val()!="" && $("#End").val() !=""  && $("#fuelPrice-box".)val()!="" && $("#reg-box").val()!=""){
    //Fields are valid
  $("#recommendation").show(); //Showing recommendation section
  //Scrolling to the recommendation
  $('html, body').animate({
        scrollTop: $("#7").offset().top
    }, 0);
  }else{ //Fields are invalid
    //Show error message
    $("#msg-show").html("Please make sure all data is entered correctly before calculating!");
  }
});
}
