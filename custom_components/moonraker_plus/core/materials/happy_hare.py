"""Happy Hare MMU (ERCF, Tradrack, ...) via the `mmu` / `mmu_machine` objects."""

from __future__ import annotations

from typing import Any

from .base import MaterialAdapter, MaterialSystem, Slot, Unit, clean_num, clean_str, normalize_color

# Happy Hare gate_status values
GATE_UNKNOWN = -1
GATE_EMPTY = 0
GATE_AVAILABLE = 1
GATE_AVAILABLE_FROM_BUFFER = 2

GATE_BYPASS = -2


def _at(seq: Any, i: int) -> Any:
    return seq[i] if isinstance(seq, list) and i < len(seq) else None


class HappyHareAdapter(MaterialAdapter):
    kind = "happy_hare"

    @staticmethod
    def detect(objects: list[str]) -> bool:
        return "mmu" in objects

    @staticmethod
    def parse(status: dict[str, Any]) -> MaterialSystem:
        mmu = status.get("mmu") or {}
        machine = status.get("mmu_machine") or {}
        num_gates = int(mmu.get("num_gates") or len(mmu.get("gate_status") or []))
        gate = mmu.get("gate")
        ttg = mmu.get("ttg_map") or []

        # Units: from mmu_machine.unit_N when present, else one unit with all gates.
        unit_defs = []
        for n in range(int(machine.get("num_units") or 0)):
            u = machine.get(f"unit_{n}") or {}
            unit_defs.append(
                (n, u.get("name") or f"MMU {n}", int(u.get("first_gate") or 0), int(u.get("num_gates") or 0), u)
            )
        if not unit_defs:
            unit_defs = [(0, "MMU", 0, num_gates, {})]

        units: list[Unit] = []
        for n, uname, first, count, udef in unit_defs:
            unit = Unit(
                id=f"unit_{n}",
                name=uname,
                connected=True,
                extra={k: udef.get(k) for k in ("vendor", "version", "selector_type", "has_bypass") if k in udef},
            )
            for g in range(first, first + count):
                status_code = _at(mmu.get("gate_status"), g)
                present = None if status_code in (None, GATE_UNKNOWN) else status_code > GATE_EMPTY
                spool = _at(mmu.get("gate_spool_id"), g)
                unit.slots.append(
                    Slot(
                        id=f"gate_{g}",
                        label=f"Gate {g}",
                        present=present,
                        active=gate == g,
                        color=normalize_color(_at(mmu.get("gate_color"), g)),
                        material=clean_str(_at(mmu.get("gate_material"), g)),
                        name=clean_str(_at(mmu.get("gate_filament_name"), g)),
                        temperature=clean_num(_at(mmu.get("gate_temperature"), g)),
                        spool_id=int(spool) if isinstance(spool, int) and spool >= 0 else None,
                        extra={
                            "gate_status": status_code,
                            "tools": [t for t, mapped in enumerate(ttg) if mapped == g],
                            "speed_override": _at(mmu.get("gate_speed_override"), g),
                        },
                    )
                )
            units.append(unit)

        if gate == GATE_BYPASS:
            active = "bypass"
        elif isinstance(gate, int) and gate >= 0:
            active = f"gate_{gate}"
        else:
            active = None

        error = clean_str(mmu.get("reason_for_pause")) if mmu.get("is_paused") else None
        return MaterialSystem(
            kind=HappyHareAdapter.kind,
            name="Happy Hare",
            units=units,
            active_slot=active,
            action=clean_str(mmu.get("action")),
            error=error,
            extra={
                "enabled": mmu.get("enabled"),
                "tool": mmu.get("tool"),
                "next_tool": mmu.get("next_tool"),
                "operation": clean_str(mmu.get("operation")),
                "print_state": mmu.get("print_state"),
                "filament_pos": mmu.get("filament_pos"),
                "is_homed": mmu.get("is_homed"),
                "runout": mmu.get("runout"),
                "num_toolchanges": mmu.get("num_toolchanges"),
                "total_toolchanges": (mmu.get("slicer_tool_map") or {}).get("total_toolchanges"),
                "endless_spool_enabled": mmu.get("endless_spool_enabled"),
                "ttg_map": ttg,
                "sensors": mmu.get("sensors"),
                "servo": mmu.get("servo"),
                "spoolman_support": mmu.get("spoolman_support"),
            },
        )
