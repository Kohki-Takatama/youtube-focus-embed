chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'focus') {
    chrome.tabs.query({ active: true, currentWindow: true }, (e) => {
      // 動画パラメータ
      const EMBED_PATH = '/embed';
      const WATCH_PATH = '/watch';
      const AUTOPLAY_PARAM = '?autoplay=1';
      const currentTab = e[0];
      const prevUrl = new URL(currentTab.url);
      let videoId = prevUrl.searchParams.get('v');
      //
      let newUrl = '';
      console.log(prevUrl);

      // NOTE: switchは使えない。pathnameが理由。watch: idを含まない / embed: 含む = 完全一致が不可
      if (prevUrl.pathname.includes(WATCH_PATH)) {
        videoId = prevUrl.searchParams.get('v');
        // embedの場合は、autoplayをonにする
        newUrl = `https://www.youtube.com${EMBED_PATH}/${videoId}${AUTOPLAY_PARAM}`;
      } else if (prevUrl.pathname.includes) {
        videoId = prevUrl.pathname.replace(EMBED_PATH + '/', '');
        newUrl = `https://www.youtube.com${WATCH_PATH}?v=${videoId}`;
      } else {
        return;
      }
      chrome.tabs.update(currentTab.id, { url: newUrl });
    });
  }
});
