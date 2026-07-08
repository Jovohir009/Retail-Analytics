from ultralytics import YOLO

from detector.detector import Detector
from models import BoundingBox, Detection


class YOLODetector(Detector):
    PERSON_CLASS_ID = 0

    def __init__(
        self,
        model_name: str = "yolov8n.pt",
        confidence_threshold: float = 0.35,
        image_size: int = 640,
    ):
        self.model = YOLO(model_name)
        self.confidence_threshold = confidence_threshold
        self.image_size = image_size

    def detect(self, frame) -> list[Detection]:
        results = self.model(
            frame,
            conf=self.confidence_threshold,
            imgsz=self.image_size,
            verbose=False,
        )
        detections: list[Detection] = []
        for result in results:
            if result.boxes is None:
                continue
            for box in result.boxes:
                class_id = int(box.cls.item())
                if class_id != self.PERSON_CLASS_ID:
                    continue
                confidence = float(box.conf.item())
                x1, y1, x2, y2 = [float(value) for value in box.xyxy[0].tolist()]
                detections.append(
                    Detection(
                        bbox=BoundingBox(x1=x1, y1=y1, x2=x2, y2=y2),
                        confidence=confidence,
                        class_id=class_id,
                        label="person",
                    )
                )
        return detections
