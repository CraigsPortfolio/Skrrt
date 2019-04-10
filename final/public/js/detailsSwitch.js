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

function getResults(){
  var ApiKey = "7c455d3e-d468-4a9b-9486-82b6c82b1a32";
  var VRM = "KM14AKK";
  var DataPackage = "VehicleData";
  var QueryString Optionals = "&api_nullitems=1";
  var ApiVersion = 2;
  var URL = "https://uk1.ukvehicledata.co.uk/api/datapackage/" + DataPackage + "?v=" + ApiVersion + QueryStringOptionals + "&key_vrm=" + VRM + "&auth_apikey=" + ApiKey;
  $.getJSON(URL, function(res){
    console.log("RES"+res);
  });
}
