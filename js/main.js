/*
 *  Copyright (c) 2016 Jake Cui, Doug Smith, and Jenny Huang
 *  Credits to the WebRTC project authors for API. All Rights Reserved.
 */

'use strict';

// Declaration of global variables
// ============================================================================================================ //

// Queries various values that will be accessed by HTML
var instantValueDisplay = document.querySelector('#instant .value');
var slowValueDisplay = document.querySelector('#slow .value');
var videoVolume = document.querySelector('#volume .value');

// The minimum starting volume for the application. Defaults to 10%
var min = 10;

// The maximum starting volume, defaults to 100%
var max = 100;

// The sensitivity value, a scaling factor that adjusts user amplitude. Defaults to 2
var sensitivity = 2.5;

// Variable that determines what mode the user is in.
var mode = true;

var calibrate_volume = 20;
var calibrate_input = 0;
var calibrate = false;

// Attempts to initialize audio input. Returns an error if unsuccessful                                         
// ============================================================================================================ //

try {
  // 
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  window.audioContext = new AudioContext();
} catch (e) {
  alert('Web Audio API not supported.');
}

// Put audio and video variables in global scope to make them available to the browser console.
// ============================================================================================================ //

var constraints = window.constraints = {
  audio: true,
  video: false
};

// Runs if the stream is successfully created
// ============================================================================================================ //

function handleSuccess(stream) {
  // Put variables in global scope to make them available to the
  // browser console.
  window.stream = stream;
  var soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
  soundMeter.connectToSource(stream, function(e) {
    if (e) {
      alert(e);
      return;
    }

    setInterval(function() {
      
      // Sets the queried variables to the detected input amplitude
      $("#instantvol").text((soundMeter.instant * sensitivity).toFixed(2));
      // Finds the average volume and sets the corresponding variable
      var averagevol = $("#averagevol").text((soundMeter.slow * sensitivity).toFixed(2));

      var new_volume = calibrate_volume + (100)*(soundMeter.instant.toFixed(2) - calibrate_input)*sensitivity;

      if (calibrate) {
        calibrate_input = averagevol;
        calibrate = false;
      }



      if(mode)
      {
          // Changes volume based on input
        videoVolume.innerText = changeVolume(0 + (100)*soundMeter.slow.toFixed(2)*sensitivity);
      }
      else
      {
        videoVolume.innerText = changeVolume(50 - (100)*soundMeter.slow.toFixed(2)*sensitivity);
      }

      // Adjusts the value of mode based on toggle
      if ($("#mode:checked").val() == "on")
      {
        mode = true;
      }
      else 
      {
        mode = false;
      }

      $('.progress-bar').css('width', "" + new_volume+ "%").attr('aria-valuenow', new_volume);

    }, 200);
  });
}

// If audio detection is not properly created
function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);

// Youtube -- Code found on https://developers.google.com/youtube/iframe_api_reference
// ============================================================================================================ //

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    // Factors that scale to the user's computer screen length and width
    height: 0.609375*screen.width / 1.5,
    width: screen.width / 1.5,
    // height: 390,
    // width: 640,
    videoId: 'GPG3zSgm_Qo',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

function onPlayerStateChange(event) {  }

// Function that stops video from playing when called
function stopVideo() {
  player.stopVideo();
}

// Functions used throughout the rest of the program
// ============================================================================================================ //

// Changes the output volume based on a user input
function changeVolume(x){
  // Accounts for the max and minimum thresholds
  if(x > max)
  {
    x = max;
  }

  else if(x < min)
  {
    x = min;
  }
  
  // Changes actual player volume
  player.setVolume(x);

  // Limits output to an integer value
  return x.toFixed(0);
}

// Adjusts values based on user inputs
$(document).ready(function(){
    $("#min").click(function(){
        // Changes the minimum volume
        min = $("#test").val() / 1;
        console.log(min);
    });

    $("#max").click(function(){
        // Changes maximum volume
        max = $("#maxval").val() / 1;
        console.log(max);
    });

    $("#sens").click(function(){
        // Changes the application sensitivity
        sensitivity = $("#sensitivity").val() / 1;
        console.log(sensitivity);
    });
    $("#cal").click(function(){
        calibrate_volume = $("#calvol").val() / 1;
        calibrate = true;
        //console.log(calibrate_volume);
    });
});


