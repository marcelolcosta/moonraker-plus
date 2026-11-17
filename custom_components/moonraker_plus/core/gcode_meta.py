"""Fallback G-code metadata for files Moonraker's parser doesn't recognize.

Older Moonraker builds (e.g. Creality stock firmware) report `slicer: Unknown` for
Creality Print 7.x files and leave out the time and filament estimates. Those slicers
(Orca/Prusa family) write a summary block near the end of the file, so the last few
hundred kilobytes are enough. The filename (`..._10h2m39s.gcode`) is a last resort.
"""

from __future__ import annotations

import re
from typing import Any

TAIL_BYTES = 512 * 1024

_DURATION = re.compile(r"(?:(\d+)\s*d)?\s*(?:(\d+)\s*h)?\s*(?:(\d+)\s*m(?!m))?\s*(?:(\d+)\s*s)?", re.IGNORECASE)
_PATTERNS = {
    "estimated_time": re.compile(r"^;\s*(?:estimated printing time(?: \(normal mode\))?|total estimated time)\s*[=:]\s*(.+)$", re.IGNORECASE | re.MULTILINE),
    "filament_total": re.compile(r"^;\s*filament used \[mm\]\s*=\s*(.+)$", re.IGNORECASE | re.MULTILINE),
    "layer_count": re.compile(r"^;\s*total layers? (?:count|number)\s*[=:]\s*(\d+)", re.IGNORECASE | re.MULTILINE),
    "layer_height": re.compile(r"^;\s*layer_height\s*=\s*([\d.]+)\s*$", re.MULTILINE),
    "first_layer_height": re.compile(r"^;\s*(?:initial_layer_print_height|first_layer_height)\s*=\s*([\d.]+)\s*$", re.MULTILINE),
    "filament_weight_total": re.compile(r"^;\s*total filament used \[g\]\s*=\s*([\d.]+)", re.IGNORECASE | re.MULTILINE),
}
_TIME_SECONDS = re.compile(r"^;\s*TIME\s*:\s*(\d+)\s*$", re.MULTILINE)
_FILENAME_TIME = re.compile(r"(?<![a-z0-9])((?:\d+d)?(?:\d+h)?(?:\d+m)?(?:\d+s)?)(?=[._\- ]|$)", re.IGNORECASE)


def parse_duration(text: str) -> float | None:
    """'10h 2m 39s' / '1d 2h 3m' / '45m 10s' -> seconds."""
    m = _DURATION.fullmatch(text.strip())
    if not m or not any(m.groups()):
        return None
    d, h, mi, s = (int(g) if g else 0 for g in m.groups())
    return float(((d * 24 + h) * 60 + mi) * 60 + s)


def parse_gcode_text(text: str) -> dict[str, Any]:
    out: dict[str, Any] = {}
    if (m := _PATTERNS["estimated_time"].search(text)) and (t := parse_duration(m.group(1))):
        out["estimated_time"] = t
    elif m := _TIME_SECONDS.search(text):
        out["estimated_time"] = float(m.group(1))
    if m := _PATTERNS["filament_total"].search(text):
        values = [float(v) for v in re.findall(r"[\d.]+", m.group(1))]
        if sum(values) > 0:
            out["filament_total"] = sum(values)
    if m := _PATTERNS["layer_count"].search(text):
        out["layer_count"] = int(m.group(1))
    for key in ("layer_height", "first_layer_height"):
        if (m := _PATTERNS[key].search(text)) and float(m.group(1)) > 0:
            out[key] = float(m.group(1))
    if m := _PATTERNS["filament_weight_total"].search(text):
        out["filament_weight_total"] = float(m.group(1))
    return out


def time_from_filename(filename: str) -> float | None:
    """'part_PETG_10h2m39s.gcode' -> 36159. Requires an hour or minute unit to avoid false hits."""
    stem = filename.rsplit("/", 1)[-1]
    for token in reversed(_FILENAME_TIME.findall(stem)):
        if re.search(r"\d+[hm]", token, re.IGNORECASE) and (t := parse_duration(token)):
            return t
    return None
