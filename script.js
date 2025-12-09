let current = null;

function play(btn) {
  const audio = btn.previousElementSibling;

  if (current && current !== audio) {
    current.pause();
    current.currentTime = 0;
  }

  audio.play();
  current = audio;
}
