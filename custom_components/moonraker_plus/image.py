"""Thumbnail of the current (or last) print file."""

from __future__ import annotations

from urllib.parse import quote

import aiohttp

from homeassistant.components.image import ImageEntity
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from .coordinator import MoonrakerConfigEntry, MoonrakerCoordinator
from .entity import MoonrakerEntity


async def async_setup_entry(
    hass: HomeAssistant, entry: MoonrakerConfigEntry, async_add_entities: AddConfigEntryEntitiesCallback
) -> None:
    async_add_entities([ThumbnailImage(hass, entry.runtime_data)])


class ThumbnailImage(MoonrakerEntity, ImageEntity):
    _attr_content_type = "image/png"
    _attr_icon = "mdi:image"

    def __init__(self, hass: HomeAssistant, coordinator: MoonrakerCoordinator) -> None:
        MoonrakerEntity.__init__(self, coordinator, "thumbnail", "Print thumbnail")
        ImageEntity.__init__(self, hass)
        self._path: str | None = None
        self._image: bytes | None = None
        self._update_path()

    def _update_path(self) -> bool:
        path = self.coordinator.job.thumbnail_path
        # Keep showing the last job's thumbnail when idle.
        if path and path != self._path:
            self._path = path
            self._image = None
            self._attr_image_last_updated = dt_util.utcnow()
            return True
        return False

    @callback
    def _handle_coordinator_update(self) -> None:
        self._update_path()
        super()._handle_coordinator_update()

    @property
    def available(self) -> bool:
        return self._path is not None and self.coordinator.state.connected

    @property
    def extra_state_attributes(self) -> dict[str, str | None]:
        return {"path": self._path}

    async def async_image(self) -> bytes | None:
        if self._path is None:
            return None
        if self._image is None:
            url = f"{self.coordinator.base_url}/server/files/gcodes/{quote(self._path)}"
            headers = {"X-Api-Key": self.coordinator.api_key} if self.coordinator.api_key else {}
            try:
                async with self.coordinator.session.get(
                    url, headers=headers, timeout=aiohttp.ClientTimeout(total=10)
                ) as resp:
                    resp.raise_for_status()
                    self._image = await resp.read()
            except (aiohttp.ClientError, TimeoutError):
                return None
        return self._image
