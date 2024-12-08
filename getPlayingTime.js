(() => {
  // YouTubeプレイヤーの再生時間を取得
  const player = document.querySelector('video');
  if (player) {
    const currentTime = Math.floor(player.currentTime); // 秒単位で取得
    chrome.runtime.sendMessage({ currentTime });
  } else {
    chrome.runtime.sendMessage({ error: 'Video player not found' });
  }
})();