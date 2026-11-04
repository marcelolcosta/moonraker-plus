"""Constants for Moonraker Plus."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "moonraker_plus"

DEFAULT_PORT: Final = 7125

CONF_WEB_URL: Final = "web_url"  # base URL for relative webcam URLs (the Mainsail/Fluidd host)
CONF_MACROS: Final = "macros"  # gcode macros exposed as buttons
CONF_STREAM_SOURCE: Final = "stream_source"  # optional go2rtc source for a camera (any scheme go2rtc supports)

# Creality K1/K2 stock firmware serve the camera as WebRTC with a custom signaling
# endpoint; HA's bundled go2rtc (>= 1.9.10) understands it with format=creality.
CREALITY_WEBRTC_PORT: Final = 8000
CREALITY_WEBRTC_PATH: Final = "/call/webrtc_local"
CREALITY_MARKERS: Final = ("box", "prtouch_v3", "filament_rack", "custom_macro", "load_ai")

# Moonraker pushes updates every ~250 ms; batch them into HA state writes.
UPDATE_THROTTLE_SECONDS: Final = 1.0

# Seconds to wait for the first full state during setup before retrying later.
SETUP_TIMEOUT_SECONDS: Final = 20.0
