// Feature 1: Text to Speech using the browser's built-in voices (no backend).
import { $ } from "../shared/ui.js";

export function initTts() {
  let voices = [];
  const voiceSelect = $("#voiceSelect");

  function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = "";
    voices.forEach((v, i) => voiceSelect.add(new Option(`${v.name} (${v.lang})`, i)));
  }
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;

  $("#rate").addEventListener("input", (e) => {
    $("#rateOut").textContent = `${Number(e.target.value).toFixed(1)}x`;
  });

  $("#speakBtn").addEventListener("click", () => {
    const text = $("#ttsText").value.trim();
    if (!text) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.voice = voices[voiceSelect.value] || null;
    speech.rate = Number($("#rate").value);
    window.speechSynthesis.speak(speech);
  });

  $("#stopBtn").addEventListener("click", () => window.speechSynthesis.cancel());
}
