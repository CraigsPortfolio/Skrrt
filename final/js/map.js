function myMap() {
var mapProp= {
  center:new google.maps.LatLng(57.119647,-2.139528),
  zoom:13,
};
var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
var map2 = new google.maps.Map(document.getElementById("googleMap2"),mapProp);
}
