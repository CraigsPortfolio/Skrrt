//This JavaScript file allows the user to choose either to enter car details by registration
//number or manually in the 'Car Details' section.

function regSwitch(){
  $(document).ready(function(){ //Executes when page is ready

  //Checks if the manual method is shown
  if($('#man-car:visible').length == 0)
  {
    //Registration method is shown
      $("#reg-car").hide(); //Hide registration field
      $("#man-car").show(); //Show manual fields
      $("a#switchbtn").text("Enter Registation"); //Change button text
  }
  else{
    //Manual fields are shown
    $("#man-car").hide(); //Hide manual fields
    $("#reg-car").show(); //Show registration field
    $("a#switchbtn").text("Enter Manually"); //Change button text
  }
});
}
