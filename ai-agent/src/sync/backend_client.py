from __future__ import annotations

import requests

from config.settings import BackendSettings
from models import VisitorEvent


class BackendClient:
    def __init__(self, settings: BackendSettings):
        self.settings = settings
        self.session = requests.Session()

    def sync_events(self, events: list[VisitorEvent]) -> list[str]:
        if not events:
            return []

        response = self.session.post(
            f"{self.settings.base_url.rstrip('/')}/agent/events/batch",
            json={"events": [event.to_api_payload() for event in events]},
            headers=self._headers(),
            timeout=self.settings.timeout_seconds,
        )

        if not response.ok:
            print("Status:", response.status_code)
            print("Response:", response.text)
            response.raise_for_status()

        payload = response.json()
        data = payload.get("data", {})
        accepted = data.get("acceptedEventIds")

        if isinstance(accepted, list):
            return [str(event_id) for event_id in accepted]

        return [event.id for event in events]

    def heartbeat(self, agent_id: str, camera_id: str, status: str) -> None:
        response = self.session.post(
            f"{self.settings.base_url.rstrip('/')}/agent/heartbeat",
            json={
                "agentId": agent_id,
                "cameraId": camera_id,
                "status": status,
            },
            headers=self._headers(),
            timeout=self.settings.timeout_seconds,
        )
        response.raise_for_status()

    def _headers(self) -> dict[str, str]:
        headers = {"Content-Type": "application/json"}

        if self.settings.api_token:
            headers["Authorization"] = f"Bearer {self.settings.api_token}"

        return headers
