$(document).ready(function() {

  $(".car-info-form").hide();
  $(".location-form").hide();
  $(".car-info").css("background", "#c4c4c4");
  $(".location").css("background", "#c4c4c4");

  $(".details").click(function() {
    $(".details-form").show();
    $(".car-info-form").hide();
    $(".location-form").hide();
    $(".car-info").css("background", "#c4c4c4");
    $(".location").css("background", "#c4c4c4");
    $(".details").css("background", "#fff");
  });

  $(".car-info").click(function() {
    $(".details-form").hide();
    $(".car-info-form").show();
    $(".location-form").hide();
    $(".details").css("background", "#c4c4c4");
    $(".location").css("background", "#c4c4c4");
    $(".car-info").css("background", "#fff");
  });

  $(".location").click(function() {
    $(".details-form").hide();
    $(".car-info-form").hide();
    $(".location-form").show();
    $(".car-info").css("background", "#c4c4c4");
    $(".details").css("background", "#c4c4c4");
    $(".location").css("background", "#fff");
  });

  var validate1 = $("#validate1");
  $("#personal-details_btn").click(function() {
    if (validate1.valid() === true) {
      $(".car-info").click();
    } else {
      alert("Please supply correct information");
    }
  });

  var validate2 = $("#validate2");
  $("#car-details_btn").click(function() {
    if (validate2.valid() === true) {
      $(".location").click();
    } else {
      alert("Please supply correct information");
    }
  });

  var validate3 = $("#validate3");
  $("#confirm_btn").click(function() {
    if (validate3.valid() === true) {
      //Do Something with the user data
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

      alert(f1 + "" + f2 + "" + f3 + "" + f4 + "" + f5 + "" + f6 + "" + f7 + "" + f8 + "" + f9 + "" + f10 + "" + f11);
    } else {
      alert("Please supply correct information");
    }
  });

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
