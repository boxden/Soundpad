/* 🌓 Theme logic */
const root = document.documentElement;
const toggle = document.getElementById("themeToggle");

function updateIcon() {
  toggle.textContent =
    root.getAttribute("data-theme") === "dark" ? "🌙" : "☀️";
}

updateIcon();

toggle.addEventListener("click", () => {
  const newTheme =
    root.getAttribute("data-theme") === "dark" ? "light" : "dark";

  root.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateIcon();
  updateWaveColors();
});

/* 🎵 WaveSurfer */
let players = [];
let current = null;

function canPlayAudio(type) {
  const audio = document.createElement("audio");
  return !!audio.canPlayType && audio.canPlayType(type) !== "";
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".sound").forEach((el) => {
    const container = el.querySelector(".waveform");
    let url = el.dataset.audio;

    if (!container || !url) return;

    if (url.endsWith(".ogg") && !canPlayAudio("audio/ogg")) {
      url = url.replace(".ogg", ".mp3");
    }

    const ws = WaveSurfer.create({
      container,
      url,
      height: 36,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      waveColor: getWaveColor(),
      progressColor: getProgressColor(),
      cursorWidth: 0,
      normalize: true,
      backend: "WebAudio"
    });

    ws.on("ready", () => {
      const d = ws.getDuration();
      const min = Math.floor(d / 60);
      const sec = Math.floor(d % 60).toString().padStart(2, "0");
      el.querySelector(".duration").textContent = `${min}:${sec}`;
    });

    ws.on("error", (e) => {
      console.warn("WaveSurfer error:", e);
      el.querySelector(".duration").textContent = "Ошибка аудио";
    });

    el.querySelector(".play").addEventListener("click", () => {
      if (current && current !== ws) current.stop();
      ws.playPause();
      current = ws;
    });

    players.push(ws);
  });

});

/* 🎨 Цвета wave под тему */
function getWaveColor() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--border")
    .trim();
}

function getProgressColor() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--accent")
    .trim();
}

function updateWaveColors() {
  players.forEach(ws => {
    ws.setOptions({
      waveColor: getWaveColor(),
      progressColor: getProgressColor()
    });
  });
}
