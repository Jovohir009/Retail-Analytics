from __future__ import annotations

from abc import ABC, abstractmethod

from models import VisitorEvent


class EventRepository(ABC):
    @abstractmethod
    def initialize(self) -> None:
        pass

    @abstractmethod
    def save(self, event: VisitorEvent) -> None:
        pass

    @abstractmethod
    def pending(self, limit: int = 100) -> list[VisitorEvent]:
        pass

    @abstractmethod
    def mark_synchronized(self, event_ids: list[str]) -> None:
        pass
