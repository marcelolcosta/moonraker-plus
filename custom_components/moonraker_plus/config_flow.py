"""Config and options flow."""

from __future__ import annotations

import logging
from typing import Any

import aiohttp
import voluptuous as vol

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.const import CONF_API_KEY, CONF_HOST, CONF_NAME, CONF_PORT
from homeassistant.core import callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.selector import (
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
    TextSelectorConfig,
    TextSelectorType,
)
from homeassistant.helpers.service_info.zeroconf import ZeroconfServiceInfo

from .const import CONF_MACROS, CONF_STREAM_SOURCE, CONF_WEB_URL, DEFAULT_PORT, DOMAIN
from .core.printer import machine_id, probe

_LOGGER = logging.getLogger(__name__)


class MoonrakerConfigFlow(ConfigFlow, domain=DOMAIN):
    VERSION = 1

    def __init__(self) -> None:
        self._discovered: dict[str, Any] = {}

    async def _probe(self, host: str, port: int, api_key: str | None) -> dict[str, Any]:
        return await probe(async_get_clientsession(self.hass), host, port, api_key)

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            host = user_input[CONF_HOST].strip()
            port = int(user_input.get(CONF_PORT, DEFAULT_PORT))
            api_key = user_input.get(CONF_API_KEY) or None
            try:
                info = await self._probe(host, port, api_key)
            except aiohttp.ClientResponseError as err:
                errors["base"] = "invalid_auth" if err.status in (401, 403) else "cannot_connect"
            except (aiohttp.ClientError, TimeoutError):
                errors["base"] = "cannot_connect"
            except Exception:  # noqa: BLE001
                _LOGGER.exception("Unexpected error probing %s:%s", host, port)
                errors["base"] = "unknown"
            else:
                await self.async_set_unique_id(machine_id(info["system_info"]) or f"{host}:{port}")
                self._abort_if_unique_id_configured(updates={CONF_HOST: host, CONF_PORT: port})
                title = user_input.get(CONF_NAME) or info["printer_info"].get("hostname") or host
                data = {CONF_HOST: host, CONF_PORT: port}
                if api_key:
                    data[CONF_API_KEY] = api_key
                return self.async_create_entry(title=title, data=data)

        schema = vol.Schema(
            {
                vol.Required(CONF_HOST): str,
                vol.Optional(CONF_PORT, default=DEFAULT_PORT): int,
                vol.Optional(CONF_NAME): str,
                vol.Optional(CONF_API_KEY): TextSelector(TextSelectorConfig(type=TextSelectorType.PASSWORD)),
            }
        )
        return self.async_show_form(
            step_id="user", data_schema=self.add_suggested_values_to_schema(schema, user_input), errors=errors
        )

    async def async_step_zeroconf(self, discovery_info: ZeroconfServiceInfo) -> ConfigFlowResult:
        host = discovery_info.host
        port = discovery_info.port or DEFAULT_PORT
        try:
            info = await self._probe(host, port, None)
        except (aiohttp.ClientError, TimeoutError):
            return self.async_abort(reason="cannot_connect")
        await self.async_set_unique_id(machine_id(info["system_info"]) or f"{host}:{port}")
        self._abort_if_unique_id_configured(updates={CONF_HOST: host, CONF_PORT: port})
        name = info["printer_info"].get("hostname") or host
        self._discovered = {CONF_HOST: host, CONF_PORT: port, CONF_NAME: name}
        self.context["title_placeholders"] = {"name": name}
        return await self.async_step_zeroconf_confirm()

    async def async_step_zeroconf_confirm(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            d = self._discovered
            return self.async_create_entry(title=d[CONF_NAME], data={CONF_HOST: d[CONF_HOST], CONF_PORT: d[CONF_PORT]})
        return self.async_show_form(
            step_id="zeroconf_confirm",
            description_placeholders={"name": self._discovered[CONF_NAME], "host": self._discovered[CONF_HOST]},
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry) -> MoonrakerOptionsFlow:  # noqa: ANN001
        return MoonrakerOptionsFlow()


class MoonrakerOptionsFlow(OptionsFlow):
    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(data=user_input)

        opts = self.config_entry.options
        macros: list[str] = []
        coordinator = getattr(self.config_entry, "runtime_data", None)
        if coordinator is not None:
            macros = sorted(
                o.split(" ", 1)[1]
                for o in coordinator.state.objects
                if o.startswith("gcode_macro ") and not o.split(" ", 1)[1].startswith("_")
            )
        selected = [m for m in opts.get(CONF_MACROS, []) if m in macros] if macros else opts.get(CONF_MACROS, [])
        schema: dict[Any, Any] = {
            vol.Optional(CONF_WEB_URL, description={"suggested_value": opts.get(CONF_WEB_URL)}): str,
            vol.Optional(CONF_STREAM_SOURCE, description={"suggested_value": opts.get(CONF_STREAM_SOURCE)}): str,
        }
        if macros:
            schema[vol.Optional(CONF_MACROS, default=selected)] = SelectSelector(
                SelectSelectorConfig(options=macros, multiple=True, mode=SelectSelectorMode.DROPDOWN, sort=True)
            )
        return self.async_show_form(step_id="init", data_schema=vol.Schema(schema))
