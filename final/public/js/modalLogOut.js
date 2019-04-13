// Get the modal
var modal = document.getElementById('id02');
document.getElementById('errorMSG').style.visibility = "hidden"

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
    $.post('/logout');
  }
});
