from abc import ABC, abstractmethod
import numpy as np

from models import Detection


class Detector(ABC):
    @abstractmethod
    def detect(self, frame: np.ndarray) -> list[Detection]:
        pass
