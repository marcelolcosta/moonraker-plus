"""Creality CFS (K2 series) via the `box` object.

Encoding notes (observed on K2 Plus stock firmware, see docs/printer-survey.md):
- Units T1..T4, four slots each (A..D); per-slot values are parallel arrays.
- Numbers arrive as strings; "-1", "None", "unknown", "none" mean empty or unknown.
- Colors are "0RRGGBB" (7 chars).
- material_type is a Creality material code (e.g. "001001"). Names come from
  `box.same_material` entries [code, color, [slots], name] when available,
  falling back to KNOWN_MATERIAL_CODES.
- The currently feeding slot is not obvious in an idle snapshot; still to be
  confirmed by recording during a print.
"""

from __future__ import annotations

from typing import Any

from .base import MaterialAdapter, MaterialSystem, Slot, Unit, clean_num, clean_str, normalize_color

SLOT_LETTERS = "ABCD"

# Only codes confirmed from real data. Extend as more are observed.
KNOWN_MATERIAL_CODES: dict[str, str] = {}


def _at(seq: Any, i: int) -> Any:
    return seq[i] if isinstance(seq, list) and i < len(seq) else None


def material_names(box: dict[str, Any]) -> dict[str, str]:
    names = dict(KNOWN_MATERIAL_CODES)
    for entry in box.get("same_material") or []:
        if isinstance(entry, list) and len(entry) >= 4 and clean_str(entry[0]) and clean_str(entry[3]):
            names[str(entry[0])] = str(entry[3])
    return names


class CrealityCfsAdapter(MaterialAdapter):
    kind = "creality_cfs"

    @staticmethod
    def detect(objects: list[str]) -> bool:
        return "box" in objects

    @staticmethod
    def parse(status: dict[str, Any]) -> MaterialSystem:
        box = status.get("box") or {}
        names = material_names(box)
        units: list[Unit] = []
        for n in range(1, 5):
            key = f"T{n}"
            u = box.get(key)
            if not isinstance(u, dict):
                continue
            connected = clean_str(u.get("state")) == "connect"
            unit = Unit(
                id=key,
                name=f"CFS {n}",
                connected=connected,
                temperature=clean_num(u.get("temperature")),
                humidity=clean_num(u.get("dry_and_humidity")),
                extra={
                    "type": clean_str(u.get("type")),
                    "version": clean_str(u.get("version")),
                    "serial": clean_str(u.get("sn")),
                    "mode": clean_str(u.get("mode")),
                },
            )
            if connected:
                for i, letter in enumerate(SLOT_LETTERS):
                    code = clean_str(_at(u.get("material_type"), i))
                    raw_code = _at(u.get("material_type"), i)
                    # "-1" = no spool; "unknown" = spool present without RFID data.
                    present = None if raw_code is None else str(raw_code) != "-1"
                    remain = clean_num(_at(u.get("remain_len"), i))
                    unit.slots.append(
                        Slot(
                            id=f"{key}{letter}",
                            label=f"CFS {n} Slot {letter}",
                            present=present,
                            color=normalize_color(_at(u.get("color_value"), i)),
                            material=names.get(code, code) if code else None,
                            vendor=clean_str(_at(u.get("vender"), i)),
                            remaining=remain if remain else None,
                            extra={
                                "material_code": code,
                                "remaining_unit": "unknown",
                                "remapped_to": (box.get("map") or {}).get(f"{key}{letter}"),
                            },
                        )
                    )
            units.append(unit)

        # Optional external spool holder.
        rack = status.get("filament_rack")
        extra: dict[str, Any] = {
            "enabled": box.get("enable"),
            "auto_refill": box.get("auto_refill"),
            "state": clean_str(box.get("state")),
        }
        if isinstance(rack, dict):
            code = clean_str(rack.get("material_type"))
            extra["external_spool"] = {
                "color": normalize_color(rack.get("color_value")),
                "material": names.get(code, code) if code else None,
                "vendor": clean_str(rack.get("vender")),
            }
        return MaterialSystem(kind=CrealityCfsAdapter.kind, name="Creality CFS", units=units, extra=extra)
