from __future__ import annotations

import time

import cv2
import numpy as np

from camera.camera import Camera


class VideoCaptureSource(Camera):
    def __init__(self, source: int | str, reconnect_delay_seconds: float = 5.0):
        self.source = source
        self.reconnect_delay_seconds = reconnect_delay_seconds
        self.capture: cv2.VideoCapture | None = None

    def open(self) -> None:
        self.release()
        self.capture = cv2.VideoCapture(self.source)
        if not self.capture.isOpened():
            self.release()
            raise RuntimeError(f"Failed to open video source: {self.source}")

    def read(self) -> np.ndarray | None:
        if self.capture is None or not self.capture.isOpened():
            return None
        success, frame = self.capture.read()
        return frame if success else None

    def reconnect(self) -> bool:
        self.release()
        time.sleep(self.reconnect_delay_seconds)
        try:
            self.open()
            return True
        except RuntimeError:
            return False

    def release(self) -> None:
        if self.capture is not None:
            self.capture.release()
        self.capture = None

    @property
    def is_opened(self) -> bool:
        return self.capture is not None and self.capture.isOpened()
