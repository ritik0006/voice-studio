export const $ = (selector) => document.querySelector(selector);

export function setStatus(el, message, isError = false) {
  el.textContent = message;
  el.classList.toggle("error", isError);
}

// File extension that matches a recorded blob's format
export function extFor(blob) {
  if (blob.type.includes("mp4")) return "m4a";
  if (blob.type.includes("ogg")) return "ogg";
  if (blob.type.includes("wav")) return "wav";
  return "webm";
}
