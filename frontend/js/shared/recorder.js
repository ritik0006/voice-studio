// Records from the microphone. Calls onBlob(blob) when the person presses Stop.
export function makeRecorder(btn, timerEl, label, onBlob) {
  let recorder, stream, tick, startedAt, chunks = [];

  btn.addEventListener("click", async () => {
    if (recorder && recorder.state === "recording") {
      recorder.stop();
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      alert("Microphone access is blocked. Allow it in the browser address bar and try again.");
      return;
    }
    chunks = [];
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      clearInterval(tick);
      btn.textContent = label;
      btn.classList.remove("recording");
      onBlob(new Blob(chunks, { type: recorder.mimeType }));
    };
    recorder.start();
    startedAt = Date.now();
    btn.textContent = "Stop";
    btn.classList.add("recording");
    tick = setInterval(() => {
      const s = Math.floor((Date.now() - startedAt) / 1000);
      timerEl.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    }, 250);
  });
}
