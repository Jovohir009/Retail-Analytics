from __future__ import annotations

import sqlite3
from contextlib import closing
from datetime import UTC, datetime
from pathlib import Path

from models import VisitorEvent
from storage.event_repository import EventRepository


class SQLiteEventRepository(EventRepository):
    def __init__(self, database_path: str):
        self.database_path = Path(database_path)

    def initialize(self) -> None:
        self.database_path.parent.mkdir(parents=True, exist_ok=True)
        with closing(self._connect()) as connection:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS visitor_events (
                    id TEXT PRIMARY KEY,
                    store_id TEXT NOT NULL,
                    camera_id TEXT NOT NULL,
                    agent_id TEXT NOT NULL,
                    occurred_at TEXT NOT NULL,
                    direction TEXT NOT NULL,
                    local_track_id INTEGER NOT NULL,
                    synchronized_at TEXT,
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
            connection.execute(
                "CREATE INDEX IF NOT EXISTS idx_visitor_events_sync ON visitor_events(synchronized_at, occurred_at)"
            )
            connection.commit()

    def save(self, event: VisitorEvent) -> None:
        with closing(self._connect()) as connection:
            connection.execute(
                """
                INSERT OR IGNORE INTO visitor_events (
                    id, store_id, camera_id, agent_id, occurred_at, direction, local_track_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    event.id,
                    event.store_id,
                    event.camera_id,
                    event.agent_id,
                    event.occurred_at.isoformat(),
                    event.direction,
                    event.local_track_id,
                ),
            )
            connection.commit()

    def pending(self, limit: int = 100) -> list[VisitorEvent]:
        with closing(self._connect()) as connection:
            rows = connection.execute(
                """
                SELECT id, store_id, camera_id, agent_id, occurred_at, direction, local_track_id
                FROM visitor_events
                WHERE synchronized_at IS NULL
                ORDER BY occurred_at ASC
                LIMIT ?
                """,
                (limit,),
            ).fetchall()
        return [
            VisitorEvent(
                id=row["id"],
                store_id=row["store_id"],
                camera_id=row["camera_id"],
                agent_id=row["agent_id"],
                occurred_at=_parse_datetime(row["occurred_at"]),
                direction=row["direction"],
                local_track_id=int(row["local_track_id"]),
            )
            for row in rows
        ]

    def mark_synchronized(self, event_ids: list[str]) -> None:
        if not event_ids:
            return
        placeholders = ",".join("?" for _ in event_ids)
        synchronized_at = datetime.now(UTC).isoformat()
        with closing(self._connect()) as connection:
            connection.execute(
                f"UPDATE visitor_events SET synchronized_at = ? WHERE id IN ({placeholders})",
                [synchronized_at, *event_ids],
            )
            connection.commit()

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.database_path)
        connection.row_factory = sqlite3.Row
        return connection


def _parse_datetime(value: str) -> datetime:
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    return parsed if parsed.tzinfo else parsed.replace(tzinfo=UTC)
