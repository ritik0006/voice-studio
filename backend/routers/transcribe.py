"""Speech-to-text endpoint."""
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from backend.services import whisper_service
from backend.utils.audio import load_audio, remove, save_upload

router = APIRouter()


@router.post("/transcribe")
def transcribe(file: UploadFile = File(...), lang: str = Form("auto")):
    src = save_upload(file)
    try:
        text, language = whisper_service.transcribe(load_audio(src), lang)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Transcription failed: {e}")
    finally:
        remove(src)
    return {"language": language, "text": text}
