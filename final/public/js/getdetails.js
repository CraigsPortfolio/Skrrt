
function getResults(){
  var ApiKey = "7c455d3e-d468-4a9b-9486-82b6c82b1a32";
  var VRM = "KM14AKK";
  var DataPackage = "VehicleData";
  var QueryString Optionals = "&api_nullitems=1";
  var ApiVersion = 2;
  var URL = "https://uk1.ukvehicledata.co.uk/api/datapackage/" + DataPackage + "?v=" + ApiVersion + QueryStringOptionals + "&key_vrm=" + VRM + "&auth_apikey=" + ApiKey;
  $.getJSON(URL, function(res){
    console.log("RES"+res);
  })
}
