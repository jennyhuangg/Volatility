/*
 *  Jake Cui, Doug Smith, and Jenny Huang
 *  CS50 Final Project: javascript for Volatility chrome extension
 */
 
// retrieve all audio tags on current page
var audioTags = document.getElementsByTagName("audio");

// retrieve all video tags on current page
var videoTags = document.getElementsByTagName("video");

// listen for a message from background.js
chrome.runtime.onMessage.addListener(function(request, sender) {
  console.log(request.vol);
  if (videoTags.length > 0) {
    // change the volume of the video element on the page
    videoTags[0].volume = request.vol/ 100.0;
  }
  if (audioTags.length > 0) {
    // change the volume of the audio element on the page
    audioTags[0].volume = request.vol / 100.0;
  }
});
