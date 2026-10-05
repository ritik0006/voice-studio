"""Voice-clone endpoint."""
import tempfile

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask

from backend import config
from backend.services import xtts_service
from backend.utils.audio import remove, save_upload, to_wav

router = APIRouter()


@router.post("/clone-speak")
def clone_speak(
    text: str = Form(...),
    lang: str = Form("hi"),
    consent: bool = Form(False),
    sample: UploadFile = File(...),
):
    if not consent:
        raise HTTPException(400, "Confirm that you have permission to use this voice.")
    text = text.strip()
    if not text:
        raise HTTPException(400, "Type the text you want spoken.")
    if len(text) > config.MAX_TEXT_CHARS:
        raise HTTPException(400, f"Text is too long. Keep it under {config.MAX_TEXT_CHARS} characters.")

    raw = save_upload(sample)
    wav = to_wav(raw)
    out = tempfile.NamedTemporaryFile(suffix=".wav", delete=False).name
    try:
        xtts_service.synthesize(text, wav, lang, out)
    except Exception as e:
        remove(raw, wav, out)
        raise HTTPException(500, f"Voice generation failed: {e}")
    remove(raw, wav)
    return FileResponse(
        out, media_type="audio/wav", filename="cloned_voice.wav",
        background=BackgroundTask(remove, out),
    )
