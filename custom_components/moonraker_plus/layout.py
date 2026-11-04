"""Printer layout for the frontend card: which entities exist and how they group.

The card asks for this once (WebSocket `moonraker_plus/printers`) and then reads
live values from hass.states, so it keeps working if entities are renamed.
Entity ids are resolved from unique ids through the entity registry; the keys
here must match the keys the platforms use.
"""

from __future__ import annotations

import re
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

from .const import CONF_MACROS, DOMAIN
from .coordinator import MoonrakerConfigEntry
from .entity import slug

CHAMBER_RE = re.compile(r"chamber|cavity|enclosure", re.IGNORECASE)
# Electronics temperatures: shown separately from print temperatures.
SYSTEM_RE = re.compile(r"mcu|raspberry|rpi|host|cpu|board|ebb|driver|stepper|pi_temp|soc", re.IGNORECASE)


def build_layout(hass: HomeAssistant, entry: MoonrakerConfigEntry) -> dict[str, Any]:
    c = entry.runtime_data
    ent_reg = er.async_get(hass)
    base = entry.unique_id or entry.entry_id

    def eid(platform: str, key: str) -> str | None:
        entity_id = ent_reg.async_get_entity_id(platform, DOMAIN, f"{base}_{slug(key)}")
        if entity_id is None:
            return None
        reg = ent_reg.async_get(entity_id)
        return None if reg is not None and reg.disabled_by is not None else entity_id

    device = dr.async_get(hass).async_get_device(identifiers={(DOMAIN, base)})

    heaters: list[dict[str, Any]] = []
    temperatures: list[dict[str, Any]] = []
    fans: list[dict[str, Any]] = []
    filament_sensors: list[dict[str, Any]] = []
    lights: list[dict[str, Any]] = []
    for info in c.state.object_info:
        n, label = info.name, info.label
        if info.kind == "heater":
            role = "extruder" if info.prefix == "extruder" else "bed" if n == "heater_bed" else (
                "chamber" if CHAMBER_RE.search(n) else "other"
            )
            heaters.append(
                {
                    "object": n,
                    "label": label,
                    "role": role,
                    "temperature": eid("sensor", f"{n}_temperature"),
                    "target": eid("sensor", f"{n}_target"),
                    "power": eid("sensor", f"{n}_power"),
                }
            )
        elif info.kind in ("temperature", "temperature_fan"):
            temperatures.append(
                {
                    "object": n,
                    "label": label,
                    "chamber": bool(CHAMBER_RE.search(n)),
                    "system": bool(SYSTEM_RE.search(n)) and not CHAMBER_RE.search(n),
                    "temperature": eid("sensor", f"{n}_temperature"),
                    "target": eid("sensor", f"{n}_target") if info.kind == "temperature_fan" else None,
                }
            )
            if info.kind == "temperature_fan":
                fans.append({"object": n, "label": label, "speed": eid("sensor", f"{n}_speed")})
        elif info.kind == "fan":
            fans.append({"object": n, "label": label, "speed": eid("sensor", f"{n}_speed"), "part": n == "fan"})
        elif info.kind == "filament_sensor":
            filament_sensors.append({"object": n, "label": label, "entity": eid("binary_sensor", f"{n}_detected")})
        if (light := eid("light", f"{n}_light")) is not None:
            lights.append({"object": n, "label": label, "entity": light})

    materials = [
        {
            "kind": ms.kind,
            "name": ms.name,
            "active": eid("sensor", f"{ms.kind}_active_slot"),
            "status": eid("sensor", f"{ms.kind}_status"),
            "units": [
                {
                    "id": u.id,
                    "name": u.name,
                    "connected": u.connected,
                    "temperature": eid("sensor", f"{ms.kind}_{u.id}_temperature"),
                    "humidity": eid("sensor", f"{ms.kind}_{u.id}_humidity"),
                    "slots": [
                        {"id": s.id, "label": s.label, "entity": eid("sensor", f"slot_{ms.kind}_{s.id}")}
                        for s in u.slots
                    ],
                }
                for u in ms.units
            ],
        }
        for ms in c.materials
    ]

    cameras = []
    if c.native_stream_source and (native := eid("camera", "webcam_native")):
        cameras.append(
            {"entity": native, "name": "Camera", "rotation": 0, "flip_horizontal": False,
             "flip_vertical": False, "aspect_ratio": None}
        )
    for cam in [] if c.native_stream_source else c.state.webcams:
        if cam.get("enabled") is False:
            continue
        e = eid("camera", f"webcam_{slug(cam.get('uid') or cam.get('name') or 'Webcam')}")
        if e:
            cameras.append(
                {
                    "entity": e,
                    "name": cam.get("name"),
                    "rotation": cam.get("rotation") or 0,
                    "flip_horizontal": bool(cam.get("flip_horizontal")),
                    "flip_vertical": bool(cam.get("flip_vertical")),
                    "aspect_ratio": cam.get("aspect_ratio"),
                }
            )

    macros = [
        {"name": m, "entity": e}
        for m in entry.options.get(CONF_MACROS, [])
        if (e := eid("button", f"macro_{m}")) is not None
    ]

    job_keys = (
        "print_state", "print_progress", "print_filename", "print_duration", "print_time_left",
        "print_eta", "current_layer", "total_layers", "filament_used", "klippy_state",
    )
    return {
        "entry_id": entry.entry_id,
        "device_id": device.id if device else None,
        "title": entry.title,
        "model": c.state.hostname,
        "web_url": c.web_url,
        "job": {k: eid("sensor", k) for k in job_keys} | {"printing": eid("binary_sensor", "printing")},
        "heaters": heaters,
        "temperatures": temperatures,
        "fans": fans,
        "filament_sensors": filament_sensors,
        "materials": materials,
        "lights": lights,
        "cameras": cameras,
        "thumbnail": eid("image", "thumbnail"),
        "buttons": {
            k: eid("button", f"button_{k}") for k in ("pause", "resume", "cancel", "emergency_stop", "firmware_restart")
        },
        "macros": macros,
    }
