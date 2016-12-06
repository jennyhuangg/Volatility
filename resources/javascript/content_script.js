// retrieve all audio files
var audioTags = document.getElementsByTagName("audio");

// retrieve all video files
var videoTags = document.getElementsByTagName("video");


chrome.runtime.onMessage.addListener(
 function(request, sender) {
  console.log(request.vol);
  if (videoTags.length > 0) {
    videoTags[0].volume = request.vol/ 100.0;
  }
  if (audioTags.length > 0) {
    audioTags[0].volume = request.vol / 100.0;
  }
});
