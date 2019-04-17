//This JavaScript file checks if a user has visited the 'About Us' before
//And redirects them to the main page if they are a returning visitor

//Sets a cookie if they are new
function setCookie(cname,cvalue,exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

//Gets cookies from browser, if any
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//Main function
//Checks cookies
function checkCookie(){
  //Gets the cookies
  var user=getCookie("username");

  var main = "http://bermuda-legend-8080.codio.io/main";
  var profile = "http://bermuda-legend-8080.codio.io/profile";
  var garage = "http://bermuda-legend-8080.codio.io/garage";
  var journey = "http://bermuda-legend-8080.codio.io/journey";
  var newcar = "http://bermuda-legend-8080.codio.io/newcar";
  var register = "http://bermuda-legend-8080.codio.io/register";
  //Checks if user attribute of cookie is blank
  //If so user is new
  if (user != "") {
    alert(document.referrer);
  //User is a returning visitor
      //If navigated from any other page on site then cancel redirect
      if(document.referrer != main){
      //Navigated externally so do not redirect
      document.location = "/main";
  	   }
  } else {
    //User is new
     user = "visited";
     if (user != "" && user != null) {
      //Sets the cookie if valid
       setCookie("username", user, 30);
     }
  }
}
