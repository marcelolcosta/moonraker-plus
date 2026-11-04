"""Sensors: job, temperatures, fans, and material slots."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.const import PERCENTAGE, EntityCategory, UnitOfLength, UnitOfTemperature, UnitOfTime
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from .coordinator import MoonrakerConfigEntry, MoonrakerCoordinator
from .core.discovery import reading
from .entity import MoonrakerEntity

PRINT_STATES = ["standby", "printing", "paused", "complete", "cancelled", "error"]
KLIPPY_STATES = ["ready", "startup", "shutdown", "error", "disconnected"]

ValueFn = Callable[[MoonrakerCoordinator], Any]


@dataclass(frozen=True, kw_only=True)
class MoonrakerSensorDescription(SensorEntityDescription):
    value_fn: ValueFn
    attrs_fn: Callable[[MoonrakerCoordinator], dict[str, Any] | None] | None = None


def _round(v: Any, n: int = 1) -> float | None:
    return round(v, n) if isinstance(v, (int, float)) and not isinstance(v, bool) else None


def _pct(v: Any) -> float | None:
    return round(v * 100, 1) if isinstance(v, (int, float)) and not isinstance(v, bool) else None


def _eta(c: MoonrakerCoordinator) -> datetime | None:
    rem = c.job.remaining
    if rem is None:
        return None
    # Round to the minute so the state doesn't change on every update.
    return (dt_util.utcnow() + timedelta(seconds=rem)).replace(second=0, microsecond=0)


def _temp(key: str, name: str, fn: ValueFn, **kw: Any) -> MoonrakerSensorDescription:
    return MoonrakerSensorDescription(
        key=key,
        name=name,
        device_class=SensorDeviceClass.TEMPERATURE,
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=1,
        value_fn=fn,
        **kw,
    )


def _speed(key: str, name: str, fn: ValueFn, **kw: Any) -> MoonrakerSensorDescription:
    return MoonrakerSensorDescription(
        key=key,
        name=name,
        native_unit_of_measurement=PERCENTAGE,
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:fan",
        suggested_display_precision=0,
        value_fn=fn,
        **kw,
    )


JOB_SENSORS: tuple[MoonrakerSensorDescription, ...] = (
    MoonrakerSensorDescription(
        key="print_state",
        name="Print state",
        device_class=SensorDeviceClass.ENUM,
        options=PRINT_STATES,
        icon="mdi:printer-3d",
        value_fn=lambda c: c.job.state if c.job.state in PRINT_STATES else None,
        attrs_fn=lambda c: {"message": c.job.message},
    ),
    MoonrakerSensorDescription(
        key="print_progress",
        name="Print progress",
        native_unit_of_measurement=PERCENTAGE,
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=0,
        icon="mdi:progress-clock",
        value_fn=lambda c: _pct(c.job.progress) if c.job.filename else 0,
    ),
    MoonrakerSensorDescription(
        key="print_filename",
        name="Print filename",
        icon="mdi:file",
        value_fn=lambda c: c.job.filename,
    ),
    MoonrakerSensorDescription(
        key="print_duration",
        name="Print duration",
        device_class=SensorDeviceClass.DURATION,
        native_unit_of_measurement=UnitOfTime.SECONDS,
        suggested_unit_of_measurement=UnitOfTime.HOURS,
        suggested_display_precision=2,
        value_fn=lambda c: _round(c.job.print_duration, 0),
    ),
    MoonrakerSensorDescription(
        key="print_time_left",
        name="Print time left",
        device_class=SensorDeviceClass.DURATION,
        native_unit_of_measurement=UnitOfTime.SECONDS,
        suggested_unit_of_measurement=UnitOfTime.HOURS,
        suggested_display_precision=2,
        value_fn=lambda c: _round(c.job.remaining, 0),
        attrs_fn=lambda c: {
            "file_estimate": _round(c.job.remaining_file, 0),
            "slicer_estimate": _round(c.job.remaining_slicer, 0),
            "filament_estimate": _round(c.job.remaining_filament, 0),
        },
    ),
    MoonrakerSensorDescription(
        key="print_eta",
        name="Print ETA",
        device_class=SensorDeviceClass.TIMESTAMP,
        value_fn=_eta,
    ),
    MoonrakerSensorDescription(
        key="current_layer",
        name="Current layer",
        icon="mdi:layers",
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda c: c.job.current_layer,
    ),
    MoonrakerSensorDescription(
        key="total_layers",
        name="Total layers",
        icon="mdi:layers-triple",
        value_fn=lambda c: c.job.total_layer,
    ),
    MoonrakerSensorDescription(
        key="filament_used",
        name="Filament used",
        device_class=SensorDeviceClass.DISTANCE,
        native_unit_of_measurement=UnitOfLength.METERS,
        suggested_display_precision=2,
        value_fn=lambda c: _round((c.job.filament_used_mm or 0) / 1000, 2) if c.job.filename else None,
    ),
    MoonrakerSensorDescription(
        key="klippy_state",
        name="Klipper state",
        device_class=SensorDeviceClass.ENUM,
        options=KLIPPY_STATES,
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda c: c.state.klippy_state if c.state.klippy_state in KLIPPY_STATES else None,
        attrs_fn=lambda c: {"state_message": c.state.server_info.get("state_message")},
    ),
)


def _object_sensors(c: MoonrakerCoordinator) -> list[MoonrakerSensorDescription]:
    out: list[MoonrakerSensorDescription] = []
    for info in c.state.object_info:
        name, label = info.name, info.label

        def r(field: str, obj=info) -> ValueFn:
            return lambda co: reading(obj, co.state.status).get(field)

        if info.kind == "heater":
            out.append(_temp(f"{name}_temperature", f"{label} temperature", lambda co, f=r("temperature"): _round(f(co))))
            out.append(_temp(f"{name}_target", f"{label} target", lambda co, f=r("target"): _round(f(co))))
            out.append(
                MoonrakerSensorDescription(
                    key=f"{name}_power",
                    name=f"{label} power",
                    native_unit_of_measurement=PERCENTAGE,
                    state_class=SensorStateClass.MEASUREMENT,
                    entity_category=EntityCategory.DIAGNOSTIC,
                    entity_registry_enabled_default=False,
                    suggested_display_precision=0,
                    icon="mdi:flash",
                    value_fn=lambda co, f=r("power"): _pct(f(co)),
                )
            )
        elif info.kind == "temperature":
            out.append(_temp(f"{name}_temperature", label, lambda co, f=r("temperature"): _round(f(co))))
        elif info.kind == "temperature_fan":
            out.append(_temp(f"{name}_temperature", f"{label} temperature", lambda co, f=r("temperature"): _round(f(co))))
            out.append(_temp(f"{name}_target", f"{label} target", lambda co, f=r("target"): _round(f(co))))
            out.append(_speed(f"{name}_speed", f"{label} speed", lambda co, f=r("speed"): _pct(f(co))))
        elif info.kind == "fan":
            out.append(_speed(f"{name}_speed", f"{label} speed", lambda co, f=r("speed"): _pct(f(co))))
        elif info.kind == "output_pin":
            out.append(
                MoonrakerSensorDescription(
                    key=f"{name}_value",
                    name=label,
                    native_unit_of_measurement=PERCENTAGE,
                    state_class=SensorStateClass.MEASUREMENT,
                    entity_category=EntityCategory.DIAGNOSTIC,
                    entity_registry_enabled_default=False,
                    icon="mdi:electric-switch",
                    value_fn=lambda co, f=r("value"): _pct(f(co)),
                )
            )
    return out


def _material_sensors(c: MoonrakerCoordinator) -> list[MoonrakerSensorDescription]:
    out: list[MoonrakerSensorDescription] = []
    for ms in c.materials:
        kind = ms.kind

        def system(co: MoonrakerCoordinator, k: str = kind):
            return next((m for m in co.materials if m.kind == k), None)

        def active_label(co: MoonrakerCoordinator, k: str = kind) -> str | None:
            m = system(co, k)
            if m is None or m.active_slot is None:
                return None
            if m.active_slot == "bypass":
                return "Bypass"
            return next((s.label for s in m.slots if s.id == m.active_slot), m.active_slot)

        out.append(
            MoonrakerSensorDescription(
                key=f"{kind}_active_slot",
                name=f"{ms.name} active slot",
                icon="mdi:printer-3d-nozzle",
                value_fn=active_label,
                attrs_fn=lambda co, k=kind: (
                    {"slot_id": m.active_slot, **{k2: v for k2, v in m.extra.items() if v is not None}}
                    if (m := system(co, k))
                    else None
                ),
            )
        )
        out.append(
            MoonrakerSensorDescription(
                key=f"{kind}_status",
                name=f"{ms.name} status",
                icon="mdi:information-outline",
                value_fn=lambda co, k=kind: (
                    ((m.error or m.action or "Idle")[:255]) if (m := system(co, k)) else None
                ),
                attrs_fn=lambda co, k=kind: {"error": m.error, "action": m.action} if (m := system(co, k)) else None,
            )
        )
        for unit in ms.units:
            if unit.temperature is None and unit.humidity is None:
                continue

            def unit_of(co: MoonrakerCoordinator, k: str = kind, uid: str = unit.id):
                m = system(co, k)
                return next((u for u in m.units if u.id == uid), None) if m else None

            out.append(
                _temp(f"{kind}_{unit.id}_temperature", f"{unit.name} temperature",
                      lambda co, f=unit_of: _round(u.temperature) if (u := f(co)) else None)
            )
            out.append(
                MoonrakerSensorDescription(
                    key=f"{kind}_{unit.id}_humidity",
                    name=f"{unit.name} humidity",
                    device_class=SensorDeviceClass.HUMIDITY,
                    native_unit_of_measurement=PERCENTAGE,
                    state_class=SensorStateClass.MEASUREMENT,
                    value_fn=lambda co, f=unit_of: _round(u.humidity, 0) if (u := f(co)) else None,
                )
            )
    return out


async def async_setup_entry(
    hass: HomeAssistant, entry: MoonrakerConfigEntry, async_add_entities: AddConfigEntryEntitiesCallback
) -> None:
    c = entry.runtime_data
    descriptions = [*JOB_SENSORS, *_object_sensors(c), *_material_sensors(c)]
    entities: list[SensorEntity] = [MoonrakerSensor(c, d) for d in descriptions]
    entities += [MoonrakerSlotSensor(c, key) for key in c.slot_index()]
    async_add_entities(entities)


class MoonrakerSensor(MoonrakerEntity, SensorEntity):
    entity_description: MoonrakerSensorDescription

    def __init__(self, coordinator: MoonrakerCoordinator, description: MoonrakerSensorDescription) -> None:
        super().__init__(coordinator, description.key, description.name)
        self.entity_description = description

    @property
    def native_value(self) -> Any:
        return self.entity_description.value_fn(self.coordinator)

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        fn = self.entity_description.attrs_fn
        return fn(self.coordinator) if fn else None


class MoonrakerSlotSensor(MoonrakerEntity, SensorEntity):
    """One material slot (MMU gate, CFS slot, toolchanger head)."""

    _attr_icon = "mdi:printer-3d-nozzle-outline"

    def __init__(self, coordinator: MoonrakerCoordinator, slot_key: str) -> None:
        ms, slot = coordinator.slot_index()[slot_key]
        super().__init__(coordinator, f"slot_{slot_key}", slot.label)
        self._slot_key = slot_key

    def _slot(self):
        found = self.coordinator.slot_index().get(self._slot_key)
        return found[1] if found else None

    @property
    def available(self) -> bool:
        return super().available and self._slot() is not None

    @property
    def native_value(self) -> str | None:
        s = self._slot()
        if s is None:
            return None
        if s.present is False:
            return "Empty"
        return s.material or ("Loaded" if s.present else "Unknown")

    @property
    def icon(self) -> str:
        s = self._slot()
        if s is not None and s.active:
            return "mdi:printer-3d-nozzle"
        return "mdi:printer-3d-nozzle-outline"

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        s = self._slot()
        if s is None:
            return None
        attrs = {
            "slot_id": s.id,
            "present": s.present,
            "active": s.active,
            "color": s.color,
            "material": s.material,
            "vendor": s.vendor,
            "filament_name": s.name,
            "remaining": s.remaining,
            "print_temperature": s.temperature,
            "spool_id": s.spool_id,
            **s.extra,
        }
        return {k: v for k, v in attrs.items() if v is not None}
