document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(["skipSeconds", "playbackSpeed", "skipAds"], (data) => {
    document.getElementById("skipSeconds").value = data.skipSeconds ?? 10;
    document.getElementById("playbackSpeed").value = data.playbackSpeed ?? 1.25;
    document.getElementById("skipAds").checked = data.skipAds ?? true;
  });

  document.getElementById("save").addEventListener("click", () => {
    const skipSeconds = parseInt(document.getElementById("skipSeconds").value);
    const playbackSpeed = parseFloat(document.getElementById("playbackSpeed").value);
    const skipAds = document.getElementById("skipAds").checked;

    chrome.storage.sync.set({ skipSeconds, playbackSpeed, skipAds }, () => {
      alert("Settings saved!");
    });
  });
});