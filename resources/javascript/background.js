/*
 *  Jake Cui, Doug Smith, and Jenny Huang
 *  CS50 Final Project: javascript for Volatility chrome extension
 */
 
// listen for a message from the volatility webpage
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log(message);
  // compose a new message with the volume as an atrribute
  var newMessage = {vol: message}
  // query all audible tabs in chrome
  chrome.tabs.query({audible: true}, function(tabs) {
    // loop through audible tabs
    for (i = 0; i < tabs.length; i++) {
      // make sure url is not chrome://
      if (!(tabs[i].url.includes("chrome://") || tabs[i].url.includes("chrome-extension://"))) {
        // send message to each audible tab containing the desired volume
        chrome.tabs.sendMessage(tabs[i].id, newMessage, function(response){});
        console.log("message sent");
      }
    }
  });
});
