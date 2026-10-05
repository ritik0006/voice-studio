# Starts Voice Studio on Windows.
& "$PSScriptRoot\venv\Scripts\Activate.ps1"

# Voice Clone needs the shared ffmpeg build (winget install Gyan.FFmpeg.Shared)
$pkg = "$env:LOCALAPPDATA\Microsoft\WinGet\Packages"
$dll = Get-ChildItem "$pkg\Gyan.FFmpeg.Shared*" -Recurse -Filter "avcodec*.dll" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($dll) {
    $env:PATH = "$($dll.DirectoryName);$env:PATH"
} else {
    Write-Host "Shared ffmpeg not found. Voice Clone will fail. Run: winget install Gyan.FFmpeg.Shared"
}

uvicorn backend.main:app --reload