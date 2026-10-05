"""Speech to text: loads Whisper once and transcribes audio."""
import threading

from backend import config

state = {"status": "not loaded"}
_model = None
_lock = threading.Lock()


def get_model():
    global _model
    with _lock:
        if _model is None:
            state["status"] = "loading"
            try:
                import ctranslate2
                from faster_whisper import WhisperModel
                if ctranslate2.get_cuda_device_count() > 0:
                    _model = WhisperModel(config.WHISPER_MODEL, device="cuda", compute_type="float16")
                else:
                    _model = WhisperModel(config.WHISPER_MODEL, compute_type="int8")
            except Exception as e:
                state["status"] = f"error: {e}"
                raise
        state["status"] = "ready"
        return _model


def transcribe(audio, lang: str = "auto"):
    """audio: float32 numpy array at 16 kHz. Returns (text, detected_language)."""
    segments, info = get_model().transcribe(
        audio, language=None if lang == "auto" else lang, vad_filter=True
    )
    text = " ".join(s.text.strip() for s in segments).strip()
    return text, info.language
