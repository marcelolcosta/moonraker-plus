"""Serve the dashboard card and expose the layout WebSocket API."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .layout import build_layout

FRONTEND_URL = f"/{DOMAIN}/frontend"
FRONTEND_DIR = Path(__file__).parent / "frontend"
# Small loader; it imports moonraker-plus-card-main.js from the same folder once HA's app is up.
CARD_URL = f"{FRONTEND_URL}/moonraker-plus-card.js"
CARD_PATH = FRONTEND_DIR / "moonraker-plus-card.js"
WS_PRINTERS = f"{DOMAIN}/printers"


def _version() -> str:
    manifest = json.loads((Path(__file__).parent / "manifest.json").read_text())
    mtime = max((int(f.stat().st_mtime) for f in FRONTEND_DIR.glob("*.js")), default=0)
    return f"{manifest.get('version', '0')}-{mtime}"


async def async_setup_frontend(hass: HomeAssistant) -> None:
    if CARD_PATH.exists():
        await hass.http.async_register_static_paths([StaticPathConfig(FRONTEND_URL, str(FRONTEND_DIR), False)])
        version = await hass.async_add_executor_job(_version)
        add_extra_js_url(hass, f"{CARD_URL}?v={version}")
    websocket_api.async_register_command(hass, ws_printers)


@websocket_api.websocket_command({vol.Required("type"): WS_PRINTERS, vol.Optional("device_id"): str})
@callback
def ws_printers(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    printers = [
        build_layout(hass, entry)
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.state is ConfigEntryState.LOADED
    ]
    if device_id := msg.get("device_id"):
        printers = [p for p in printers if p["device_id"] == device_id]
    printers.sort(key=lambda p: p["title"].lower())
    connection.send_result(msg["id"], {"printers": printers})
