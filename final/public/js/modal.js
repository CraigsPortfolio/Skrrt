// Get the modal
var modal = $("#id01");
$("#errorMSG").hide();

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function isValidPath(str, path) {
  str = str.substring(str.indexOf('://') + 3);
  str = str.substring(str.indexOf('#') + 1);
  return (str.indexOf(path) == 0);
}

var url = window.location.href;
$(document).ready(function(){
  if (isValidPath(url, 'loginError') == true){
    document.getElementById('id01').style.display = "block";
    $("errorMSG").show();
    document.getElementById('errorMSG').style.color = "red";
  }
});
