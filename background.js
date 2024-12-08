chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'focus') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const currentUrl = new URL(currentTab.url);
      // youtube以外では動作させない
      if (!(currentUrl.hostname === 'www.youtube.com')) {
        return;
      }

      const createUrl = (prevUrl, time) => {
        // 動画パラメータ
        const EMBED_PATH = '/embed';
        const WATCH_PATH = '/watch';
        const AUTOPLAY_PARAM = '?autoplay=1';
        let videoId = '';
        let newUrl = prevUrl;

        // NOTE: switchは使えない。pathnameが理由。watch: idを含まない / embed: 含む = 完全一致が不可
        if (prevUrl.pathname.includes(WATCH_PATH)) {
          videoId = prevUrl.searchParams.get('v');
          // embedの場合のみautoplayを付加する
          newUrl = `https://www.youtube.com${EMBED_PATH}/${videoId}${AUTOPLAY_PARAM}&start=${time}`;
        } else if (prevUrl.pathname.includes) {
          videoId = prevUrl.pathname.replace(EMBED_PATH + '/', '');
          newUrl = `https://www.youtube.com${WATCH_PATH}?v=${videoId}&t=${time}`;
        }
        return newUrl;
      };

      // 再生時間を取得
      chrome.scripting.executeScript({ target: { tabId: currentTab.id }, files: ['getPlayingTime.js'] }, () => {
        chrome.runtime.onMessage.addListener((message) => {
          if (message.currentTime !== undefined) {
            const newUrl = createUrl(currentUrl, message.currentTime);
            // 画面切り替え
            chrome.tabs.update(currentTab.id, { url: newUrl });
          } else if (message.error) {
            console.error(message.error);
          }
        });
      });
    });
  }
});
