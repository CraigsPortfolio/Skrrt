$(document).ready(function(){

  $(".car-info-form").hide();
  $(".location-form").hide();
  $(".car-info").css("background", "#c4c4c4");
  $(".location").css("background", "#c4c4c4");

  $(".car-info").click(function(){
    $(".details-form").hide();
    $(".car-info-form").show();
    $(".location-form").hide();
    $(".details").css("background", "#c4c4c4");
    $(".location").css("background", "#c4c4c4");
    $(".car-info").css("background", "#fff");
  });

  $(".details").click(function(){
    $(".details-form").show();
    $(".car-info-form").hide();
    $(".location-form").hide();
    $(".car-info").css("background", "#c4c4c4");
    $(".location").css("background", "#c4c4c4");
    $(".details").css("background", "#fff");
  });

  $(".location").click(function(){
    $(".details-form").hide();
    $(".car-info-form").hide();
    $(".location-form").show();
    $(".car-info").css("background", "#c4c4c4");
    $(".details").css("background", "#c4c4c4");
    $(".location").css("background", "#fff");
  });

  $("#personal-details_btn").click(function(event) {
    $(".car-info").click();
  });

  $("#car-details_btn").click(function(event) {
    $(".location").click();
  });











});
