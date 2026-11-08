"""Moonraker Plus: Klipper/Moonraker printers with MMU, CFS and toolchanger support."""

from __future__ import annotations

from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN
from .coordinator import MoonrakerConfigEntry, MoonrakerCoordinator
from .frontend_setup import async_setup_frontend

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

PLATFORMS: list[Platform] = [
    Platform.BINARY_SENSOR,
    Platform.BUTTON,
    Platform.CAMERA,
    Platform.FAN,
    Platform.IMAGE,
    Platform.LIGHT,
    Platform.NUMBER,
    Platform.SENSOR,
]

# Set in entry.data once the emergency-stop button has been enabled for an existing install.
ESTOP_MIGRATED = "estop_enabled_v030"


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    await async_setup_frontend(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: MoonrakerConfigEntry) -> bool:
    coordinator = MoonrakerCoordinator(hass, entry)
    await coordinator.async_start()
    entry.runtime_data = coordinator
    _enable_emergency_stop_once(hass, entry)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_options_updated))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: MoonrakerConfigEntry) -> bool:
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        await entry.runtime_data.async_shutdown()
    return unloaded


async def _async_options_updated(hass: HomeAssistant, entry: MoonrakerConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


def _enable_emergency_stop_once(hass: HomeAssistant, entry: MoonrakerConfigEntry) -> None:
    """Emergency stop was disabled by default before 0.3.0; enable it once on existing installs.

    Only when the integration disabled it. If the user disabled it themselves, leave it alone.
    """
    if entry.data.get(ESTOP_MIGRATED):
        return
    reg = er.async_get(hass)
    unique_id = f"{entry.unique_id or entry.entry_id}_button_emergency_stop"
    if (entity_id := reg.async_get_entity_id("button", DOMAIN, unique_id)) and (
        reg.async_get(entity_id).disabled_by is er.RegistryEntryDisabler.INTEGRATION
    ):
        reg.async_update_entity(entity_id, disabled_by=None)
    hass.config_entries.async_update_entry(entry, data={**entry.data, ESTOP_MIGRATED: True})
