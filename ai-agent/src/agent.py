from __future__ import annotations

import logging
import time

import cv2

from camera.factory import CameraFactory
from config.settings import AgentSettings
from counter.line_counter import LineCrossingCounter
from detector.yolo_detector import YOLODetector
from storage.sqlite_event_repository import SQLiteEventRepository
from sync.backend_client import BackendClient
from sync.sync_service import SyncService
from tracker.byte_tracker import ByteTrackTracker


class RetailAnalyticsAgent:
    def __init__(self, settings: AgentSettings, logger: logging.Logger):
        self.settings = settings
        self.logger = logger
        self.camera = CameraFactory().create(settings.camera)
        self.detector = YOLODetector(
            model_name=settings.detector.model_path,
            confidence_threshold=settings.detector.confidence_threshold,
            image_size=settings.detector.image_size,
        )
        self.tracker = ByteTrackTracker()
        self.counter = LineCrossingCounter(
            line=settings.counting_line,
            store_id=settings.store_id,
            camera_id=settings.camera_id,
            agent_id=settings.agent_id,
        )
        self.repository = SQLiteEventRepository(settings.storage.sqlite_path)
        self.sync_service = SyncService(
            settings=settings,
            repository=self.repository,
            client=BackendClient(settings.backend),
            logger=logger,
        )

    def run(self) -> None:
        self.repository.initialize()
        self.sync_service.start()
        read_failures = 0

        try:
            self._open_camera_until_success()
            while True:
                frame = self.camera.read()
                if frame is None:
                    read_failures += 1
                    if read_failures >= self.settings.camera.max_read_failures:
                        self.logger.warning("Camera read failed repeatedly; reconnecting")
                        self._open_camera_until_success()
                        read_failures = 0
                    continue

                read_failures = 0
                detections = self.detector.detect(frame)
                tracks = self.tracker.update(detections, frame)
                events = self.counter.update(tracks)
                for event in events:
                    self.repository.save(event)
                    self.logger.info("Visitor entry counted: event_id=%s track_id=%s", event.id, event.local_track_id)

                if self.settings.display_enabled:
                    self._display(frame, tracks)
                    if cv2.waitKey(1) & 0xFF == ord("q"):
                        break
        finally:
            self.sync_service.stop()
            self.camera.release()
            cv2.destroyAllWindows()

    def _open_camera_until_success(self) -> None:
        while True:
            try:
                self.camera.open()
                self.logger.info("Camera connected")
                return
            except RuntimeError as error:
                self.logger.warning("Camera unavailable: %s", error)
                time.sleep(self.settings.camera.reconnect_delay_seconds)

    def _display(self, frame, tracks) -> None:
        line = self.settings.counting_line
        cv2.line(
            frame,
            (int(line.start[0]), int(line.start[1])),
            (int(line.end[0]), int(line.end[1])),
            (0, 255, 255),
            2,
        )
        for tracked in tracks:
            x1, y1, x2, y2 = [int(value) for value in tracked.bbox.to_list()]
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 180, 0), 2)
            cv2.putText(
                frame,
                f"ID {tracked.track_id}",
                (x1, max(0, y1 - 8)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 180, 0),
                1,
            )
        cv2.imshow("Retail Analytics - AI Agent", frame)
