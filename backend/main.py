"""App entry point. Run from the project root:
    uvicorn backend.main:app --reload
"""
import threading
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from backend import config  # loads .env first
from backend.routers import clone, health, transcribe
from backend.services import whisper_service, xtts_service


def _preload():
    for service in (whisper_service, xtts_service):
        try:
            service.get_model()
        except Exception as e:  # keep the server alive; /health shows the reason
            print(f"[preload] {service.__name__} failed: {e}", flush=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    if config.PRELOAD:
        threading.Thread(target=_preload, daemon=True).start()
    yield


app = FastAPI(title="Voice Studio", lifespan=lifespan)
app.include_router(health.router)
app.include_router(transcribe.router)
app.include_router(clone.router)

# Serve the frontend (must stay last).
app.mount("/", StaticFiles(directory=config.FRONTEND_DIR, html=True), name="frontend")
