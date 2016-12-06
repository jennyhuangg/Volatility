chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log(message);

    var newMessage = {vol: message}
    // need message to be sent to all tabs
    chrome.tabs.query({audible: true}, function(tabs) {
      for (i = 0; i < tabs.length; i++) {
        // make sure url is not chrome://
        if (!(tabs[i].url.includes("chrome://") || tabs[i].url.includes("chrome-extension://"))) {
            chrome.tabs.sendMessage(tabs[i].id, newMessage, function(response){});
            console.log("message sent");
        }
        //console.log(tabs[i].id);
        //console.log(tabs[i].url);
      }
    });
});




// var tab;
// chrome.tabs.query({url: chrome.extension.getURL('/index.html')}, function(tabs){
//   tab = tabs[0];
// })
//
// alert(tab.url);
//
// setInterval(function() {
//
// });
