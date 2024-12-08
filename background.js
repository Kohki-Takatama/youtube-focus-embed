chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'focus') {
    chrome.tabs.query({ active: true, currentWindow: true }, (e) => {
      const EMBED_PATH = 'embed/';
      const WATCH_QUERY = 'watch?v=';
      const AUTOPLAY_PARAM = '?autoplay=1';
      const currentTab = e[0];
      const prevUrl = currentTab.url;
      let newUrl = prevUrl;
      if (prevUrl.includes(WATCH_QUERY)) {
        // embedの場合は、autoplayをonにする
        newUrl = prevUrl.replace(WATCH_QUERY, EMBED_PATH) + AUTOPLAY_PARAM;
      } else if (prevUrl.includes(EMBED_PATH)) {
        newUrl = prevUrl.replace(EMBED_PATH, WATCH_QUERY);
      } else {
        return;
      }
      chrome.tabs.update(currentTab.id, { url: newUrl });
    });
  }
});
