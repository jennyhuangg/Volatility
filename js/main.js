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
      instantValueDisplay.innerText =
          soundMeter.instant.toFixed(2);
      slowValueDisplay.innerText =
          soundMeter.slow.toFixed(2);

      changeVolume(100*soundMeter.instant.toFixed(2));
      videoVolume.innerText = 100*soundMeter.instant.toFixed(2);
  
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
    height: '390',
    width: '640',
    videoId: 'M7lc1UVf-VE',
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
  player.setVolume(x);
}

