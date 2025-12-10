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

const AudioCtx = new (window.AudioContext || window.webkitAudioContext)();

async function loadLocalFile(file, containerEl) {
  const arrayBuffer = await file.arrayBuffer();
  let audioBuffer;
  try {
    audioBuffer = await AudioCtx.decodeAudioData(arrayBuffer);
  } catch (e) {
    console.warn("Ошибка декодирования аудио:", e);
    containerEl.querySelector(".duration").textContent = "Ошибка аудио";
    return;
  }

  const ws = WaveSurfer.create({
    container: containerEl.querySelector(".waveform"),
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
    containerEl.querySelector(".duration").textContent = `${min}:${sec}`;
  });

  containerEl.querySelector(".play").addEventListener("click", () => {
    if (current && current !== ws) current.stop();
    ws.playPause();
    current = ws;
  });

  players.push(ws);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".sound").forEach((el) => {
    const fileInput = el.querySelector("input[type=file]");
    if (!fileInput) return;

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (file) loadLocalFile(file, el);
    });
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
