"""Multi-material system adapters."""

from __future__ import annotations

from typing import Any

from .base import MaterialAdapter, MaterialSystem, Slot, Unit, normalize_color
from .creality_cfs import CrealityCfsAdapter
from .happy_hare import HappyHareAdapter
from .snapmaker_u1 import SnapmakerU1Adapter

ADAPTERS: tuple[type[MaterialAdapter], ...] = (HappyHareAdapter, CrealityCfsAdapter, SnapmakerU1Adapter)


def detect_adapters(objects: list[str]) -> list[type[MaterialAdapter]]:
    return [a for a in ADAPTERS if a.detect(objects)]


def parse_all(adapters: list[type[MaterialAdapter]], status: dict[str, Any]) -> list[MaterialSystem]:
    return [a.parse(status) for a in adapters]


__all__ = [
    "ADAPTERS",
    "MaterialAdapter",
    "MaterialSystem",
    "Slot",
    "Unit",
    "detect_adapters",
    "normalize_color",
    "parse_all",
]
