/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* global AudioContext, SoundMeter */

'use strict';



var instantValueDisplay = document.querySelector('#instant .value');
var slowValueDisplay = document.querySelector('#slow .value');
var videoVolume = document.querySelector('#volume .value');
var min = 10;
var max = 100;
var sensitivity = 2;
var calibrate_volume = 20;
var calibrate_input = 0;
var calibrate = false;

try {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  window.audioContext = new AudioContext();
} catch (e) {
  alert('Web Audio API not supported.');
}

// Put variables in global scope to make them available to the browser console.
var constraints = window.constraints = {
  audio: true,
  video: false
};

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
      var averagevol = (soundMeter.slow * sensitivity).toFixed(2);
      var new_volume = calibrate_volume + (100)*(soundMeter.instant.toFixed(2) - calibrate_input)*sensitivity;

      if (calibrate) {
        calibrate_input = averagevol;
        calibrate = false;
      }

      $("#instantvol").text((soundMeter.instant * sensitivity).toFixed(2));
      $("#averagevol").text(averagevol);
      //move(averagevol);
      $('.progress-bar').css('width', "" + new_volume+ "%").attr('aria-valuenow', new_volume);

      videoVolume.innerText = changeVolume(new_volume);

    }, 200);
  });

}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);

// Youtube
// ====================================

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
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

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.

function onPlayerStateChange(event) {

}
function stopVideo() {
  player.stopVideo();
}

function changeVolume(x){
  if(x > max){
    x = max;
  }
  else if(x < min){
    x = min;
  }

  player.setVolume(x);

  return x.toFixed(0);
}


$(document).ready(function(){
    $("#min").click(function(){
        min = $("#test").val() / 1;
        //console.log(min);
    });

    $("#max").click(function(){
        max = $("#maxval").val() / 1;
        //console.log(max);
    });

    $("#sens").click(function(){
        sensitivity = $("#sensitivity").val() / 1;
        //console.log(sensitivity);
    });

    $("#cal").click(function(){
        calibrate_volume = $("#calvol").val() / 1;
        calibrate = true;
        //console.log(calibrate_volume);
    });
});

// Progress Bar

function move(averagevol) {
    var elem = document.getElementById("myBar");
    width = averagevol;
    var id = setInterval(frame, 10);
    function frame() {
        elem.style.width = width;
        document.getElementById("label").innerHTML = width * 1;
    }
}
