# Retail Analytics AI Agent

Local Windows agent for processing webcam, RTSP, or video-file sources. It detects
people with YOLO, tracks them, counts configured entry-line crossings, stores
visitor events in SQLite, and synchronizes events with the backend API.

## Configuration

Configuration is loaded from environment variables or an optional JSON file:

```powershell
python src/main.py --config config.local.json
```

Important environment variables:

- `CAMERA_SOURCE_TYPE`: `webcam`, `rtsp`, or `file`
- `CAMERA_SOURCE`: webcam index, RTSP URL, or video path
- `COUNTING_LINE_START`: `x,y`
- `COUNTING_LINE_END`: `x,y`
- `ENTRY_DIRECTION`: `positive_to_negative` or `negative_to_positive`
- `BACKEND_BASE_URL`: backend API base URL, for example `http://localhost:3000/api/v1`
- `AGENT_API_TOKEN`: AI Agent bearer token
- `SQLITE_PATH`: local cache path

Video frames never leave the local machine. Only visitor events and heartbeat
metadata are sent to the backend.

## Run Tests

```powershell
$env:PYTHONPATH="src"; python -m unittest discover -s tests
```
