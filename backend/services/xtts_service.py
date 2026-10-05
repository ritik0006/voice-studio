"""Voice cloning: loads XTTS-v2 once and generates speech in a sample's voice."""
import threading

state = {"status": "not loaded"}
_model = None
_lock = threading.Lock()


def get_model():
    global _model
    with _lock:
        if _model is None:
            state["status"] = "loading"
            try:
                import torch
                from TTS.api import TTS
                device = "cuda" if torch.cuda.is_available() else "cpu"
                _model = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)
            except Exception as e:
                state["status"] = f"error: {e}"
                raise
        state["status"] = "ready"
        return _model


def synthesize(text: str, speaker_wav: str, lang: str, out_path: str) -> None:
    get_model().tts_to_file(text=text, speaker_wav=speaker_wav, language=lang, file_path=out_path)
