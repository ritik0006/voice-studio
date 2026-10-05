// Feature 3: Voice Clone (XTTS-v2 on the backend).
import { $, extFor, setStatus } from "../shared/ui.js";
import { postForm } from "../shared/api.js";
import { makeRecorder } from "../shared/recorder.js";

export function initClone() {
  let sampleBlob = null;
  let resultUrl = null;

  function updateButton() {
    $("#cloneGoBtn").disabled = !(sampleBlob && $("#cloneText").value.trim() && $("#consent").checked);
  }

  function setSample(blob, name) {
    sampleBlob = blob;
    sampleBlob.fileName = name;
    $("#clonePreview").src = URL.createObjectURL(blob);
    $("#clonePreview").hidden = false;
    updateButton();
  }

  makeRecorder($("#cloneRecBtn"), $("#cloneTimer"), "Record sample", (b) => setSample(b, `sample.${extFor(b)}`));

  $("#cloneFile").addEventListener("change", (e) => {
    const f = e.target.files[0];
    if (f) setSample(f, f.name);
  });
  $("#cloneText").addEventListener("input", updateButton);
  $("#consent").addEventListener("change", updateButton);

  $("#cloneGoBtn").addEventListener("click", async () => {
    const btn = $("#cloneGoBtn");
    btn.disabled = true;
    setStatus($("#cloneStatus"), "Generating. This can take a while on a CPU.");
    try {
      const form = new FormData();
      form.append("sample", sampleBlob, sampleBlob.fileName);
      form.append("text", $("#cloneText").value);
      form.append("lang", $("#cloneLang").value);
      form.append("consent", $("#consent").checked);
      const blob = await (await postForm("/clone-speak", form)).blob();
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      resultUrl = URL.createObjectURL(blob);
      $("#cloneResult").src = resultUrl;
      $("#cloneResult").hidden = false;
      $("#cloneDownload").href = resultUrl;
      $("#cloneDownload").hidden = false;
      $("#cloneResult").play();
      setStatus($("#cloneStatus"), "Done.");
    } catch (err) {
      setStatus($("#cloneStatus"), err.message, true);
    } finally {
      updateButton();
    }
  });
}
