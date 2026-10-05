"""Audio helpers shared by the speech-to-text and voice-clone features."""
import os
import subprocess
import tempfile
from pathlib import Path

from fastapi import HTTPException, UploadFile


def save_upload(upload: UploadFile) -> str:
    """Save an uploaded file to a temp path and return the path."""
    suffix = Path(upload.filename or "audio.webm").suffix or ".webm"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as f:
        f.write(upload.file.read())
        return f.name


def to_wav(src: str) -> str:
    """Convert any browser recording to mono 22.05 kHz wav (for XTTS)."""
    dst = src + ".wav"
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", src, "-ac", "1", "-ar", "22050", dst],
            check=True, capture_output=True,
        )
    except FileNotFoundError:
        raise HTTPException(500, "ffmpeg is not installed. Install it and restart the server.")
    except subprocess.CalledProcessError:
        raise HTTPException(400, "Could not read that audio file. Try another recording.")
    return dst


def load_audio(path: str):
    """Decode any audio file to 16 kHz mono float32 with ffmpeg (for Whisper)."""
    import numpy as np
    try:
        out = subprocess.run(
            ["ffmpeg", "-nostdin", "-i", path, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"],
            check=True, capture_output=True,
        ).stdout
    except FileNotFoundError:
        raise HTTPException(500, "ffmpeg is not installed. Install it and restart the server.")
    except subprocess.CalledProcessError:
        raise HTTPException(400, "Could not read that audio file. Try another recording.")
    return np.frombuffer(out, dtype=np.float32)


def remove(*paths: str) -> None:
    for p in paths:
        try:
            os.remove(p)
        except OSError:
            pass
