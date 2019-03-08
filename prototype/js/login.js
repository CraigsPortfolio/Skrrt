$(document).ready(function() {
//on load hide the Car info and Location forms.
  $(".car-info-form").hide();
  $(".location-form").hide();
  $(".car-info").css("background", "#c4c4c4");
  $(".location").css("background", "#c4c4c4");

  //When details tab clicked show details and hide car info and location.
  $(".details").click(function() {
    $(".details-form").show();
    $(".car-info-form").hide();
    $(".location-form").hide();
    $(".car-info").css("background", "#c4c4c4");
    $(".location").css("background", "#c4c4c4");
    $(".details").css("background", "#fff");
  });

  //When car info tab clicked show car info and hide details and location.
  $(".car-info").click(function() {
    $(".details-form").hide();
    $(".car-info-form").show();
    $(".location-form").hide();
    $(".details").css("background", "#c4c4c4");
    $(".location").css("background", "#c4c4c4");
    $(".car-info").css("background", "#fff");
  });

  //When location tab clicked show location and hide details and car info.
  $(".location").click(function() {
    $(".details-form").hide();
    $(".car-info-form").hide();
    $(".location-form").show();
    $(".car-info").css("background", "#c4c4c4");
    $(".details").css("background", "#c4c4c4");
    $(".location").css("background", "#fff");
  });

  //Validates form 1 on the details tab. If all fields are entered correctly lets you move on to next tab.
  var validate1 = $("#validate1");
  $("#personal-details_btn").click(function() {
    if (validate1.valid() === true) {
      $(".car-info").click();
     } else {
       console.log("Please supply correct information"); //logs when incorrect user input is entered
    }
  });

  //Validates form 2 on the car details tab. If all fields are entered correctly lets you move on to next tab.
  var validate2 = $("#validate2");
  $("#car-details_btn").click(function() {
    if (validate2.valid() === true) {
      $(".location").click();
     } else {
       console.log("Please supply correct information"); //logs when incorrect user input is entered
    }
  });

  //Validates form 3 on the location tab. If all fields are entered correctly lets you move on to next tab.
  var validate3 = $("#validate3");
  $("#confirm_btn").click(function() {
    if (validate3.valid() === true) {
      //for testing purposes just alerts all user input
      var f1 = $("input[name=field1]").val();
      var f2 = $("input[name=field2]").val();
      var f3 = $("input[name=field3]").val();
      var f4 = $("input[name=field4]").val();
      var f5 = $("input[name=field5]").val();
      var f6 = $("input[name=field6]").val();
      var f7 = $("input[name=field7]").val();
      var f8 = $("input[name=field8]").val();
      var f9 = $("input[name=field9]").val();
      var f10 = $("input[name=field10]").val();
      var f11 = $("input[name=field11]").val();

      alert("Welcome " + f1 );
     } else {
       console.log("Please supply correct information"); //logs when incorrect user input is entered
    }
  });

  //this is the rules for form 1. Specifies the input box and what kind of validation you want.
  validate1.validate({
    rules: {
      field1: {
        required: true,
        minlength: 2
      },
      field2: {
        required: true,
        minlength: 2
      },
      field3: {
        required: true,
        email: true
      },
      field4: {
        required: true
      },
      field5: {
        required: true,
      }
    }
  });

  //this is the rules for form 2. Specifies the input box and what kind of validation you want.
  validate2.validate({
    rules: {
      field6: {
        required: true,
      },
      field7: {
        required: true,
      },
      field8: {
        required: true,
        digits: true
      }
    }
  });

  //this is the rules for form 3. Specifies the input box and what kind of validation you want.
  validate3.validate({
    rules: {
      field9: {
        required: true,
        minlength: 2
      },
      field10: {
        required: true,
        minlength: 2
      },
      field11: {
        required: true,
        minlength: 2
      }
    }
  });
});
