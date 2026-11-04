"""Async Moonraker WebSocket JSON-RPC client.

HA-free: depends only on asyncio and aiohttp, so it can be vendored into the
Home Assistant integration unchanged.

Safety: by default the client refuses to send anything that is not in
READ_ONLY_METHODS. Commands (gcode, pause, macros, ...) need
``allow_commands=True``.
"""

from __future__ import annotations

import asyncio
import itertools
import logging
from collections.abc import Awaitable, Callable
from typing import Any

import aiohttp

_LOGGER = logging.getLogger(__name__)

CLIENT_NAME = "ha-moonraker"
CLIENT_VERSION = "0.0.1"
CONNECT_TIMEOUT = 10.0

READ_ONLY_METHODS: frozenset[str] = frozenset(
    {
        "server.connection.identify",
        "server.info",
        "server.config",
        "server.files.list",
        "server.files.roots",
        "server.files.metadata",
        "server.files.get_directory",
        "server.history.list",
        "server.history.totals",
        "server.history.get_job",
        "server.temperature_store",
        "server.gcode_store",
        "server.webcams.list",
        "server.job_queue.status",
        "server.announcements.list",
        "machine.system_info",
        "machine.proc_stats",
        "printer.info",
        "printer.objects.list",
        "printer.objects.query",
        # Subscribing only changes which updates this connection receives.
        "printer.objects.subscribe",
    }
)

NotificationHandler = Callable[[str, list[Any]], None]
ConnectHandler = Callable[[], Awaitable[None]]
DisconnectHandler = Callable[[Exception | None], None]


class MoonrakerError(Exception):
    """Base error."""


class CommandNotAllowedError(MoonrakerError):
    """Raised when a non read-only method is called without allow_commands."""


class MoonrakerRpcError(MoonrakerError):
    """JSON-RPC error returned by Moonraker."""

    def __init__(self, method: str, error: dict[str, Any]) -> None:
        self.method = method
        self.code = error.get("code")
        self.error_message = error.get("message", "")
        super().__init__(f"{method}: {self.code} {self.error_message}")


class NotConnectedError(MoonrakerError):
    """Raised when calling while the socket is down."""


class MoonrakerClient:
    """One WebSocket connection to one Moonraker instance."""

    def __init__(
        self,
        host: str,
        port: int = 7125,
        *,
        session: aiohttp.ClientSession,
        api_key: str | None = None,
        allow_commands: bool = False,
        on_notification: NotificationHandler | None = None,
        on_connect: ConnectHandler | None = None,
        on_disconnect: DisconnectHandler | None = None,
        request_timeout: float = 15.0,
    ) -> None:
        self.host = host
        self.port = port
        self._session = session
        self._api_key = api_key
        self.allow_commands = allow_commands
        self._on_notification = on_notification
        self._on_connect = on_connect
        self._on_disconnect = on_disconnect
        self._timeout = request_timeout
        self._ws: aiohttp.ClientWebSocketResponse | None = None
        self._ids = itertools.count(1)
        self._pending: dict[int, asyncio.Future[Any]] = {}
        self._closing = False
        self._reader: asyncio.Task[None] | None = None
        self.connection_id: int | None = None
        # Consecutive attempts that failed before a connection was established.
        self.failed_attempts = 0
        self.last_error: Exception | None = None

    # ------------------------------------------------------------------ urls
    @property
    def base_url(self) -> str:
        return f"http://{self.host}:{self.port}"

    @property
    def ws_url(self) -> str:
        return f"ws://{self.host}:{self.port}/websocket"

    @property
    def connected(self) -> bool:
        return self._ws is not None and not self._ws.closed

    def _headers(self) -> dict[str, str]:
        return {"X-Api-Key": self._api_key} if self._api_key else {}

    # ------------------------------------------------------------ lifecycle
    async def run_forever(self) -> None:
        """Connect, serve, and reconnect with exponential backoff until close()."""
        backoff = 1.0
        while not self._closing:
            err: Exception | None = None
            established = False
            try:
                await self._connect()
                established = True
                self.failed_attempts = 0
                self.last_error = None
                backoff = 1.0
                await self._reader
            except asyncio.CancelledError:
                raise
            except Exception as exc:  # noqa: BLE001 - reconnect on anything
                err = exc
                if not established:
                    self.failed_attempts += 1
                    self.last_error = exc
                _LOGGER.debug("%s: connection error: %r", self.host, exc)
            finally:
                await self._teardown(err)
            if self._closing:
                break
            await asyncio.sleep(backoff)
            backoff = min(backoff * 2, 60.0)

    async def close(self) -> None:
        self._closing = True
        if self._ws is not None and not self._ws.closed:
            await self._ws.close()

    async def _connect(self) -> None:
        # Bound the TCP/WebSocket handshake: a powered-off host often drops packets,
        # which would otherwise hang for the OS connect timeout (~2 min).
        async with asyncio.timeout(CONNECT_TIMEOUT):
            self._ws = await self._session.ws_connect(
                self.ws_url,
                headers=self._headers(),
                heartbeat=30,
                max_msg_size=0,
                timeout=aiohttp.ClientWSTimeout(ws_close=10),
            )
        self._reader = asyncio.create_task(self._read_loop())
        try:
            try:
                result = await self.call(
                    "server.connection.identify",
                    {
                        "client_name": CLIENT_NAME,
                        "version": CLIENT_VERSION,
                        "type": "other",
                        "url": "https://github.com/marcelolcosta/moonraker-plus",
                    },
                )
                self.connection_id = result.get("connection_id")
            except MoonrakerRpcError as exc:
                # Very old forks may not support identify; not fatal.
                _LOGGER.debug("%s: identify failed: %s", self.host, exc)
            if self._on_connect is not None:
                await self._on_connect()
        except BaseException:
            self._reader.cancel()
            raise

    async def _teardown(self, err: Exception | None) -> None:
        if self._reader is not None and not self._reader.done():
            self._reader.cancel()
        self._reader = None
        for fut in self._pending.values():
            if not fut.done():
                fut.set_exception(NotConnectedError("connection lost"))
        self._pending.clear()
        if self._ws is not None and not self._ws.closed:
            await self._ws.close()
        was_connected = self._ws is not None
        self._ws = None
        self.connection_id = None
        if was_connected and self._on_disconnect is not None:
            self._on_disconnect(err)

    async def _read_loop(self) -> None:
        assert self._ws is not None
        async for msg in self._ws:
            if msg.type == aiohttp.WSMsgType.TEXT:
                self._handle_message(msg.json())
            elif msg.type in (aiohttp.WSMsgType.CLOSED, aiohttp.WSMsgType.ERROR):
                break

    def _handle_message(self, data: dict[str, Any]) -> None:
        if "id" in data:
            fut = self._pending.pop(data["id"], None)
            if fut is None or fut.done():
                return
            if "error" in data:
                fut.set_exception(MoonrakerRpcError(fut.method, data["error"]))  # type: ignore[attr-defined]
            else:
                fut.set_result(data.get("result"))
            return
        method = data.get("method")
        if method and self._on_notification is not None:
            try:
                self._on_notification(method, data.get("params") or [])
            except Exception:  # noqa: BLE001 - never kill the socket on handler bugs
                _LOGGER.exception("%s: notification handler failed for %s", self.host, method)

    # ------------------------------------------------------------------ rpc
    async def call(self, method: str, params: dict[str, Any] | None = None) -> Any:
        if method not in READ_ONLY_METHODS and not self.allow_commands:
            raise CommandNotAllowedError(
                f"{method} is not read-only; create the client with allow_commands=True"
            )
        if not self.connected:
            raise NotConnectedError(method)
        req_id = next(self._ids)
        fut: asyncio.Future[Any] = asyncio.get_running_loop().create_future()
        fut.method = method  # type: ignore[attr-defined]
        self._pending[req_id] = fut
        payload: dict[str, Any] = {"jsonrpc": "2.0", "method": method, "id": req_id}
        if params:
            payload["params"] = params
        assert self._ws is not None
        await self._ws.send_json(payload)
        try:
            return await asyncio.wait_for(fut, self._timeout)
        finally:
            self._pending.pop(req_id, None)

    # ------------------------------------------------------------------ http
    async def http_get_json(self, path: str) -> Any:
        async with self._session.get(
            f"{self.base_url}{path}",
            headers=self._headers(),
            timeout=aiohttp.ClientTimeout(total=self._timeout),
        ) as resp:
            resp.raise_for_status()
            data = await resp.json(content_type=None)
            return data.get("result", data)

    def file_url(self, root: str, path: str) -> str:
        return f"{self.base_url}/server/files/{root}/{path}"
