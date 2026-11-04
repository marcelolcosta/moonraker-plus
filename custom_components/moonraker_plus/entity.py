"""Base entity."""

from __future__ import annotations

import re

from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .coordinator import MoonrakerCoordinator
from .core.printer import PrinterState


def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", value.lower()).strip("_")


class MoonrakerEntity(CoordinatorEntity[MoonrakerCoordinator]):
    _attr_has_entity_name = True

    def __init__(self, coordinator: MoonrakerCoordinator, key: str, name: str | None) -> None:
        super().__init__(coordinator)
        base = coordinator.config_entry.unique_id or coordinator.config_entry.entry_id
        self._attr_unique_id = f"{base}_{slug(key)}"
        self._attr_name = name
        self._attr_device_info = coordinator.device_info

    @property
    def printer_state(self) -> PrinterState:
        return self.coordinator.state

    @property
    def available(self) -> bool:
        return super().available and self.coordinator.ready
