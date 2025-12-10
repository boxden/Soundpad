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

let players = [];
let current = null;

document.addEventListener("DOMContentLoaded", () => {
  const AudioCtx = new (window.AudioContext || window.webkitAudioContext)();

  document.querySelectorAll(".sound").forEach(async (el) => {
    const container = el.querySelector(".waveform");
    const url = el.dataset.audio;
    if (!container || !url) return;

    let audioBuffer;
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      audioBuffer = await AudioCtx.decodeAudioData(arrayBuffer);
    } catch (e) {
      console.warn("Ошибка декодирования аудио:", e);
      el.querySelector(".duration").textContent = "Ошибка аудио";
      return;
    }

    const ws = WaveSurfer.create({
      container,
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

    ws.loadDecodedBuffer(audioBuffer);

    ws.on("ready", () => {
      const d = ws.getDuration();
      const min = Math.floor(d / 60);
      const sec = Math.floor(d % 60).toString().padStart(2, "0");
      el.querySelector(".duration").textContent = `${min}:${sec}`;
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
