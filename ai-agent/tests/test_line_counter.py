import unittest

from counter.line_counter import LineCrossingCounter
from models import BoundingBox, CountingLine, EntryDirection, TrackedObject


def _tracked(track_id: int, y: float) -> TrackedObject:
    return TrackedObject(
        track_id=track_id,
        bbox=BoundingBox(10, y - 5, 20, y + 5),
        confidence=0.9,
        label="person",
    )


class LineCrossingCounterTest(unittest.TestCase):
    def test_counts_entry_once_when_crossing_configured_direction(self) -> None:
        counter = LineCrossingCounter(
            line=CountingLine(
                start=(0, 100),
                end=(200, 100),
                direction=EntryDirection.POSITIVE_TO_NEGATIVE,
            ),
            store_id="store-1",
            camera_id="camera-1",
            agent_id="agent-1",
        )

        self.assertEqual(counter.update([_tracked(1, 120)]), [])
        events = counter.update([_tracked(1, 80)])
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0].store_id, "store-1")
        self.assertEqual(counter.update([_tracked(1, 120)]), [])
        self.assertEqual(counter.update([_tracked(1, 80)]), [])

    def test_ignores_opposite_direction(self) -> None:
        counter = LineCrossingCounter(
            line=CountingLine(
                start=(0, 100),
                end=(200, 100),
                direction=EntryDirection.POSITIVE_TO_NEGATIVE,
            ),
            store_id="store-1",
            camera_id="camera-1",
            agent_id="agent-1",
        )

        self.assertEqual(counter.update([_tracked(2, 80)]), [])
        self.assertEqual(counter.update([_tracked(2, 120)]), [])


if __name__ == "__main__":
    unittest.main()
