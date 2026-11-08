"""Speed control for client-controllable fans (fan_generic, e.g. chamber/exhaust, and the part fan).

Fans Klipper drives itself (heater_fan, controller_fan, temperature_fan) stay read-only sensors.
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.fan import FanEntity, FanEntityFeature
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .coordinator import MoonrakerConfigEntry, MoonrakerCoordinator
from .core.client import MoonrakerError
from .core.discovery import ObjectInfo
from .entity import MoonrakerEntity


def fan_key(object_name: str) -> str:
    """Entity key; layout.py resolves the same key."""
    return f"{object_name}_fan_control"


async def async_setup_entry(
    hass: HomeAssistant, entry: MoonrakerConfigEntry, async_add_entities: AddConfigEntryEntitiesCallback
) -> None:
    c = entry.runtime_data
    async_add_entities(PrinterFan(c, i) for i in c.state.object_info if i.kind == "fan" and i.controllable)


class PrinterFan(MoonrakerEntity, FanEntity):
    _attr_supported_features = (
        FanEntityFeature.SET_SPEED | FanEntityFeature.TURN_ON | FanEntityFeature.TURN_OFF
    )
    _attr_speed_count = 100

    def __init__(self, coordinator: MoonrakerCoordinator, info: ObjectInfo) -> None:
        super().__init__(coordinator, fan_key(info.name), info.label)
        self._obj = info.name

    @property
    def _speed(self) -> float | None:
        speed = (self.printer_state.status.get(self._obj) or {}).get("speed")
        return float(speed) if isinstance(speed, (int, float)) else None

    @property
    def is_on(self) -> bool | None:
        return None if self._speed is None else self._speed > 0

    @property
    def percentage(self) -> int | None:
        return None if self._speed is None else round(self._speed * 100)

    async def _set(self, percentage: float) -> None:
        try:
            await self.coordinator.printer.set_fan_speed(self._obj, percentage / 100)
        except (MoonrakerError, ValueError) as err:
            raise HomeAssistantError(f"Couldn't set {self.name}: {err}") from err

    async def async_set_percentage(self, percentage: int) -> None:
        await self._set(percentage)

    async def async_turn_on(self, percentage: int | None = None, preset_mode: str | None = None, **kwargs: Any) -> None:
        await self._set(100 if percentage is None else percentage)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self._set(0)
