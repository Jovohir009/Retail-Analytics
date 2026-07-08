from abc import ABC, abstractmethod
import numpy as np


class Camera(ABC):
    """Base interface for all camera implementations."""

    @abstractmethod
    def open(self) -> None:
        """Open the camera connection."""
        pass

    @abstractmethod
    def read(self) -> np.ndarray | None:
        """Read a single frame from the camera."""
        pass

    @abstractmethod
    def release(self) -> None:
        """Release camera resources."""
        pass

    @property
    @abstractmethod
    def is_opened(self) -> bool:
        """Return whether the camera connection is currently open."""
        pass
