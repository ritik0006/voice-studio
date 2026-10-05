"""Shows whether the models have finished loading."""
from fastapi import APIRouter

from backend.services import whisper_service, xtts_service

router = APIRouter()


@router.get("/health")
def health():
    return {"ok": True, "whisper": whisper_service.state["status"], "xtts": xtts_service.state["status"]}
