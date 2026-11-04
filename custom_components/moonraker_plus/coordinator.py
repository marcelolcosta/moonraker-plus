"""Push coordinator wrapping core.Printer."""

from __future__ import annotations

import asyncio
import logging
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_API_KEY, CONF_HOST, CONF_PORT
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

import aiohttp

from .const import (
    CONF_STREAM_SOURCE,
    CONF_WEB_URL,
    CREALITY_MARKERS,
    CREALITY_WEBRTC_PATH,
    CREALITY_WEBRTC_PORT,
    DEFAULT_PORT,
    DOMAIN,
    SETUP_TIMEOUT_SECONDS,
    UPDATE_THROTTLE_SECONDS,
)
from .core.job import JobInfo
from .core.materials import MaterialSystem
from .core.printer import Printer, PrinterState

_LOGGER = logging.getLogger(__name__)

type MoonrakerConfigEntry = ConfigEntry[MoonrakerCoordinator]


class MoonrakerCoordinator(DataUpdateCoordinator[PrinterState]):
    """Holds one printer connection and pushes throttled updates to entities."""

    config_entry: MoonrakerConfigEntry

    def __init__(self, hass: HomeAssistant, entry: MoonrakerConfigEntry) -> None:
        super().__init__(hass, _LOGGER, config_entry=entry, name=f"{DOMAIN} {entry.title}", update_interval=None)
        self.host: str = entry.data[CONF_HOST]
        self.port: int = entry.data.get(CONF_PORT, DEFAULT_PORT)
        self.api_key: str | None = entry.data.get(CONF_API_KEY) or None
        self.session = async_get_clientsession(hass)
        self.printer = Printer(
            entry.title,
            self.host,
            self.port,
            session=self.session,
            api_key=self.api_key,
            listener=self._on_printer_update,
            allow_commands=True,
        )
        self.job: JobInfo = JobInfo()
        self.materials: list[MaterialSystem] = []
        self._throttle: asyncio.TimerHandle | None = None
        self._last_conn: tuple[bool, str | None] = (False, None)
        self._signature: tuple[Any, ...] | None = None
        self._reload_scheduled = False
        # go2rtc stream source for a native (non-Moonraker) camera, if any.
        self.native_stream_source: str | None = None

    # ------------------------------------------------------------ helpers
    @property
    def state(self) -> PrinterState:
        return self.printer.state

    @property
    def ready(self) -> bool:
        return self.state.connected and self.state.klippy_state == "ready"

    @property
    def base_url(self) -> str:
        return self.printer.client.base_url

    @property
    def web_url(self) -> str:
        return (self.config_entry.options.get(CONF_WEB_URL) or f"http://{self.host}").rstrip("/")

    @property
    def device_info(self) -> DeviceInfo:
        st = self.state
        return DeviceInfo(
            identifiers={(DOMAIN, self.config_entry.unique_id or self.config_entry.entry_id)},
            name=self.config_entry.title,
            manufacturer="Klipper",
            model=st.hostname,
            sw_version=st.printer_info.get("software_version"),
            configuration_url=self.web_url,
        )

    def slot_index(self) -> dict[str, tuple[MaterialSystem, Any]]:
        return {f"{ms.kind}_{s.id}": (ms, s) for ms in self.materials for s in ms.slots}

    def signature(self) -> tuple[Any, ...]:
        """What the entity set depends on; a change triggers a reload."""
        return (
            tuple(self.state.objects),
            tuple(sorted(self.slot_index())),
            tuple(u.id for ms in self.materials for u in ms.units if u.temperature is not None or u.humidity is not None),
            tuple(w.get("uid") or w.get("name") for w in self.state.webcams),
        )

    def _refresh_derived(self) -> None:
        self.job = self.state.job
        self.materials = self.state.materials

    # ------------------------------------------------------------ lifecycle
    async def async_start(self) -> None:
        """Connect and wait for the first full state.

        Unreachable printer (connection attempt failed): give up right away so HA's
        startup isn't delayed; HA retries the entry in the background. Reachable but
        Klipper still starting: wait up to SETUP_TIMEOUT_SECONDS.
        """
        self.printer.start()
        client = self.printer.client
        try:
            async with asyncio.timeout(SETUP_TIMEOUT_SECONDS):
                while not (self.ready and self.state.status):
                    if client.failed_attempts and not self.state.connected:
                        await self.printer.stop()
                        raise ConfigEntryNotReady(
                            f"Can't reach Moonraker at {self.host}:{self.port}: "
                            f"{type(client.last_error).__name__}: {client.last_error}"
                        )
                    await asyncio.sleep(0.1)
        except TimeoutError as err:
            await self.printer.stop()
            raise ConfigEntryNotReady(
                f"{self.host}:{self.port} not ready (connected={self.state.connected}, "
                f"klippy={self.state.klippy_state})"
            ) from err
        self._refresh_derived()
        self.native_stream_source = await self._detect_native_camera()
        self._signature = self.signature()
        self._last_conn = (self.state.connected, self.state.klippy_state)
        self.async_set_updated_data(self.state)

    async def _detect_native_camera(self) -> str | None:
        """User-configured go2rtc source, else Creality's WebRTC camera when the printer has one."""
        if source := (self.config_entry.options.get(CONF_STREAM_SOURCE) or "").strip():
            return source
        if not any(marker in self.state.objects for marker in CREALITY_MARKERS):
            return None
        url = f"http://{self.host}:{CREALITY_WEBRTC_PORT}{CREALITY_WEBRTC_PATH}"
        try:
            async with self.session.get(url, timeout=aiohttp.ClientTimeout(total=3)) as resp:
                body = (await resp.text()).strip()
        except (aiohttp.ClientError, TimeoutError):
            return None
        if resp.status == 200 and body.startswith("{"):
            return f"webrtc:{url}#format=creality"
        return None

    async def async_shutdown(self) -> None:
        if self._throttle is not None:
            self._throttle.cancel()
            self._throttle = None
        await self.printer.stop()
        await super().async_shutdown()

    async def _async_update_data(self) -> PrinterState:
        return self.state

    # ------------------------------------------------------------ updates
    @callback
    def _on_printer_update(self, _printer: Printer) -> None:
        conn = (self.state.connected, self.state.klippy_state)
        if conn != self._last_conn:
            # Availability changes are pushed immediately.
            self._last_conn = conn
            if self._throttle is not None:
                self._throttle.cancel()
                self._throttle = None
            self._push()
            return
        if self._throttle is None:
            self._throttle = self.hass.loop.call_later(UPDATE_THROTTLE_SECONDS, self._push)

    @callback
    def _push(self) -> None:
        self._throttle = None
        self._refresh_derived()
        if self._signature is not None and self.ready and self.signature() != self._signature:
            self._schedule_reload()
        self.async_set_updated_data(self.state)

    @callback
    def _schedule_reload(self) -> None:
        if self._reload_scheduled:
            return
        self._reload_scheduled = True
        _LOGGER.info("%s: printer objects changed, reloading entities", self.config_entry.title)
        self.hass.config_entries.async_schedule_reload(self.config_entry.entry_id)
