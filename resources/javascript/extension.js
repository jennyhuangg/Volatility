$("#web").click(function(){
  chrome.tabs.create({
    url: chrome.extension.getURL('/index.html'),
  });
});
