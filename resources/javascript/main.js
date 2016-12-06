/*
 *  Copyright (c) 2016 Jake Cui, Doug Smith, and Jenny Huang
 *  Credits to the WebRTC project authors for API. All Rights Reserved.
 */

'use strict';

// Declaration of global variables
// ============================================================================================================ //

// The minimum starting volume for the application. Defaults to 10%
var min = 10;

// The maximum starting volume, defaults to 100%
var max = 100;

// The sensitivity value, a scaling factor that adjusts user amplitude. Defaults to 2.5
var sensitivity = 1.0;

// True if focus mode is on, false otherwise.
var mode = true;

// The input volume at time of calibration. Defaults to 0.
var calibrate_input = 0;

// The output volume specified by user at time of calibration. Defaults to 20.
var calibrate_output = 20;

// True if newly calibrated. False otherwise.
var calibrated = false;

var stream;

// Attempts to initialize audio input. Returns an error if unsuccessful.
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

var interval = null;

// Runs if the stream is successfully created.
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

    interval = setInterval(function() {

      // Sets the queried variables to the detected input amplitude.
      $("#instantvol").text((soundMeter.instant).toFixed(2));
      // Finds the average volume and sets the corresponding variable.
      var averagevol = (soundMeter.slow).toFixed(2);
      $("#averagevol").text(averagevol);

      // Updates calibrated average input volume if newly calibrated.
      if (calibrated) {
        calibrate_input = averagevol;
        calibrated = false;
      }

      // Adjusts the mode based on toggle.
      if ($("#mode:checked").val() == "on") {
        mode = true;
      }
      else {
        mode = false;
      }

      // New output volume given input volume.
      var new_volume;
      // Calculated increment to adjust volume.
      var increment = 100 * (averagevol - calibrate_input) * sensitivity * 2.5;

      // Changes output volume based on mode.
      if (mode) {
        // As average input volume increases, output volume increases.
        new_volume = changeVolume(calibrate_output + increment);
      }
      else {
        // As average input volume increases, output volume decreases.
        new_volume = changeVolume(calibrate_output - increment);
      }

      // send message to extension
      chrome.runtime.sendMessage(new_volume);

      // Updates text for new volume.
      $('#volume').text(new_volume);

      // Updates volume progress bar with new volume.
      $('.progress-bar').css('width', "" + new_volume+ "%").attr('aria-valuenow', new_volume);

    }, 200);
  });
}

// If audio detection is not properly created.
function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

// unfocus mode function
function unfocus() {
  //start analyzing for human input
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.onresult = function(event) {
    console.log(event)
  }
  recognition.start();
}



// start analyzing mic input
stream = navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);

// determine which mode is used
$('#mode:checked').change(
    function(){
        if (!$(this).is(':checked')) {
          clearInterval(interval);
        }
        else {
          stream = navigator.mediaDevices.getUserMedia(constraints).
              then(handleSuccess).catch(handleError);
        }
});



// Functions used throughout the rest of the program.
// ============================================================================================================ //

// Ensures output volume is within thresholds and rounded.
function changeVolume(vol) {
  if (vol > max) {
    vol = max;
  }
  else if (vol < min) {
    vol = min;
  }

  // Limits output to an integer value.
  return vol.toFixed(0);
}

// Adjusts values based on user inputs.
$(document).ready(function(){
    $("#min").click(function(){
        // Changes the minimum volume.
        min = $("#minval").val() / 1;
    });

    $("#max").click(function(){
        // Changes maximum volume.
        max = $("#maxval").val() / 1;
    });

    $("#sens").click(function(){
        // Changes the application sensitivity.
        sensitivity = $("#sensitivity").val() / 1;
    });

    $("#cal").click(function(){
        // Changes calibrated output and input volume.
        calibrate_output = $("#calvol").val() / 1;
        calibrated = true;
        //console.log(calibrate_output);
    });
});

// test
document.addEventListener("hello", function(data) {
    chrome.runtime.sendMessage("test");
});
