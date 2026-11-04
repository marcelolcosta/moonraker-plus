"""Snapmaker U1 toolchanger (paxx / stock firmware).

Each tool head is one slot: `extruder`, `extruder1`.. hold the head state,
`print_task_config` holds the filament info per head, and `filament_feed
left/right` hold the feeder channel states.
"""

from __future__ import annotations

from typing import Any

from .base import MaterialAdapter, MaterialSystem, Slot, Unit, clean_str, normalize_color


def extruder_name(i: int) -> str:
    return "extruder" if i == 0 else f"extruder{i}"


def _at(seq: Any, i: int) -> Any:
    return seq[i] if isinstance(seq, list) and i < len(seq) else None


def _feed_channel(status: dict[str, Any], i: int) -> dict[str, Any] | None:
    for side in ("filament_feed left", "filament_feed right"):
        ch = (status.get(side) or {}).get(f"extruder{i}")
        if isinstance(ch, dict):
            return ch
    return None


class SnapmakerU1Adapter(MaterialAdapter):
    kind = "snapmaker_u1"

    @staticmethod
    def detect(objects: list[str]) -> bool:
        return "print_task_config" in objects and "extruder1" in objects

    @staticmethod
    def parse(status: dict[str, Any]) -> MaterialSystem:
        cfg = status.get("print_task_config") or {}
        active_ext = (status.get("toolhead") or {}).get("extruder")
        heads = 0
        while extruder_name(heads) in status:
            heads += 1

        unit = Unit(id="toolchanger", name="Toolchanger", connected=True)
        active_slot = None
        for i in range(heads):
            ext = status.get(extruder_name(i)) or {}
            ch = _feed_channel(status, i)
            if ch is not None and ch.get("module_exist") is not False:
                present = bool(ch.get("filament_detected"))
            else:
                exist = _at(cfg.get("filament_exist"), i)
                present = bool(exist) if exist is not None else None
            vendor = clean_str(_at(cfg.get("filament_vendor"), i))
            material = clean_str(_at(cfg.get("filament_type"), i))
            sub = clean_str(_at(cfg.get("filament_sub_type"), i))
            active = active_ext == extruder_name(i)
            if active:
                active_slot = f"head_{i}"
            unit.slots.append(
                Slot(
                    id=f"head_{i}",
                    label=f"Head {i + 1}",
                    present=present,
                    active=active,
                    color=normalize_color(_at(cfg.get("filament_color_rgba"), i)) if material else None,
                    material=material,
                    vendor=vendor,
                    name=" ".join(p for p in (vendor, material, sub) if p) or None,
                    extra={
                        "sub_type": sub,
                        "head_state": ext.get("state"),
                        "nozzle_temperature": ext.get("temperature"),
                        "nozzle_target": ext.get("target"),
                        "nozzle_diameter": ext.get("nozzle_diameter"),
                        "switch_count": ext.get("switch_count"),
                        "error_count": ext.get("error_count"),
                        "channel_state": (ch or {}).get("channel_state"),
                        "channel_error": (ch or {}).get("channel_error"),
                        "official": _at(cfg.get("filament_official"), i),
                    },
                )
            )

        exceptions = (status.get("exception_manager") or {}).get("exceptions") or []
        return MaterialSystem(
            kind=SnapmakerU1Adapter.kind,
            name="Snapmaker U1",
            units=[unit],
            active_slot=active_slot,
            error="; ".join(map(str, exceptions)) or None,
            extra={
                "auto_replenish_filament": cfg.get("auto_replenish_filament"),
                "extruder_map_table": (cfg.get("extruder_map_table") or [])[:heads] or None,
                "extruders_used": cfg.get("extruders_used"),
            },
        )
