from __future__ import annotations

from config.settings import CameraSettings
from camera.video_capture_source import VideoCaptureSource


class CameraFactory:
    def create(self, settings: CameraSettings) -> VideoCaptureSource:
        source_type = settings.source_type.lower()
        if source_type == "webcam":
            source: int | str = int(settings.source)
        elif source_type in {"rtsp", "file", "video"}:
            source = settings.source
        else:
            raise ValueError(f"Unsupported camera source type: {settings.source_type}")
        return VideoCaptureSource(source, settings.reconnect_delay_seconds)
