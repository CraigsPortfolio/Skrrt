$(document).ready(function() {
  //on load hide the Car info and Location forms.
  $(".car-info-form").hide();
  $(".car-info").css("background", "#c4c4c4");

  //When details tab clicked show details and hide car info and location.
  $(".details").click(function() {
    $(".details-form").show();
    $(".car-info-form").hide();
    $(".car-info").css("background", "#c4c4c4");
    $(".details").css("background", "#fff");
  });

  //When car info tab clicked show car info and hide details and location.
  $(".car-info").click(function() {
    $(".details-form").hide();
    $(".car-info-form").show();
    $(".details").css("background", "#c4c4c4");
    $(".car-info").css("background", "#fff");
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

  $("#confirm_btn").click(function() {
    if (validate1.valid() === true){
      document.forms['validate1'].submit();
    } else {
      console.log("error");
    }
  });

  //this is the rules for form 1. Specifies the input box and what kind of validation you want.
  validate1.validate({
    rules: {
      fname: {
        required: true,
      },
      surname: {
        required: true,
      },
      username: {
        required: true,
      },
      password: {
        required: true
      },
      make: {
        required: true,
      },
      model: {
        required: true,
      },
      year: {
        required: true,
      },
      ftype: {
        required: true,
      },
      mpg: {
        required: true,
      },
      reg: {
        required: true,
      }
    }
  });
});
// 
// $(document).ready(function() {
//   //Validates form 1 on the details tab. If all fields are entered correctly lets you move on to next tab.
//   var validate2 = $("#newcarform");
//   $("#addcarbtn").click(function() {
//     alert("LCIED");
//     if (validate2.valid() === true){
//       document.forms['validate2'].submit();
//     } else {
//       console.log("error");
//     }
//   });
//
//   //this is the rules for form 1. Specifies the input box and what kind of validation you want.
//   validate2.validate({
//     rules: {
//       make: {
//         required: true,
//       },
//       model: {
//         required: true,
//       },
//       year: {
//         required: true,
//       },
//       ftype: {
//         required: true,
//       },
//       mpg: {
//         required: true,
//       },
//       reg: {
//         required: true,
//       }
//     }
//   });
// });
