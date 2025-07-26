function enhanceYouTube(skipSeconds, speed, skipAds, autoWatchLater, detectSilence) {
  const video = document.querySelector("video");
  if (!video) return;

  // Playback speed control
  video.playbackRate = speed;

  // Ad skipping
  if (skipAds) handleAdSkipping(video, speed);

  // Watch later
  if (autoWatchLater) autoAddToWatchLater();

  // Intro skipping
  if (detectSilence) {
    detectSpeechStart(video, speed);
  } else if (video.currentTime < skipSeconds && !isAdPlaying()) {
    video.currentTime = skipSeconds;
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
  } else {
    video.muted = false;
    video.playbackRate = speed;
  }
}

function autoAddToWatchLater() {
  const saveButton = document.querySelector('ytd-button-renderer[button-renderer="SAVE"] button');
  if (saveButton && !window._alreadySaved) {
    saveButton.click();
    setTimeout(() => {
      const watchLater = [...document.querySelectorAll('yt-formatted-string')]
        .find(el => el.innerText.includes('Watch later'));
      if (watchLater) {
        watchLater.click();
        console.log("💾 Added to Watch Later");
        window._alreadySaved = true;
      }
    }, 1000);
  }
}

function detectSpeechStart(video, speed) {
  if (window._detectedSpeech) return;
  try {
    const ctx = new AudioContext();
    const src = ctx.createMediaElementSource(video);
    const analyser = ctx.createAnalyser();
    src.connect(analyser);
    analyser.connect(ctx.destination);
    const data = new Uint8Array(analyser.frequencyBinCount);

    function scan() {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b) / data.length;

      if (avg < 5 && video.currentTime < 20) {
        video.currentTime += 1;
        setTimeout(scan, 500);
      } else {
        video.playbackRate = speed;
        ctx.close();
        window._detectedSpeech = true;
      }
    }

    scan();
  } catch (e) {
    console.warn("🎧 AudioContext error:", e);
  }
}

setInterval(() => {
  chrome.storage.sync.get(["skipSeconds", "playbackSpeed", "skipAds", "autoWatchLater", "detectSilence"], (data) => {
    const skipSeconds = data.skipSeconds ?? 10;
    const speed = data.playbackSpeed ?? 1.25;
    const skipAds = data.skipAds ?? true;
    const autoWatchLater = data.autoWatchLater ?? false;
    const detectSilence = data.detectSilence ?? false;
    enhanceYouTube(skipSeconds, speed, skipAds, autoWatchLater, detectSilence);
  });
}, 1000);