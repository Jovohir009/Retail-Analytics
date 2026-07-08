import unittest
from datetime import UTC, datetime
from tempfile import TemporaryDirectory
from pathlib import Path

from models import VisitorEvent
from storage.sqlite_event_repository import SQLiteEventRepository


class SQLiteEventRepositoryTest(unittest.TestCase):
    def test_persists_pending_events_and_marks_synchronized(self) -> None:
        with TemporaryDirectory() as temporary_directory:
            repository = SQLiteEventRepository(str(Path(temporary_directory) / "agent.sqlite3"))
            repository.initialize()
            event = VisitorEvent(
                id="event-1",
                store_id="store-1",
                camera_id="camera-1",
                agent_id="agent-1",
                occurred_at=datetime(2026, 1, 1, tzinfo=UTC),
                direction="positive_to_negative",
                local_track_id=7,
            )

            repository.save(event)
            self.assertEqual([pending.id for pending in repository.pending()], ["event-1"])
            repository.mark_synchronized(["event-1"])
            self.assertEqual(repository.pending(), [])


if __name__ == "__main__":
    unittest.main()
