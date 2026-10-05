// Same origin: the FastAPI server also serves this page.
const API = "";

export async function postForm(url, form) {
  const res = await fetch(API + url, { method: "POST", body: form });
  if (!res.ok) {
    let detail = "Something went wrong. Is the backend running?";
    try { detail = (await res.json()).detail || detail; } catch {}
    throw new Error(detail);
  }
  return res;
}
