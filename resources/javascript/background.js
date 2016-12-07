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
      }
    });
});
