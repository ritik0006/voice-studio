// Entry point: tab switching + start each feature.
import { initTts } from "./features/tts.js";
import { initStt } from "./features/stt.js";
import { initClone } from "./features/clone.js";

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t === tab));
    document.querySelectorAll(".panel").forEach((p) => (p.hidden = p.id !== tab.dataset.panel));
  });
});

initTts();
initStt();
initClone();
