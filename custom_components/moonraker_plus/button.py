"""Buttons: pause/resume/cancel, emergency stop, firmware restart, selected macros."""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from dataclasses import dataclass

from homeassistant.components.button import ButtonDeviceClass, ButtonEntity, ButtonEntityDescription
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import CONF_MACROS
from .coordinator import MoonrakerConfigEntry, MoonrakerCoordinator
from .core.client import MoonrakerError
from .core.printer import Printer
from .entity import MoonrakerEntity


@dataclass(frozen=True, kw_only=True)
class MoonrakerButtonDescription(ButtonEntityDescription):
    press_fn: Callable[[Printer], Awaitable[None]]
    available_fn: Callable[[MoonrakerCoordinator], bool] = lambda c: True


BUTTONS: tuple[MoonrakerButtonDescription, ...] = (
    MoonrakerButtonDescription(
        key="pause",
        name="Pause print",
        icon="mdi:pause",
        press_fn=lambda p: p.pause(),
        available_fn=lambda c: c.job.state == "printing",
    ),
    MoonrakerButtonDescription(
        key="resume",
        name="Resume print",
        icon="mdi:play",
        press_fn=lambda p: p.resume(),
        available_fn=lambda c: c.job.state == "paused",
    ),
    MoonrakerButtonDescription(
        key="cancel",
        name="Cancel print",
        icon="mdi:stop",
        press_fn=lambda p: p.cancel(),
        available_fn=lambda c: c.job.active,
    ),
    MoonrakerButtonDescription(
        key="emergency_stop",
        name="Emergency stop",
        icon="mdi:alert-octagon",
        entity_registry_enabled_default=False,
        press_fn=lambda p: p.emergency_stop(),
    ),
    MoonrakerButtonDescription(
        key="firmware_restart",
        name="Firmware restart",
        device_class=ButtonDeviceClass.RESTART,
        entity_category=EntityCategory.CONFIG,
        entity_registry_enabled_default=False,
        press_fn=lambda p: p.firmware_restart(),
    ),
)


async def async_setup_entry(
    hass: HomeAssistant, entry: MoonrakerConfigEntry, async_add_entities: AddConfigEntryEntitiesCallback
) -> None:
    c = entry.runtime_data
    entities: list[ButtonEntity] = [MoonrakerButton(c, d) for d in BUTTONS]
    known = {o.split(" ", 1)[1] for o in c.state.objects if o.startswith("gcode_macro ")}
    entities += [MacroButton(c, m) for m in entry.options.get(CONF_MACROS, []) if m in known]
    async_add_entities(entities)


class MoonrakerButton(MoonrakerEntity, ButtonEntity):
    entity_description: MoonrakerButtonDescription

    def __init__(self, coordinator: MoonrakerCoordinator, description: MoonrakerButtonDescription) -> None:
        super().__init__(coordinator, f"button_{description.key}", description.name)
        self.entity_description = description

    @property
    def available(self) -> bool:
        if self.entity_description.key == "firmware_restart":
            # Must work when Klipper is in shutdown/error, as long as Moonraker is reachable.
            return self.coordinator.state.connected
        return super().available and self.entity_description.available_fn(self.coordinator)

    async def async_press(self) -> None:
        try:
            await self.entity_description.press_fn(self.coordinator.printer)
        except MoonrakerError as err:
            raise HomeAssistantError(f"{self.entity_description.name} failed: {err}") from err


class MacroButton(MoonrakerEntity, ButtonEntity):
    _attr_icon = "mdi:script-text-play"

    def __init__(self, coordinator: MoonrakerCoordinator, macro: str) -> None:
        super().__init__(coordinator, f"macro_{macro}", f"Macro {macro}")
        self._macro = macro

    async def async_press(self) -> None:
        try:
            await self.coordinator.printer.gcode(self._macro)
        except MoonrakerError as err:
            raise HomeAssistantError(f"Macro {self._macro} failed: {err}") from err
