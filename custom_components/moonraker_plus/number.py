"""Target temperature controls for heaters (nozzles, bed, chamber) and temperature fans."""

from __future__ import annotations

from homeassistant.components.number import NumberDeviceClass, NumberEntity, NumberMode
from homeassistant.const import UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .coordinator import MoonrakerConfigEntry, MoonrakerCoordinator
from .core.client import MoonrakerError
from .core.discovery import ObjectInfo
from .entity import MoonrakerEntity

CONTROLLED_KINDS = ("heater", "temperature_fan")


def target_key(object_name: str) -> str:
    """Entity key; layout.py resolves the same key."""
    return f"{object_name}_set_target"


async def async_setup_entry(
    hass: HomeAssistant, entry: MoonrakerConfigEntry, async_add_entities: AddConfigEntryEntitiesCallback
) -> None:
    c = entry.runtime_data
    async_add_entities(TargetTemperatureNumber(c, i) for i in c.state.object_info if i.kind in CONTROLLED_KINDS)


class TargetTemperatureNumber(MoonrakerEntity, NumberEntity):
    _attr_device_class = NumberDeviceClass.TEMPERATURE
    _attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS
    _attr_native_step = 1
    _attr_mode = NumberMode.BOX
    _attr_icon = "mdi:thermometer-chevron-up"

    def __init__(self, coordinator: MoonrakerCoordinator, info: ObjectInfo) -> None:
        super().__init__(coordinator, target_key(info.name), f"{info.label} target temperature")
        self._obj = info.name
        self._attr_native_min_value, self._attr_native_max_value = coordinator.printer.target_limits(info.name)

    @property
    def native_value(self) -> float | None:
        target = (self.printer_state.status.get(self._obj) or {}).get("target")
        return round(target, 1) if isinstance(target, (int, float)) else None

    async def async_set_native_value(self, value: float) -> None:
        try:
            await self.coordinator.printer.set_target_temperature(self._obj, value)
        except (MoonrakerError, ValueError) as err:
            raise HomeAssistantError(f"Couldn't set {self.name}: {err}") from err
