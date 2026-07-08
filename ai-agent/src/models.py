from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Any


class EntryDirection(str, Enum):
    POSITIVE_TO_NEGATIVE = "positive_to_negative"
    NEGATIVE_TO_POSITIVE = "negative_to_positive"


@dataclass(frozen=True)
class BoundingBox:
    x1: float
    y1: float
    x2: float
    y2: float

    @property
    def center(self) -> tuple[float, float]:
        return ((self.x1 + self.x2) / 2, (self.y1 + self.y2) / 2)

    @property
    def area(self) -> float:
        return max(0.0, self.x2 - self.x1) * max(0.0, self.y2 - self.y1)

    def to_list(self) -> list[float]:
        return [self.x1, self.y1, self.x2, self.y2]


@dataclass(frozen=True)
class Detection:
    bbox: BoundingBox
    confidence: float
    class_id: int
    label: str


@dataclass(frozen=True)
class TrackedObject:
    track_id: int
    bbox: BoundingBox
    confidence: float
    label: str

    @property
    def center(self) -> tuple[float, float]:
        return self.bbox.center


@dataclass(frozen=True)
class CountingLine:
    start: tuple[float, float]
    end: tuple[float, float]
    direction: EntryDirection

    def side(self, point: tuple[float, float]) -> float:
        x1, y1 = self.start
        x2, y2 = self.end
        px, py = point
        return (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1)

    def to_dict(self) -> dict[str, Any]:
        return {
            "start": list(self.start),
            "end": list(self.end),
            "direction": self.direction.value,
        }


@dataclass(frozen=True)
class VisitorEvent:
    id: str
    store_id: str
    camera_id: str
    agent_id: str
    occurred_at: datetime
    direction: str
    local_track_id: int

    def to_api_payload(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "storeId": self.store_id,
            "cameraId": self.camera_id,
            "agentId": self.agent_id,
            "occurredAt": self.occurred_at.isoformat().replace("+00:00", "Z"),
            "direction": self.direction,
        }
