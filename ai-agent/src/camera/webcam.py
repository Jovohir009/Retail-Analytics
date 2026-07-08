import cv2
import numpy as np

from camera.camera import Camera


class Webcam(Camera):
    def __init__(self, camera_index: int = 0):
        self.camera_index = camera_index
        self.capture = None

    def open(self) -> None:
        self.capture = cv2.VideoCapture(self.camera_index)

        if not self.capture.isOpened():
            raise RuntimeError(f"Failed to open webcam with index {self.camera_index}")

    def read(self) -> np.ndarray | None:
        if self.capture is None:
            return None

        success, frame = self.capture.read()

        if not success:
            return None

        return frame

    def release(self) -> None:
        if self.capture is not None:
            self.capture.release()
        self.capture = None

    @property
    def is_opened(self) -> bool:
        return self.capture is not None and self.capture.isOpened()
