"""Moonraker Plus: Klipper/Moonraker printers with MMU, CFS and toolchanger support."""

from __future__ import annotations

from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN
from .coordinator import MoonrakerConfigEntry, MoonrakerCoordinator
from .frontend_setup import async_setup_frontend

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

PLATFORMS: list[Platform] = [
    Platform.BINARY_SENSOR,
    Platform.BUTTON,
    Platform.CAMERA,
    Platform.IMAGE,
    Platform.LIGHT,
    Platform.SENSOR,
]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    await async_setup_frontend(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: MoonrakerConfigEntry) -> bool:
    coordinator = MoonrakerCoordinator(hass, entry)
    await coordinator.async_start()
    entry.runtime_data = coordinator
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
