"""One printer: connection + merged state + derived models.

The HA coordinator will wrap this class; the CLI uses it directly.
"""

from __future__ import annotations

import asyncio
import logging
import time
from collections.abc import Callable
from dataclasses import dataclass, field
from typing import Any

import aiohttp

from .client import MoonrakerClient, MoonrakerError
from .discovery import ObjectInfo, classify, subscribable
from .job import JobInfo, compute_job
from .materials import MaterialAdapter, MaterialSystem, detect_adapters, parse_all

_LOGGER = logging.getLogger(__name__)

Listener = Callable[["Printer"], None]
RawListener = Callable[["Printer", str, list[Any]], None]


@dataclass
class PrinterState:
    """Everything known about a printer. Pure data; no I/O."""

    connected: bool = False
    klippy_state: str | None = None  # ready | startup | shutdown | error | disconnected
    server_info: dict[str, Any] = field(default_factory=dict)
    printer_info: dict[str, Any] = field(default_factory=dict)
    objects: list[str] = field(default_factory=list)
    status: dict[str, dict[str, Any]] = field(default_factory=dict)
    webcams: list[dict[str, Any]] = field(default_factory=list)
    config: dict[str, Any] = field(default_factory=dict)  # configfile.settings (lower-case keys)
    file_metadata: dict[str, Any] | None = None
    proc_stats: dict[str, Any] = field(default_factory=dict)
    last_update: float | None = None
    # derived, refreshed by refresh_derived()
    object_info: list[ObjectInfo] = field(default_factory=list)
    adapters: list[type[MaterialAdapter]] = field(default_factory=list)

    def set_objects(self, objects: list[str]) -> None:
        self.objects = objects
        self.object_info = classify(objects)
        self.adapters = detect_adapters(objects)

    def merge_status(self, diff: dict[str, Any]) -> None:
        """Apply a notify_status_update diff. Klipper sends changed top-level fields per object."""
        for obj, fields in diff.items():
            if isinstance(fields, dict):
                self.status.setdefault(obj, {}).update(fields)
        self.last_update = time.time()

    def object_config(self, object_name: str) -> dict[str, Any]:
        """configfile.settings section for an object (Klipper lower-cases section names)."""
        return self.config.get(object_name.lower()) or {}

    @property
    def job(self) -> JobInfo:
        return compute_job(self.status, self.file_metadata)

    @property
    def materials(self) -> list[MaterialSystem]:
        return parse_all(self.adapters, self.status)

    @property
    def hostname(self) -> str | None:
        return self.printer_info.get("hostname")

    @classmethod
    def from_fixture(cls, data: dict[str, Any]) -> PrinterState:
        """Build from the JSON files in tests/fixtures/<printer>/ (see load_fixture)."""
        st = cls(connected=True)
        st.server_info = data.get("server_info", {})
        st.printer_info = data.get("printer_info", {})
        st.klippy_state = st.server_info.get("klippy_state")
        st.set_objects(data.get("printer_objects_list", {}).get("objects", []))
        st.merge_status(data.get("status", {}).get("status", {}))
        st.webcams = data.get("server_webcams_list", {}).get("webcams", [])
        st.config = data.get("config", {})
        return st


class Printer:
    def __init__(
        self,
        name: str,
        host: str,
        port: int = 7125,
        *,
        session: aiohttp.ClientSession,
        api_key: str | None = None,
        listener: Listener | None = None,
        raw_listener: RawListener | None = None,
        allow_commands: bool = False,
    ) -> None:
        self.name = name
        self.state = PrinterState()
        self._listener = listener
        self._raw_listener = raw_listener
        self._task: asyncio.Task[None] | None = None
        self._meta_task: asyncio.Task[None] | None = None
        self._meta_for: str | None = None
        # Read-only unless the caller explicitly opts in (the CLI never does).
        self.client = MoonrakerClient(
            host,
            port,
            session=session,
            api_key=api_key,
            allow_commands=allow_commands,
            on_notification=self._on_notification,
            on_connect=self._on_connect,
            on_disconnect=self._on_disconnect,
        )

    # ---------------------------------------------------------- lifecycle
    def start(self) -> None:
        self._task = asyncio.create_task(self.client.run_forever(), name=f"moonraker-{self.name}")

    async def stop(self) -> None:
        await self.client.close()
        for t in (self._task, self._meta_task):
            if t is not None:
                t.cancel()
        for t in (self._task, self._meta_task):
            if t is not None:
                try:
                    await t
                except (asyncio.CancelledError, Exception):  # noqa: BLE001
                    pass

    def _notify(self) -> None:
        if self._listener is not None:
            self._listener(self)

    # ---------------------------------------------------------- handlers
    async def _on_connect(self) -> None:
        self.state.connected = True
        self.state.server_info = await self.client.call("server.info")
        self.state.klippy_state = self.state.server_info.get("klippy_state")
        try:
            self.state.webcams = (await self.client.call("server.webcams.list")).get("webcams", [])
        except MoonrakerError:
            self.state.webcams = []
        if self.state.klippy_state == "ready":
            await self._init_klippy()
        self._notify()

    async def _init_klippy(self) -> None:
        self.state.printer_info = await self.client.call("printer.info")
        objects = (await self.client.call("printer.objects.list"))["objects"]
        self.state.set_objects(objects)
        try:
            cfg = await self.client.call("printer.objects.query", {"objects": {"configfile": ["settings"]}})
            self.state.config = cfg["status"]["configfile"]["settings"]
        except (MoonrakerError, KeyError, TypeError):
            self.state.config = {}
        sub = {o: None for o in subscribable(objects)}
        result = await self.client.call("printer.objects.subscribe", {"objects": sub})
        self.state.status = {}
        self.state.merge_status(result.get("status", {}))
        self._meta_for = None  # force a metadata refresh after (re)connect
        self._maybe_fetch_metadata()

    def _on_disconnect(self, err: Exception | None) -> None:
        self.state.connected = False
        self._notify()

    def _on_notification(self, method: str, params: list[Any]) -> None:
        if self._raw_listener is not None:
            self._raw_listener(self, method, params)
        if method == "notify_status_update" and params:
            self.state.merge_status(params[0])
            self._maybe_fetch_metadata()
        elif method == "notify_klippy_ready":
            self.state.klippy_state = "ready"
            asyncio.create_task(self._safe_init_klippy())
        elif method in ("notify_klippy_shutdown", "notify_klippy_disconnected"):
            self.state.klippy_state = "shutdown" if method.endswith("shutdown") else "disconnected"
        elif method == "notify_proc_stat_update" and params:
            self.state.proc_stats = params[0]
            return  # once per second; don't wake listeners for it
        else:
            return
        self._notify()

    async def _safe_init_klippy(self) -> None:
        try:
            await self._init_klippy()
        except MoonrakerError as exc:
            _LOGGER.warning("%s: re-init after klippy ready failed: %s", self.name, exc)
        self._notify()

    def _maybe_fetch_metadata(self) -> None:
        filename = (self.state.status.get("print_stats") or {}).get("filename") or None
        if filename == self._meta_for:
            return
        self._meta_for = filename
        if not filename:
            self.state.file_metadata = None
            return
        if self._meta_task is not None:
            self._meta_task.cancel()
        self._meta_task = asyncio.create_task(self._fetch_metadata(filename))

    async def _fetch_metadata(self, filename: str) -> None:
        try:
            self.state.file_metadata = await self.client.call("server.files.metadata", {"filename": filename})
        except MoonrakerError as exc:
            _LOGGER.debug("%s: metadata for %s failed: %s", self.name, filename, exc)
            self.state.file_metadata = None
        self._notify()

    # ---------------------------------------------------------- commands
    # All of these raise CommandNotAllowedError unless allow_commands=True.
    async def gcode(self, script: str) -> None:
        await self.client.call("printer.gcode.script", {"script": script})

    async def pause(self) -> None:
        await self.client.call("printer.print.pause")

    async def resume(self) -> None:
        await self.client.call("printer.print.resume")

    async def cancel(self) -> None:
        await self.client.call("printer.print.cancel")

    async def emergency_stop(self) -> None:
        await self.client.call("printer.emergency_stop")

    async def firmware_restart(self) -> None:
        await self.client.call("printer.firmware_restart")

    async def set_output_pin(self, object_name: str, value: float) -> None:
        """value is normalized 0..1 (as reported in status); SET_PIN takes raw units (x scale)."""
        pin = object_name.split(" ", 1)[1]
        cfg = self.state.object_config(object_name)
        if not cfg.get("pwm", False):
            value = 1.0 if value > 0 else 0.0
        raw = value * float(cfg.get("scale", 1.0) or 1.0)
        await self.gcode(f"SET_PIN PIN={pin} VALUE={raw:.4g}")

    async def set_led(self, object_name: str, red: float, green: float, blue: float, white: float | None = None) -> None:
        led = object_name.split(" ", 1)[1]
        cmd = f"SET_LED LED={led} RED={red:.3f} GREEN={green:.3f} BLUE={blue:.3f}"
        if white is not None:
            cmd += f" WHITE={white:.3f}"
        await self.gcode(cmd)

    async def set_fan_speed(self, object_name: str, speed: float) -> None:
        """Set a client-controllable fan (fan_generic, or the part fan "fan") to 0..1."""
        if not 0.0 <= speed <= 1.0:
            raise ValueError(f"{object_name}: speed {speed:g} outside 0..1")
        prefix, _, name = object_name.partition(" ")
        if prefix == "fan_generic":
            await self.gcode(f"SET_FAN_SPEED FAN={name} SPEED={speed:.3g}")
        elif object_name == "fan":
            await self.gcode(f"M106 S{round(speed * 255)}" if speed > 0 else "M107")
        else:
            raise ValueError(f"{object_name} is not a client-controllable fan")

    def target_limits(self, object_name: str) -> tuple[float, float]:
        """Allowed target range for a heater or temperature_fan: 0 .. max_temp from the config."""
        cfg = self.state.object_config(object_name)
        default_max = 120.0 if object_name == "heater_bed" else 80.0 if " " in object_name else 300.0
        try:
            max_temp = float(cfg.get("max_temp", default_max))
        except (TypeError, ValueError):
            max_temp = default_max
        return 0.0, max_temp

    async def set_target_temperature(self, object_name: str, target: float) -> None:
        """Set a heater's (extruder*, heater_bed, heater_generic) or temperature_fan's target in °C.

        Raises ValueError outside 0..max_temp, before anything is sent.
        """
        low, high = self.target_limits(object_name)
        if not low <= target <= high:
            raise ValueError(f"{object_name}: target {target:g} °C outside {low:g}..{high:g}")
        prefix, _, name = object_name.partition(" ")
        if prefix == "temperature_fan":
            await self.gcode(f"SET_TEMPERATURE_FAN_TARGET TEMPERATURE_FAN={name} TARGET={target:g}")
        else:
            heater = name or object_name  # extruder, extruder1, heater_bed, or the heater_generic name
            await self.gcode(f"SET_HEATER_TEMPERATURE HEATER={heater} TARGET={target:g}")


async def probe(
    session: aiohttp.ClientSession, host: str, port: int = 7125, api_key: str | None = None
) -> dict[str, Any]:
    """One-shot HTTP probe used by config flows: server, printer and machine info."""
    client = MoonrakerClient(host, port, session=session, api_key=api_key)
    out: dict[str, Any] = {"server_info": await client.http_get_json("/server/info")}
    for key, path in (("printer_info", "/printer/info"), ("system_info", "/machine/system_info")):
        try:
            out[key] = await client.http_get_json(path)
        except aiohttp.ClientError:
            out[key] = {}
    return out


def machine_id(system_info: dict[str, Any]) -> str | None:
    """Stable id for a printer host: the first real MAC address, if any."""
    ifaces = ((system_info.get("system_info") or system_info).get("network") or {})
    for name in sorted(ifaces):
        mac = (ifaces[name] or {}).get("mac_address")
        if name != "lo" and mac and mac != "00:00:00:00:00:00":
            return mac.lower()
    return None
