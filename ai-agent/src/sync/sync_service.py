from __future__ import annotations

import logging
import threading
import time

import requests

from config.settings import AgentSettings
from storage.event_repository import EventRepository
from sync.backend_client import BackendClient


class SyncService:
    def __init__(
        self,
        settings: AgentSettings,
        repository: EventRepository,
        client: BackendClient,
        logger: logging.Logger,
    ):
        self.settings = settings
        self.repository = repository
        self.client = client
        self.logger = logger
        self._stop_event = threading.Event()
        self._thread: threading.Thread | None = None

    def start(self) -> None:
        if self._thread and self._thread.is_alive():
            return
        self._stop_event.clear()
        self._thread = threading.Thread(target=self._run, name="event-sync", daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self._stop_event.set()
        if self._thread:
            self._thread.join(timeout=5)

    def sync_once(self) -> None:
        events = self.repository.pending(limit=100)
        if not events:
            return
        accepted_ids = self.client.sync_events(events)
        self.repository.mark_synchronized(accepted_ids)
        self.logger.info("Synchronized %s visitor events", len(accepted_ids))

    def send_heartbeat(self, status: str) -> None:
        self.client.heartbeat(self.settings.agent_id, self.settings.camera_id, status)

    def _run(self) -> None:
        last_heartbeat = 0.0
        while not self._stop_event.is_set():
            now = time.monotonic()
            try:
                if now - last_heartbeat >= self.settings.backend.heartbeat_interval_seconds:
                    self.send_heartbeat("ONLINE")
                    last_heartbeat = now
                self.sync_once()
            except requests.RequestException as error:
                self.logger.warning("Backend synchronization unavailable: %s", error)
            except Exception:
                self.logger.exception("Unexpected synchronization failure")
            self._stop_event.wait(self.settings.backend.sync_interval_seconds)
