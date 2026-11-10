"""Print lifecycle events on the HA event bus (`moonraker_plus_event`).

Fired on every print state transition, unthrottled, so automations (device triggers,
the notification blueprint) see each change exactly once. Nothing fires for the state
found at startup or after a reconnect where the state didn't change.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from homeassistant.core import callback
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

from .const import DOMAIN

if TYPE_CHECKING:
    from .coordinator import MoonrakerCoordinator

EVENT_TYPE = f"{DOMAIN}_event"

STARTED = "print_started"
PAUSED = "print_paused"
RESUMED = "print_resumed"
COMPLETED = "print_completed"
CANCELLED = "print_cancelled"
ERROR = "print_error"
KLIPPER_SHUTDOWN = "klipper_shutdown"
TRIGGER_TYPES = (STARTED, PAUSED, RESUMED, COMPLETED, CANCELLED, ERROR, KLIPPER_SHUTDOWN)

_ON_ENTER = {"paused": PAUSED, "complete": COMPLETED, "cancelled": CANCELLED, "error": ERROR}


def classify(prev: str | None, new: str | None) -> str | None:
    """Event type for a print_stats.state transition, or None."""
    if prev is None or new is None or prev == new:
        return None
    if new == "printing":
        return RESUMED if prev == "paused" else STARTED
    return _ON_ENTER.get(new)


class PrintEventTracker:
    def __init__(self, coordinator: MoonrakerCoordinator) -> None:
        self.c = coordinator
        self._print: str | None = None
        self._klippy: str | None = None

    def prime(self) -> None:
        """Remember the current state without firing (setup / first data)."""
        self._print = self._print_state()
        self._klippy = self.c.state.klippy_state

    def _print_state(self) -> str | None:
        return (self.c.state.status.get("print_stats") or {}).get("state")

    @callback
    def update(self) -> None:
        st = self.c.state
        if not st.connected:
            return  # keep the last known state; compare again once reconnected
        klippy = st.klippy_state
        if klippy != self._klippy:
            if self._klippy == "ready" and klippy in ("shutdown", "error"):
                self._fire(KLIPPER_SHUTDOWN, self._klippy_message())
            self._klippy = klippy
        if klippy != "ready":
            return
        new = self._print_state()
        if new is None:
            return  # status reset during a Klipper restart
        prev, self._print = self._print, new
        if event := classify(prev, new):
            message = (st.status.get("print_stats") or {}).get("message") or None
            if event == PAUSED and (runout := self._runout_sensor()):
                message = message or f"Filament runout ({runout})"
            self._fire(event, message, previous=prev)

    def _klippy_message(self) -> str | None:
        st = self.c.state
        msg = (st.status.get("webhooks") or {}).get("state_message") or st.printer_info.get("state_message")
        return msg.strip() if isinstance(msg, str) and msg.strip() else None

    def _runout_sensor(self) -> str | None:
        for info in self.c.state.object_info:
            if info.kind != "filament_sensor":
                continue
            s = self.c.state.status.get(info.name) or {}
            if s.get("enabled") and s.get("filament_detected") is False and not info.label.lower().startswith("mmu pre gate"):
                return info.label
        return None

    def _entity(self, platform: str, key: str) -> str | None:
        from .entity import slug  # noqa: PLC0415  (entity imports the coordinator)

        base = self.c.config_entry.unique_id or self.c.config_entry.entry_id
        return er.async_get(self.c.hass).async_get_entity_id(platform, DOMAIN, f"{base}_{slug(key)}")

    def _camera(self) -> str | None:
        from .entity import slug  # noqa: PLC0415

        if self.c.native_stream_source:
            return self._entity("camera", "webcam_native")
        for cam in self.c.state.webcams:
            if e := self._entity("camera", f"webcam_{slug(cam.get('uid') or cam.get('name') or 'Webcam')}"):
                return e
        return None

    def _fire(self, event: str, message: str | None, previous: str | None = None) -> None:
        entry = self.c.config_entry
        base = entry.unique_id or entry.entry_id
        device = dr.async_get(self.c.hass).async_get_device(identifiers={(DOMAIN, base)})
        job = self.c.state.job
        data: dict[str, Any] = {
            "device_id": device.id if device else None,
            "entry_id": entry.entry_id,
            "printer": entry.title,
            "type": event,
            "previous_state": previous,
            "filename": job.filename,
            "message": message,
            "progress": round(job.progress * 100) if job.progress is not None else None,
            "print_duration": round(job.print_duration) if job.print_duration is not None else None,
            "thumbnail_entity": self._entity("image", "thumbnail"),
            "camera_entity": self._camera(),
        }
        self.c.hass.bus.async_fire(EVENT_TYPE, data)
