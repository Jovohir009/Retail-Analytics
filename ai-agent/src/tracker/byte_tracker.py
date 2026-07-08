from __future__ import annotations

from argparse import Namespace
from dataclasses import dataclass

import numpy as np

from models import BoundingBox, Detection, TrackedObject


@dataclass
class _TrackState:
    track_id: int
    bbox: BoundingBox
    confidence: float
    label: str
    missed_frames: int = 0


class ByteTrackTracker:
    """Tracking boundary backed by Ultralytics ByteTrack with a local fallback."""

    def __init__(self, iou_threshold: float = 0.3, max_missed_frames: int = 30, use_ultralytics: bool = True):
        self.iou_threshold = iou_threshold
        self.max_missed_frames = max_missed_frames
        self._next_id = 1
        self._tracks: dict[int, _TrackState] = {}
        self._byte_tracker = self._create_byte_tracker() if use_ultralytics else None

    def update(self, detections: list[Detection], frame: np.ndarray | None = None) -> list[TrackedObject]:
        if self._byte_tracker is not None:
            try:
                return self._update_with_byte_tracker(detections, frame)
            except Exception:
                self._byte_tracker = None
        matched_track_ids: set[int] = set()
        active: list[TrackedObject] = []

        for detection in detections:
            track = self._best_match(detection.bbox, matched_track_ids)
            if track is None:
                track = _TrackState(
                    track_id=self._next_id,
                    bbox=detection.bbox,
                    confidence=detection.confidence,
                    label=detection.label,
                )
                self._tracks[track.track_id] = track
                self._next_id += 1
            else:
                track.bbox = detection.bbox
                track.confidence = detection.confidence
                track.label = detection.label
                track.missed_frames = 0

            matched_track_ids.add(track.track_id)
            active.append(
                TrackedObject(
                    track_id=track.track_id,
                    bbox=track.bbox,
                    confidence=track.confidence,
                    label=track.label,
                )
            )

        self._expire_unmatched(matched_track_ids)
        return active

    def _create_byte_tracker(self):
        try:
            from ultralytics.trackers.byte_tracker import BYTETracker
        except Exception:
            return None
        args = Namespace(
            track_high_thresh=0.25,
            track_low_thresh=0.1,
            new_track_thresh=0.25,
            track_buffer=self.max_missed_frames,
            match_thresh=0.8,
            fuse_score=True,
        )
        return BYTETracker(args)

    def _update_with_byte_tracker(
        self, detections: list[Detection], frame: np.ndarray | None
    ) -> list[TrackedObject]:
        results = _ByteTrackResults.from_detections(detections)
        tracks = self._byte_tracker.update(results, img=frame)
        tracked_objects: list[TrackedObject] = []
        for track in tracks:
            x1, y1, x2, y2, track_id, confidence, class_id = track[:7]
            tracked_objects.append(
                TrackedObject(
                    track_id=int(track_id),
                    bbox=BoundingBox(float(x1), float(y1), float(x2), float(y2)),
                    confidence=float(confidence),
                    label="person" if int(class_id) == 0 else str(int(class_id)),
                )
            )
        return tracked_objects

    def _best_match(self, bbox: BoundingBox, excluded: set[int]) -> _TrackState | None:
        best_track: _TrackState | None = None
        best_iou = 0.0
        for track in self._tracks.values():
            if track.track_id in excluded:
                continue
            score = _iou(track.bbox, bbox)
            if score > best_iou:
                best_iou = score
                best_track = track
        return best_track if best_iou >= self.iou_threshold else None

    def _expire_unmatched(self, matched_track_ids: set[int]) -> None:
        expired: list[int] = []
        for track_id, track in self._tracks.items():
            if track_id in matched_track_ids:
                continue
            track.missed_frames += 1
            if track.missed_frames > self.max_missed_frames:
                expired.append(track_id)
        for track_id in expired:
            del self._tracks[track_id]


def _iou(first: BoundingBox, second: BoundingBox) -> float:
    x1 = max(first.x1, second.x1)
    y1 = max(first.y1, second.y1)
    x2 = min(first.x2, second.x2)
    y2 = min(first.y2, second.y2)
    intersection = max(0.0, x2 - x1) * max(0.0, y2 - y1)
    union = first.area + second.area - intersection
    return intersection / union if union > 0 else 0.0


class _ByteTrackResults:
    def __init__(self, xyxy: np.ndarray, conf: np.ndarray, cls: np.ndarray):
        self.xyxy = xyxy
        self.conf = conf
        self.cls = cls
        if len(xyxy):
            self.xywh = np.column_stack(
                (
                    (xyxy[:, 0] + xyxy[:, 2]) / 2,
                    (xyxy[:, 1] + xyxy[:, 3]) / 2,
                    xyxy[:, 2] - xyxy[:, 0],
                    xyxy[:, 3] - xyxy[:, 1],
                )
            )
        else:
            self.xywh = np.empty((0, 4), dtype=float)

    @classmethod
    def from_detections(cls, detections: list[Detection]) -> "_ByteTrackResults":
        xyxy = np.array([detection.bbox.to_list() for detection in detections], dtype=float)
        if xyxy.size == 0:
            xyxy = np.empty((0, 4), dtype=float)
        conf = np.array([detection.confidence for detection in detections], dtype=float)
        class_ids = np.array([detection.class_id for detection in detections], dtype=float)
        return cls(xyxy=xyxy, conf=conf, cls=class_ids)

    def __len__(self) -> int:
        return len(self.conf)

    def __getitem__(self, mask) -> "_ByteTrackResults":
        return _ByteTrackResults(self.xyxy[mask], self.conf[mask], self.cls[mask])
