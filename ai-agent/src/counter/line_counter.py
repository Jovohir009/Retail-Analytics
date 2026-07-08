from __future__ import annotations

from datetime import UTC, datetime
from uuid import uuid4

from models import CountingLine, EntryDirection, TrackedObject, VisitorEvent


class LineCrossingCounter:
    def __init__(self, line: CountingLine, store_id: str, camera_id: str, agent_id: str):
        self.line = line
        self.store_id = store_id
        self.camera_id = camera_id
        self.agent_id = agent_id
        self._last_side_by_track: dict[int, float] = {}
        self._counted_track_ids: set[int] = set()

    def update(self, tracked_objects: list[TrackedObject]) -> list[VisitorEvent]:
        events: list[VisitorEvent] = []
        for tracked in tracked_objects:
            if tracked.label != "person":
                continue
            current_side = self.line.side(tracked.center)
            previous_side = self._last_side_by_track.get(tracked.track_id)
            self._last_side_by_track[tracked.track_id] = current_side

            if previous_side is None or tracked.track_id in self._counted_track_ids:
                continue
            if not _crossed(previous_side, current_side):
                continue
            if not self._matches_direction(previous_side, current_side):
                continue

            self._counted_track_ids.add(tracked.track_id)
            events.append(
                VisitorEvent(
                    id=str(uuid4()),
                    store_id=self.store_id,
                    camera_id=self.camera_id,
                    agent_id=self.agent_id,
                    occurred_at=datetime.now(UTC),
                    direction=self.line.direction.value,
                    local_track_id=tracked.track_id,
                )
            )
        return events

    def _matches_direction(self, previous_side: float, current_side: float) -> bool:
        if self.line.direction == EntryDirection.POSITIVE_TO_NEGATIVE:
            return previous_side > 0 and current_side < 0
        return previous_side < 0 and current_side > 0


def _crossed(previous_side: float, current_side: float) -> bool:
    return (previous_side > 0 > current_side) or (previous_side < 0 < current_side)
