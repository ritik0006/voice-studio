"""Settings. Importing this module loads the .env file first."""
import os
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

FRONTEND_DIR = ROOT / "frontend"
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "small")
PRELOAD = os.getenv("PRELOAD", "1") == "1"
MAX_TEXT_CHARS = int(os.getenv("MAX_TEXT_CHARS", "1000"))
