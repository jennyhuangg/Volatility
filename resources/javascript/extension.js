// var details = {
//   file: "resources/javascript/volume.js",
//   allFrames: true
// }
//
// chrome.tabs.getAllInWindow(function(tabs){
//   for (i = 0; i < tabs.length - 1; i++) {
//     // make sure url is not chrome://
//     if (!(tabs[i].url.includes("chrome://") || tabs[i].url.includes("chrome-extension://"))) {
//         chrome.tabs.executeScript(tabs[i].id, details, function(results){});
//     }
//     console.log(tabs[i].id);
//     console.log(tabs[i].url);
//   }
// });

$("#web").click(function(){
  chrome.tabs.create({
    url: chrome.extension.getURL('/index.html'),
  });
});
