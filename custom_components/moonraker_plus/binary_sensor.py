"""Binary sensors: printing, filament sensors."""

from __future__ import annotations

from homeassistant.components.binary_sensor import BinarySensorDeviceClass, BinarySensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .coordinator import MoonrakerConfigEntry, MoonrakerCoordinator
from .core.discovery import ObjectInfo
from .entity import MoonrakerEntity


async def async_setup_entry(
    hass: HomeAssistant, entry: MoonrakerConfigEntry, async_add_entities: AddConfigEntryEntitiesCallback
) -> None:
    c = entry.runtime_data
    entities: list[BinarySensorEntity] = [PrintingBinarySensor(c)]
    entities += [FilamentBinarySensor(c, i) for i in c.state.object_info if i.kind == "filament_sensor"]
    async_add_entities(entities)


class PrintingBinarySensor(MoonrakerEntity, BinarySensorEntity):
    _attr_device_class = BinarySensorDeviceClass.RUNNING

    def __init__(self, coordinator: MoonrakerCoordinator) -> None:
        super().__init__(coordinator, "printing", "Printing")

    @property
    def is_on(self) -> bool:
        return self.coordinator.job.active


class FilamentBinarySensor(MoonrakerEntity, BinarySensorEntity):
    _attr_icon = "mdi:printer-3d-nozzle-alert-outline"

    def __init__(self, coordinator: MoonrakerCoordinator, info: ObjectInfo) -> None:
        super().__init__(coordinator, f"{info.name}_detected", info.label)
        self._obj = info.name
        # Happy Hare pre-gate sensors beyond the configured gate count are noise (see docs).
        if info.label.lower().startswith("mmu pre gate"):
            self._attr_entity_registry_enabled_default = False

    @property
    def is_on(self) -> bool | None:
        return (self.printer_state.status.get(self._obj) or {}).get("filament_detected")

    @property
    def extra_state_attributes(self) -> dict[str, object]:
        s = self.printer_state.status.get(self._obj) or {}
        return {"enabled": s.get("enabled")}
