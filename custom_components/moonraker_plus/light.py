"""Lights: LED-like output pins (on/off or dimmable) and led/neopixel objects (RGB/RGBW)."""

from __future__ import annotations

import re
from typing import Any

from homeassistant.components.light import (
    ATTR_BRIGHTNESS,
    ATTR_RGB_COLOR,
    ATTR_RGBW_COLOR,
    ColorMode,
    LightEntity,
)
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .coordinator import MoonrakerConfigEntry, MoonrakerCoordinator
from .core.client import MoonrakerError
from .core.discovery import ObjectInfo
from .entity import MoonrakerEntity

LIGHT_PIN_RE = re.compile(r"led|light|lamp", re.IGNORECASE)


def _has_white(cfg: dict[str, Any]) -> bool:
    if cfg.get("white_pin"):
        return True
    order = cfg.get("color_order")
    if isinstance(order, list):
        order = "".join(order)
    return isinstance(order, str) and "W" in order.upper()


async def async_setup_entry(
    hass: HomeAssistant, entry: MoonrakerConfigEntry, async_add_entities: AddConfigEntryEntitiesCallback
) -> None:
    c = entry.runtime_data
    entities: list[LightEntity] = []
    for info in c.state.object_info:
        suffix = info.name.split(" ", 1)[-1]
        if info.kind == "output_pin" and LIGHT_PIN_RE.search(suffix):
            entities.append(PinLight(c, info))
        elif info.kind == "light":
            entities.append(RgbLight(c, info))
    async_add_entities(entities)


class _Light(MoonrakerEntity, LightEntity):
    def __init__(self, coordinator: MoonrakerCoordinator, info: ObjectInfo) -> None:
        super().__init__(coordinator, f"{info.name}_light", info.label)
        self._obj = info.name
        self._cfg = coordinator.state.object_config(info.name)

    async def _run(self, coro) -> None:  # noqa: ANN001
        try:
            await coro
        except MoonrakerError as err:
            raise HomeAssistantError(f"{self.name}: {err}") from err


class PinLight(_Light):
    """output_pin used as a light (e.g. K1/K2 `output_pin LED`)."""

    def __init__(self, coordinator: MoonrakerCoordinator, info: ObjectInfo) -> None:
        super().__init__(coordinator, info)
        self._pwm = bool(self._cfg.get("pwm", False))
        mode = ColorMode.BRIGHTNESS if self._pwm else ColorMode.ONOFF
        self._attr_color_mode = mode
        self._attr_supported_color_modes = {mode}

    @property
    def _value(self) -> float:
        return float((self.printer_state.status.get(self._obj) or {}).get("value") or 0.0)

    @property
    def is_on(self) -> bool:
        return self._value > 0

    @property
    def brightness(self) -> int | None:
        return round(self._value * 255) if self._pwm else None

    async def async_turn_on(self, **kwargs: Any) -> None:
        value = kwargs[ATTR_BRIGHTNESS] / 255 if ATTR_BRIGHTNESS in kwargs and self._pwm else 1.0
        await self._run(self.coordinator.printer.set_output_pin(self._obj, value))

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self._run(self.coordinator.printer.set_output_pin(self._obj, 0.0))


class RgbLight(_Light):
    """led / neopixel / dotstar. Uses the first LED's color for state; SET_LED sets the whole chain."""

    def __init__(self, coordinator: MoonrakerCoordinator, info: ObjectInfo) -> None:
        super().__init__(coordinator, info)
        self._white = _has_white(self._cfg)
        mode = ColorMode.RGBW if self._white else ColorMode.RGB
        self._attr_color_mode = mode
        self._attr_supported_color_modes = {mode}
        # Happy Hare drives its own LED effects; don't fight it by default.
        if "mmu" in info.name.lower():
            self._attr_entity_registry_enabled_default = False

    @property
    def _channels(self) -> list[float]:
        data = (self.printer_state.status.get(self._obj) or {}).get("color_data") or [[0, 0, 0, 0]]
        first = list(data[0]) + [0.0] * 4
        return [float(v or 0) for v in first[:4]]

    @property
    def is_on(self) -> bool:
        return any(v > 0 for v in self._channels)

    @property
    def brightness(self) -> int:
        return round(max(self._channels) * 255)

    @property
    def rgb_color(self) -> tuple[int, int, int] | None:
        r, g, b, _ = self._channels
        m = max(r, g, b) or 1.0
        return (round(r / m * 255), round(g / m * 255), round(b / m * 255))

    @property
    def rgbw_color(self) -> tuple[int, int, int, int] | None:
        r, g, b, w = self._channels
        m = max(r, g, b, w) or 1.0
        return (round(r / m * 255), round(g / m * 255), round(b / m * 255), round(w / m * 255))

    async def async_turn_on(self, **kwargs: Any) -> None:
        if self._white:
            color = kwargs.get(ATTR_RGBW_COLOR) or (self.rgbw_color if self.is_on else (0, 0, 0, 255))
        else:
            color = kwargs.get(ATTR_RGB_COLOR) or (self.rgb_color if self.is_on else (255, 255, 255))
        bri = kwargs.get(ATTR_BRIGHTNESS, self.brightness if self.is_on else 255) / 255
        ch = [v / 255 * bri for v in color]
        await self._run(
            self.coordinator.printer.set_led(self._obj, ch[0], ch[1], ch[2], ch[3] if self._white else None)
        )

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self._run(self.coordinator.printer.set_led(self._obj, 0, 0, 0, 0 if self._white else None))
