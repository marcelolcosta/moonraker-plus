"""Plain-text rendering of a PrinterState for the CLI."""

from __future__ import annotations

from dataclasses import asdict
from typing import Any

from .discovery import reading
from .job import JobInfo
from .materials import MaterialSystem
from .printer import PrinterState


def fmt_duration(seconds: float | None) -> str:
    if seconds is None:
        return "-"
    s = int(seconds)
    h, rem = divmod(s, 3600)
    m, s = divmod(rem, 60)
    return f"{h}h{m:02d}m" if h else f"{m}m{s:02d}s"


def _t(v: Any) -> str:
    return f"{v:.1f}" if isinstance(v, (int, float)) else "-"


def _pct(v: Any) -> str:
    return f"{v * 100:.0f}%" if isinstance(v, (int, float)) else "-"


def render_job(job: JobInfo) -> str:
    if not job.filename:
        return f"Job: {job.state or '-'}"
    lines = [f"Job: {job.state}  {job.filename}"]
    layer = f"{job.current_layer or '-'}/{job.total_layer or '-'}"
    lines.append(
        f"     progress {_pct(job.progress)}  layer {layer}  printed {fmt_duration(job.print_duration)}"
        f"  left {fmt_duration(job.remaining)}"
        f" (file {fmt_duration(job.remaining_file)}, slicer {fmt_duration(job.remaining_slicer)},"
        f" filament {fmt_duration(job.remaining_filament)})"
    )
    if job.thumbnail_path:
        lines.append(f"     thumbnail {job.thumbnail_path}")
    if job.message:
        lines.append(f"     message: {job.message}")
    return "\n".join(lines)


def render_material(ms: MaterialSystem) -> str:
    head = f"{ms.name}: active={ms.active_slot or '-'}  action={ms.action or '-'}"
    if ms.error:
        head += f"  ERROR={ms.error}"
    lines = [head]
    for u in ms.units:
        env = []
        if u.temperature is not None:
            env.append(f"{u.temperature:.0f}°C")
        if u.humidity is not None:
            env.append(f"{u.humidity:.0f}%RH")
        state = "" if u.connected else " (not connected)"
        lines.append(f"  {u.name}{state}{' [' + ' '.join(env) + ']' if env else ''}")
        for s in u.slots:
            if s.present is False:
                desc = "empty"
            else:
                bits = [s.material or ("loaded, no data" if s.present else "unknown"), s.color]
                if s.name and s.name != s.material:
                    bits.append(s.name)
                desc = " ".join(b for b in bits if b)
            marker = "*" if s.active else " "
            lines.append(f"   {marker} {s.label:<16} {desc}")
    return "\n".join(lines)


def render_state(name: str, host: str, st: PrinterState) -> str:
    conn = "connected" if st.connected else "DISCONNECTED"
    lines = [f"== {name} ({st.hostname or '?'}) {host}  [{conn}, klippy {st.klippy_state or '-'}]"]
    if not st.status:
        return "\n".join(lines)
    lines.append(render_job(st.job))

    groups: dict[str, list[str]] = {}
    for info in st.object_info:
        r = reading(info, st.status)
        if info.kind == "heater":
            txt = f"{info.label} {_t(r['temperature'])}/{_t(r['target'])}"
        elif info.kind == "temperature":
            txt = f"{info.label} {_t(r['temperature'])}"
        elif info.kind == "temperature_fan":
            txt = f"{info.label} {_t(r['temperature'])}/{_t(r['target'])} fan {_pct(r['speed'])}"
        elif info.kind == "fan":
            txt = f"{info.label} {_pct(r['speed'])}"
        elif info.kind == "filament_sensor":
            det = r["filament_detected"]
            txt = f"{info.label} {'yes' if det else 'no' if det is not None else '-'}"
        elif info.kind == "output_pin":
            txt = f"{info.label} {r['value']}"
        else:
            continue
        groups.setdefault(info.kind, []).append(txt)
    titles = {
        "heater": "Heaters",
        "temperature": "Temps",
        "temperature_fan": "Temp fans",
        "fan": "Fans",
        "filament_sensor": "Filament",
        "output_pin": "Pins",
    }
    for kind, title in titles.items():
        if kind in groups:
            lines.append(f"{title + ':':<10} " + "  ".join(groups[kind]))
    if st.webcams:
        lines.append("Webcams:   " + "  ".join(f"{w.get('name')} ({w.get('service')})" for w in st.webcams))
    for ms in st.materials:
        lines.append(render_material(ms))
    return "\n".join(lines)


def state_to_dict(st: PrinterState) -> dict[str, Any]:
    """Derived model as JSON-able dict (for snapshots)."""
    return {
        "connected": st.connected,
        "klippy_state": st.klippy_state,
        "hostname": st.hostname,
        "software_version": st.printer_info.get("software_version"),
        "moonraker_version": st.server_info.get("moonraker_version"),
        "api_version": st.server_info.get("api_version_string"),
        "job": {**asdict(st.job), "remaining": st.job.remaining},
        "objects": [
            {**asdict(i), "controllable": i.controllable, "reading": reading(i, st.status)} for i in st.object_info
        ],
        "materials": [m.as_dict() for m in st.materials],
        "webcams": st.webcams,
    }
