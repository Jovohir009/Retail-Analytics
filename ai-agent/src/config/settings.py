from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

from models import CountingLine, EntryDirection

load_dotenv()


def _env(name: str, default: str | None = None) -> str | None:
    value = os.getenv(name)
    return value if value not in (None, "") else default


def _required_env(name: str) -> str:
    value = _env(name)
    if value is None:
        raise RuntimeError(
            f"Missing required environment variable: {name}. "
            f"Please configure it in the AI Agent .env file."
        )
    return value


@dataclass(frozen=True)
class CameraSettings:
    source_type: str
    source: str
    reconnect_delay_seconds: float
    max_read_failures: int


@dataclass(frozen=True)
class DetectorSettings:
    model_path: str
    confidence_threshold: float
    image_size: int


@dataclass(frozen=True)
class BackendSettings:
    base_url: str
    api_token: str
    timeout_seconds: float
    sync_interval_seconds: float
    heartbeat_interval_seconds: float


@dataclass(frozen=True)
class StorageSettings:
    sqlite_path: str


@dataclass(frozen=True)
class AgentSettings:
    agent_id: str
    store_id: str
    camera_id: str
    display_enabled: bool
    camera: CameraSettings
    detector: DetectorSettings
    backend: BackendSettings
    storage: StorageSettings
    counting_line: CountingLine

    @classmethod
    def load(cls, config_path: str | None = None) -> "AgentSettings":
        config = _load_json(config_path or _env("AGENT_CONFIG_PATH"))

        line = config.get("countingLine", {})
        start = _point_from_config(
            line.get("start"),
            _env("COUNTING_LINE_START", "0,240"),
        )
        end = _point_from_config(
            line.get("end"),
            _env("COUNTING_LINE_END", "640,240"),
        )

        direction = EntryDirection(
            line.get("direction")
            or _env(
                "ENTRY_DIRECTION",
                EntryDirection.POSITIVE_TO_NEGATIVE.value,
            )
        )

        return cls(
            agent_id=str(config.get("agentId") or _required_env("AGENT_ID")),
            store_id=str(config.get("storeId") or _required_env("STORE_ID")),
            camera_id=str(config.get("cameraId") or _required_env("CAMERA_ID")),
            display_enabled=_bool(
                config.get("displayEnabled"),
                _env("DISPLAY_ENABLED", "true"),
            ),
            camera=CameraSettings(
                source_type=str(
                    config.get("camera", {}).get("sourceType")
                    or _env("CAMERA_SOURCE_TYPE", "webcam")
                ),
                source=str(
                    config.get("camera", {}).get("source") or _env("CAMERA_SOURCE", "0")
                ),
                reconnect_delay_seconds=float(
                    config.get("camera", {}).get("reconnectDelaySeconds")
                    or _env("CAMERA_RECONNECT_DELAY_SECONDS", "5")
                ),
                max_read_failures=int(
                    config.get("camera", {}).get("maxReadFailures")
                    or _env("CAMERA_MAX_READ_FAILURES", "20")
                ),
            ),
            detector=DetectorSettings(
                model_path=str(
                    config.get("detector", {}).get("modelPath")
                    or _env("YOLO_MODEL_PATH", "yolov8n.pt")
                ),
                confidence_threshold=float(
                    config.get("detector", {}).get("confidenceThreshold")
                    or _env("DETECTION_CONFIDENCE_THRESHOLD", "0.35")
                ),
                image_size=int(
                    config.get("detector", {}).get("imageSize")
                    or _env("YOLO_IMAGE_SIZE", "640")
                ),
            ),
            backend=BackendSettings(
                base_url=str(
                    config.get("backend", {}).get("baseUrl")
                    or _env("BACKEND_BASE_URL", "http://localhost:3000/api/v1")
                ),
                api_token=_required_env("AGENT_API_TOKEN"),
                timeout_seconds=float(
                    config.get("backend", {}).get("timeoutSeconds")
                    or _env("BACKEND_TIMEOUT_SECONDS", "10")
                ),
                sync_interval_seconds=float(
                    config.get("backend", {}).get("syncIntervalSeconds")
                    or _env("SYNC_INTERVAL_SECONDS", "15")
                ),
                heartbeat_interval_seconds=float(
                    config.get("backend", {}).get("heartbeatIntervalSeconds")
                    or _env("HEARTBEAT_INTERVAL_SECONDS", "30")
                ),
            ),
            storage=StorageSettings(
                sqlite_path=str(
                    config.get("storage", {}).get("sqlitePath")
                    or _env("SQLITE_PATH", str(Path("data") / "agent.sqlite3"))
                )
            ),
            counting_line=CountingLine(
                start=start,
                end=end,
                direction=direction,
            ),
        )


def _load_json(path: str | None) -> dict[str, Any]:
    if not path:
        return {}

    file_path = Path(path)

    if not file_path.exists():
        return {}

    return json.loads(file_path.read_text(encoding="utf-8"))


def _point_from_config(
    value: Any,
    fallback: str | None,
) -> tuple[float, float]:
    if isinstance(value, (list, tuple)) and len(value) == 2:
        return float(value[0]), float(value[1])

    raw = fallback or "0,0"
    x, y = raw.split(",", 1)

    return float(x.strip()), float(y.strip())


def _bool(value: Any, fallback: str | None) -> bool:
    raw = value if value is not None else (fallback or "false")

    if isinstance(raw, bool):
        return raw

    return str(raw).lower() in {"1", "true", "yes", "on"}
