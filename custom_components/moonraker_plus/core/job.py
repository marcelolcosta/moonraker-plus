"""Print job derivation: progress, time remaining, layers, thumbnail.

None of the surveyed printers populate print_stats.info layers, so this falls
back to gcode file metadata (server.files.metadata) the same way Mainsail and
Fluidd do.
"""

from __future__ import annotations

import math
import posixpath
from dataclasses import dataclass, field
from typing import Any

ACTIVE_STATES = ("printing", "paused")


@dataclass
class JobInfo:
    state: str | None = None  # standby | printing | paused | complete | cancelled | error
    filename: str | None = None
    message: str | None = None
    progress: float | None = None  # 0..1
    print_duration: float | None = None  # seconds actually printing
    total_duration: float | None = None  # seconds since job start (incl. pauses)
    filament_used_mm: float | None = None
    remaining_file: float | None = None  # seconds, extrapolated from file progress
    remaining_slicer: float | None = None  # seconds, slicer estimate - elapsed
    remaining_filament: float | None = None  # seconds, extrapolated from filament usage
    remaining_auto: float | None = None  # seconds, weighted blend (KlipperScreen "auto")
    current_layer: int | None = None
    total_layer: int | None = None
    slicer_estimate: float | None = None
    thumbnail_path: str | None = None  # relative to the gcodes root
    extra: dict[str, Any] = field(default_factory=dict)

    @property
    def active(self) -> bool:
        return self.state in ACTIVE_STATES

    @property
    def remaining(self) -> float | None:
        """Best single remaining-time estimate in seconds."""
        if not self.active:
            return None
        if self.remaining_auto is not None:
            return self.remaining_auto
        for v in (self.remaining_slicer, self.remaining_file, self.remaining_filament):
            if v is not None:
                return v
        return None


def _num(v: Any) -> float | None:
    return float(v) if isinstance(v, (int, float)) and not isinstance(v, bool) else None


def file_progress(status: dict[str, Any], meta: dict[str, Any] | None) -> float | None:
    sd = status.get("virtual_sdcard") or {}
    pos = _num(sd.get("file_position"))
    if meta and pos is not None:
        start = _num(meta.get("gcode_start_byte"))
        end = _num(meta.get("gcode_end_byte"))
        if start is not None and end is not None and end > start:
            return min(max((pos - start) / (end - start), 0.0), 1.0)
    p = _num(sd.get("progress"))
    if p is None:
        p = _num((status.get("display_status") or {}).get("progress"))
    return p


def _layers(status: dict[str, Any], meta: dict[str, Any] | None, active: bool) -> tuple[int | None, int | None]:
    info = (status.get("print_stats") or {}).get("info") or {}
    cur, tot = info.get("current_layer"), info.get("total_layer")
    if not meta:
        return cur, tot
    lh = _num(meta.get("layer_height"))
    flh = _num(meta.get("first_layer_height")) or lh
    height = _num(meta.get("object_height"))
    if tot is None:
        tot = meta.get("layer_count")
        if tot is None and lh and flh and height:
            tot = math.ceil((height - flh) / lh + 1)
    if cur is None and active and lh and flh:
        pos = (status.get("gcode_move") or {}).get("gcode_position") or []
        z = _num(pos[2]) if len(pos) > 2 else None
        if z is not None:
            cur = max(math.ceil((z - flh) / lh + 1), 1)
            if tot:
                cur = min(cur, int(tot))
    return cur, tot


def best_thumbnail(filename: str | None, meta: dict[str, Any] | None) -> str | None:
    thumbs = (meta or {}).get("thumbnails") or []
    if not filename or not thumbs:
        return None
    best = max(thumbs, key=lambda t: (t.get("width") or 0) * (t.get("height") or 0))
    rel = best.get("relative_path")
    if not rel:
        return None
    return posixpath.normpath(posixpath.join(posixpath.dirname(filename), rel))


ESTIMATE_ABOVE = 0.3


def estimate_total(
    progress: float,
    print_duration: float,
    file_time: float,
    filament_time: float,
    slicer_time: float,
) -> float:
    """Estimated total print time, KlipperScreen's "auto" method.

    Up to 30 % trust the slicer; after that blend slicer (fading out), filament and
    file-position extrapolations, dropping any estimate the print has already outrun.
    File extrapolation alone runs long because print_duration includes slow first
    layers and heat-up pauses. Zero means "no estimate".
    """
    if progress <= ESTIMATE_ABOVE:
        for t in (slicer_time, filament_time, file_time):
            if t > print_duration:
                return t
        return slicer_time or filament_time or file_time
    w_slicer = 1.0 + ESTIMATE_ABOVE - progress if print_duration < slicer_time else 0.0
    w_filament = min(progress - ESTIMATE_ABOVE, 0.33) if print_duration < filament_time else 0.0
    w_file = progress - ESTIMATE_ABOVE
    total = w_slicer + w_filament + w_file
    if total == 0:
        return 0.0
    return (slicer_time * w_slicer + filament_time * w_filament + file_time * w_file) / total


def _excluded_ratio(status: dict[str, Any]) -> float:
    eo = status.get("exclude_object") or {}
    objects = eo.get("objects") or []
    return len(eo.get("excluded_objects") or []) / len(objects) if objects else 0.0


def compute_job(status: dict[str, Any], meta: dict[str, Any] | None = None) -> JobInfo:
    ps = status.get("print_stats") or {}
    job = JobInfo(
        state=ps.get("state"),
        filename=ps.get("filename") or None,
        message=ps.get("message") or (status.get("display_status") or {}).get("message") or None,
        print_duration=_num(ps.get("print_duration")),
        total_duration=_num(ps.get("total_duration")),
        filament_used_mm=_num(ps.get("filament_used")),
    )
    # Metadata belongs to a specific file; ignore stale metadata.
    if meta and job.filename and meta.get("filename") not in (None, job.filename):
        meta = None
    job.progress = file_progress(status, meta) if job.filename else None
    job.slicer_estimate = _num((meta or {}).get("estimated_time"))
    job.current_layer, job.total_layer = _layers(status, meta, job.active)
    job.thumbnail_path = best_thumbnail(job.filename, meta)

    pd = job.print_duration
    if job.active and pd:
        if job.progress and job.progress > 0:
            job.remaining_file = max(pd / job.progress - pd, 0.0)
        if job.slicer_estimate:
            job.remaining_slicer = max(job.slicer_estimate - pd, 0.0)
        ftotal = _num((meta or {}).get("filament_total"))
        if ftotal and job.filament_used_mm and 0 < job.filament_used_mm <= ftotal:
            job.remaining_filament = max(pd / (job.filament_used_mm / ftotal) - pd, 0.0)

        # Blend, scaled for speed override and excluded objects like KlipperScreen.
        keep = 1.0 - _excluded_ratio(status)
        speed = _num((status.get("gcode_move") or {}).get("speed_factor")) or 1.0
        slicer_time = (job.slicer_estimate or 0.0) / math.sqrt(speed) * keep
        filament_time = (pd + job.remaining_filament) * keep if job.remaining_filament is not None else 0.0
        file_time = pd / job.progress if job.progress and job.progress > 0 else 0.0
        total = estimate_total(job.progress or 0.0, pd, file_time, filament_time, slicer_time)
        if total > 1:
            job.remaining_auto = max(total - pd, 0.0)
    return job
