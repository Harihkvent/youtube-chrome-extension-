function enhanceYouTube(skipSeconds, speed, skipAds) {
  const video = document.querySelector("video");
  if (!video) return;

  video.playbackRate = speed;

  if (video.currentTime < skipSeconds && !isAdPlaying()) {
    video.currentTime = skipSeconds;
  }

  if (skipAds) {
    handleAdSkipping(video, speed);
  }
}

function isAdPlaying() {
  return document.querySelector(".ad-showing") !== null;
}

function handleAdSkipping(video, speed) {
  const skipButton = document.querySelector('.ytp-ad-skip-button');
  if (skipButton) {
    skipButton.click();
    console.log("💥 Skipped Ad!");
    return;
  }

  if (isAdPlaying()) {
    video.muted = true;
    video.playbackRate = 16.0;
    console.log("🚀 Fast-forwarding ad");
  } else {
    video.muted = false;
    video.playbackRate = speed;
  }
}

setInterval(() => {
  chrome.storage.sync.get(["skipSeconds", "playbackSpeed", "skipAds"], (data) => {
    const skipSeconds = data.skipSeconds ?? 10;
    const speed = data.playbackSpeed ?? 1.25;
    const skipAds = data.skipAds ?? true;
    enhanceYouTube(skipSeconds, speed, skipAds);
  });
}, 1000);