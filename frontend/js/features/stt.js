// Feature 2: Speech to Text (Whisper on the backend).
import { $, extFor, setStatus } from "../shared/ui.js";
import { postForm } from "../shared/api.js";
import { makeRecorder } from "../shared/recorder.js";

export function initStt() {
  let audioBlob = null;

  function setAudio(blob, name) {
    audioBlob = blob;
    audioBlob.fileName = name;
    $("#sttPreview").src = URL.createObjectURL(blob);
    $("#sttPreview").hidden = false;
    $("#sttGoBtn").disabled = false;
    setStatus($("#sttStatus"), "");
  }

  makeRecorder($("#sttRecBtn"), $("#sttTimer"), "Record", (b) => setAudio(b, `recording.${extFor(b)}`));

  $("#sttFile").addEventListener("change", (e) => {
    const f = e.target.files[0];
    if (f) setAudio(f, f.name);
  });

  $("#sttGoBtn").addEventListener("click", async () => {
    const btn = $("#sttGoBtn");
    btn.disabled = true;
    setStatus($("#sttStatus"), "Transcribing. If the model is still loading, this can take a while.");
    try {
      const form = new FormData();
      form.append("file", audioBlob, audioBlob.fileName);
      form.append("lang", $("#sttLang").value);
      const data = await (await postForm("/transcribe", form)).json();
      $("#sttOut").value = data.text || "";
      setStatus($("#sttStatus"), data.text ? `Done. Detected language: ${data.language}` : "No speech found in this audio.");
    } catch (err) {
      setStatus($("#sttStatus"), err.message, true);
    } finally {
      btn.disabled = false;
    }
  });

  $("#sttCopy").addEventListener("click", async () => {
    await navigator.clipboard.writeText($("#sttOut").value);
    setStatus($("#sttStatus"), "Copied.");
  });
}
