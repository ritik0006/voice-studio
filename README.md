# Voice Studio

Text to Speech (browser), Speech to Text (Whisper) and Voice Clone (XTTS-v2).
Backend: FastAPI. Frontend: plain HTML, CSS and JavaScript modules.

## Project layout
```
voice-studio/
├── backend/
│   ├── main.py              app entry point
│   ├── config.py            settings (.env)
│   ├── routers/             one file per API feature
│   │   ├── health.py        model status
│   │   ├── transcribe.py    speech to text endpoint
│   │   └── clone.py         voice clone endpoint
│   ├── services/            model code
│   │   ├── whisper_service.py
│   │   └── xtts_service.py
│   └── utils/audio.py       ffmpeg helpers
├── frontend/
│   ├── index.html
│   ├── css/                 base, tabs, tts, clone
│   ├── js/
│   │   ├── main.js          tabs + starts features
│   │   ├── features/        tts.js, stt.js, clone.js
│   │   └── shared/          api.js, recorder.js, ui.js
│   └── img/
├── requirements.txt
└── .env.example
```

## Setup (Windows, VS Code)
1. Install Python 3.10 to 3.12 (tick "Add Python to PATH") and ffmpeg: `winget install ffmpeg`.
   Free disk space needed: roughly 6 to 10 GB for packages and models.
2. Open this folder in VS Code (File > Open Folder).
3. Terminal (Ctrl+`):
   ```
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```
   If activation is blocked: `Set-ExecutionPolicy -Scope Process Bypass`.
4. Press Ctrl+Shift+P, choose **Python: Select Interpreter**, and pick the one in `venv`.
5. Copy `.env.example` to `.env`. Read the Coqui license, then set `COQUI_TOS_AGREED=1` (XTTS-v2 is non-commercial).
   Use `WHISPER_MODEL=small` or `tiny` on a PC without a GPU.

## Run
- Terminal: `uvicorn backend.main:app --reload` (from the project root), or
- press **F5** in VS Code and choose "Voice Studio (FastAPI)".

Open http://127.0.0.1:8000 (not the HTML file directly).
Visit http://127.0.0.1:8000/health: when `whisper` and `xtts` both say `ready`, everything is loaded.
The first start downloads the models (about 2.5 GB), so it takes a while.

## Push to GitHub
1. Create an empty repository on github.com (no README, no .gitignore).
2. In the VS Code terminal:
   ```
   git init
   git add .
   git commit -m "Voice Studio: text to speech, speech to text, voice clone"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
`.env` and `venv/` are in `.gitignore`, so they are not uploaded.

## Notes
- Only clone voices you own or have permission to use.
- XTTS-v2 is licensed for non-commercial use.
