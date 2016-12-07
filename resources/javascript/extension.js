$("#web").click(function(){
  chrome.tabs.query({url: chrome.extension.getURL('/index.html')}, function(tabs) {
    if (tabs.length == 0) {
      chrome.tabs.create({
        url: chrome.extension.getURL('/index.html'),
      });
    }
    else {

    }
  });
});

$('#power:checked').change(function(){
  var tab;
  chrome.tabs.query({url: chrome.extension.getURL('/index.html')}, function(tabs) {
    tab = tabs[0];

    if (!$('#power').is(':checked')) {
      // send message to stop
      console.log("enabled false");
      chrome.tabs.sendMessage(tab.id, {toggle: false}, function(response){});
    }
    else {
      // send message to start
      console.log("enabled true");
      chrome.tabs.sendMessage(tab.id, {toggle: true}, function(response){});
    }
  });
});

$(document).ready(function() {
  chrome.tabs.query({url: chrome.extension.getURL('/index.html')}, function(tabs) {
    if(tabs.length == 0) {
      $('#alert').hide();
    }
    else {
      $('#alert').show();
    }
  });
});
