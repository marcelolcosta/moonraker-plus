"""Shared model for multi-material systems (MMU, CFS, toolchangers)."""

from __future__ import annotations

import re
from dataclasses import asdict, dataclass, field
from typing import Any, ClassVar

_HEX = re.compile(r"^[0-9a-fA-F]+$")

# Values vendors use to mean "nothing here".
EMPTY_VALUES = frozenset({"", "-1", "none", "unknown", "null", "n/a"})


def clean_str(value: Any) -> str | None:
    if value is None:
        return None
    s = str(value).strip()
    return None if s.lower() in EMPTY_VALUES else s


def clean_num(value: Any) -> float | None:
    """Parse numbers that may arrive as strings; -1 / 'None' mean unknown."""
    if isinstance(value, bool) or value is None:
        return None
    try:
        n = float(value)
    except (TypeError, ValueError):
        return None
    return None if n == -1 else n


def normalize_color(value: Any) -> str | None:
    """Return '#rrggbb' from RRGGBB, RRGGBBAA, CFS-style 0RRGGBB, or an int (0xAARRGGBB/0xRRGGBB)."""
    if isinstance(value, int) and not isinstance(value, bool):
        if value < 0:
            return None
        return f"#{value & 0xFFFFFF:06x}"
    s = clean_str(value)
    if s is None:
        return None
    s = s.lstrip("#")
    if not _HEX.match(s):
        return None
    if len(s) == 7:  # Creality CFS: leading 0 + RRGGBB
        s = s[1:]
    elif len(s) == 8:  # RRGGBBAA
        s = s[:6]
    if len(s) != 6:
        return None
    return f"#{s.lower()}"


@dataclass
class Slot:
    id: str  # stable id, e.g. "T1A", "gate_3", "head_2"
    label: str  # human label, e.g. "CFS 1 Slot A"
    present: bool | None = None  # filament loaded/detected; None = unknown
    active: bool = False
    color: str | None = None  # "#rrggbb"
    material: str | None = None  # "PLA"
    vendor: str | None = None
    name: str | None = None  # filament name
    remaining: float | None = None  # vendor-specific units, see extra["remaining_unit"]
    temperature: float | None = None  # recommended print temperature
    spool_id: int | None = None
    extra: dict[str, Any] = field(default_factory=dict)


@dataclass
class Unit:
    id: str
    name: str
    connected: bool | None = None
    temperature: float | None = None
    humidity: float | None = None
    slots: list[Slot] = field(default_factory=list)
    extra: dict[str, Any] = field(default_factory=dict)


@dataclass
class MaterialSystem:
    kind: str  # happy_hare | creality_cfs | snapmaker_u1
    name: str
    units: list[Unit] = field(default_factory=list)
    active_slot: str | None = None  # Slot.id
    action: str | None = None
    error: str | None = None
    extra: dict[str, Any] = field(default_factory=dict)

    @property
    def slots(self) -> list[Slot]:
        return [s for u in self.units for s in u.slots]

    def as_dict(self) -> dict[str, Any]:
        return asdict(self)


class MaterialAdapter:
    """Detects and parses one vendor's multi-material system."""

    kind: ClassVar[str]

    @staticmethod
    def detect(objects: list[str]) -> bool:
        raise NotImplementedError

    @staticmethod
    def objects(objects: list[str]) -> list[str]:
        """Objects this adapter needs subscribed (beyond the generic set)."""
        return []

    @staticmethod
    def parse(status: dict[str, Any]) -> MaterialSystem:
        raise NotImplementedError
