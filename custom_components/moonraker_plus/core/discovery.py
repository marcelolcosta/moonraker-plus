"""Classify Klipper objects into generic categories.

The HA integration maps each ObjectInfo to entities; the CLI uses it to render
readings. Vendor-specific objects (CFS, Happy Hare, U1) are handled by
``moonraker_core.materials`` instead.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any

# Object prefix (before the first space, or the whole name) -> kind
_KINDS: dict[str, str] = {
    "extruder": "heater",
    "heater_bed": "heater",
    "heater_generic": "heater",
    "temperature_sensor": "temperature",
    "temperature_host": "temperature",
    "temperature_fan": "temperature_fan",
    "fan": "fan",
    "fan_generic": "fan",
    "heater_fan": "fan",
    "controller_fan": "fan",
    "output_pin": "output_pin",
    "led": "light",
    "neopixel": "light",
    "dotstar": "light",
    "pca9533": "light",
    "pca9632": "light",
    "filament_switch_sensor": "filament_sensor",
    "filament_motion_sensor": "filament_sensor",
}

# Fans whose speed can be set from a client (others are firmware-driven).
CONTROLLABLE_FAN_PREFIXES = ("fan", "fan_generic")

_EXTRUDER_RE = re.compile(r"^extruder(\d*)$")


@dataclass(frozen=True)
class ObjectInfo:
    name: str  # full Klipper object name, e.g. "temperature_sensor chamber_temp"
    kind: str  # heater | temperature | temperature_fan | fan | output_pin | light | filament_sensor
    prefix: str  # e.g. "temperature_sensor"
    label: str  # human label, e.g. "Chamber Temp"

    @property
    def controllable(self) -> bool:
        if self.kind == "fan":
            return self.prefix in CONTROLLABLE_FAN_PREFIXES
        return self.kind in ("heater", "output_pin", "light")


def humanize(raw: str) -> str:
    return " ".join(w.capitalize() if w.islower() else w for w in re.split(r"[_\s]+", raw) if w)


def _label(prefix: str, name: str) -> str:
    if m := _EXTRUDER_RE.match(name):
        return f"Extruder {m.group(1)}" if m.group(1) else "Extruder"
    if name == "heater_bed":
        return "Bed"
    if name == "fan":
        return "Part Fan"
    suffix = name.split(" ", 1)[1] if " " in name else name
    return humanize(suffix)


def classify_object(name: str) -> ObjectInfo | None:
    prefix = name.split(" ", 1)[0]
    if _EXTRUDER_RE.match(name):
        prefix = "extruder"
    kind = _KINDS.get(prefix)
    if kind is None:
        return None
    # "fan"/"heater_bed"/"extruder" are bare; the rest need a name part.
    if prefix not in ("fan", "heater_bed", "extruder") and " " not in name:
        return None
    return ObjectInfo(name=name, kind=kind, prefix=prefix, label=_label(prefix, name))


def classify(objects: list[str]) -> list[ObjectInfo]:
    infos = [info for name in objects if (info := classify_object(name)) is not None]
    # Disambiguate identical labels (e.g. temperature_host/temperature_sensor raspberry_pi).
    counts: dict[str, int] = {}
    for i in infos:
        counts[i.label] = counts.get(i.label, 0) + 1
    return [
        ObjectInfo(i.name, i.kind, i.prefix, f"{i.label} ({humanize(i.prefix)})") if counts[i.label] > 1 else i
        for i in infos
    ]


def subscribable(objects: list[str]) -> list[str]:
    """Objects worth subscribing to: everything except macros and the (huge) configfile."""
    return [o for o in objects if not o.startswith("gcode_macro ") and o != "configfile"]


def reading(info: ObjectInfo, status: dict[str, Any]) -> dict[str, Any]:
    """Flatten an object's status into the values HA entities would expose."""
    s = status.get(info.name) or {}
    if info.kind == "heater":
        return {"temperature": s.get("temperature"), "target": s.get("target"), "power": s.get("power")}
    if info.kind == "temperature":
        return {"temperature": s.get("temperature")}
    if info.kind == "temperature_fan":
        return {"temperature": s.get("temperature"), "target": s.get("target"), "speed": s.get("speed")}
    if info.kind == "fan":
        return {"speed": s.get("speed"), "rpm": s.get("rpm")}
    if info.kind == "output_pin":
        return {"value": s.get("value")}
    if info.kind == "light":
        return {"color_data": s.get("color_data")}
    if info.kind == "filament_sensor":
        return {"filament_detected": s.get("filament_detected"), "enabled": s.get("enabled")}
    return {}
