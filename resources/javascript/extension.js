// add an event listener to the open volatility button in the extension popup
$("#web").click(function(){
  // query tabs for Volatility page
  chrome.tabs.query({url: chrome.extension.getURL('/index.html')}, function(tabs) {
    // check to make sure there are no Volatility pages open
    if (tabs.length == 0) {
      // create a new Volatility tab
      chrome.tabs.create({
        url: chrome.extension.getURL('/index.html'),
      });
    }
  });
});

// add an event listener to toggle the extension on and off
$('#power:checked').change(function(){
  // query tabs for Volatility page
  chrome.tabs.query({url: chrome.extension.getURL('/index.html')}, function(tabs) {
    // ensure that Volatility page is open
    if (tabs.length == 0) {
      return;
    }
    // store first tab
    var tab = tabs[0];
    // check if toggle is checked
    if ($('#power').is(':checked')) {
      // send message to start extension to Volatility tab
      console.log("enabled true");
      chrome.tabs.sendMessage(tab.id, {toggle: true}, function(response){});
    }
    else {
      // send message to stop extension to Volatility tab
      console.log("enabled false");
      chrome.tabs.sendMessage(tab.id, {toggle: false}, function(response){});
    }
  });
});

// add event listener for when the popup loads
$(document).ready(function() {
  // query tabs for Volatility tab
  chrome.tabs.query({url: chrome.extension.getURL('/index.html')}, function(tabs) {
    //  hide the alert if a Volatility tab does not exist
    if(tabs.length == 0) {
      $('#alert').hide();
    }
    // otherwise, show the alert
    else {
      $('#alert').show();
    }
  });
});
