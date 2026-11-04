"""Cameras.

Sources, in order:
1. A native stream source (user option, or Creality's WebRTC camera): served by HA's go2rtc.
2. Moonraker's webcam list:
   - MJPEG services -> MJPEG camera.
   - Anything else (e.g. `webrtc-camerastreamer`, whose stream URL is a player page): look
     next to the configured URL for a raw H.264 stream (go2rtc -> WebRTC, light) or an
     MJPEG stream; fall back to snapshot-only.

Relative URLs are resolved against the web interface URL (option `web_url`, default
http://<host>).
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any
from urllib.parse import urljoin

import aiohttp

from homeassistant.components.camera import Camera, CameraEntityFeature
from homeassistant.components.mjpeg.camera import MjpegCamera
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .coordinator import MoonrakerConfigEntry, MoonrakerCoordinator
from .entity import slug

_LOGGER = logging.getLogger(__name__)

MJPEG_SERVICES = ("mjpegstreamer", "mjpegstreamer-adaptive", "ipstream", "uv4l-mjpeg")

# Candidate endpoints relative to the webcam's base path, best first.
# stream.h264 / stream.mjpg: paxx v4l2-mpp (Snapmaker U1); stream: camera-streamer; ?action=stream: ustreamer/mjpg-streamer.
H264_CANDIDATES = ("stream.h264",)
MJPEG_CANDIDATES = ("stream.mjpg?fps=5", "stream.mjpg", "stream", "?action=stream")
H264_START = (b"\x00\x00\x00\x01", b"\x00\x00\x01")


def resolve(base: str, url: str | None) -> str | None:
    if not url:
        return None
    return url if "://" in url else urljoin(base + "/", url.lstrip("/"))


@dataclass
class CameraSource:
    kind: str  # go2rtc | mjpeg | snapshot
    stream: str | None
    snapshot: str | None


async def _peek(session: aiohttp.ClientSession, url: str) -> tuple[str, bytes] | None:
    """Content type and first bytes of a URL, without downloading a whole stream."""
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=4, sock_read=3)) as resp:
            if resp.status != 200:
                return None
            return resp.headers.get("Content-Type", ""), await resp.content.read(16)
    except (aiohttp.ClientError, TimeoutError):
        return None


async def resolve_source(session: aiohttp.ClientSession, cam: dict[str, Any], web_url: str) -> CameraSource:
    stream = resolve(web_url, cam.get("stream_url"))
    snapshot = resolve(web_url, cam.get("snapshot_url"))
    if cam.get("service") in MJPEG_SERVICES and stream:
        return CameraSource("mjpeg", stream, snapshot)
    base = (stream or snapshot or "").rsplit("/", 1)[0] + "/"
    if base != "/":
        for path in H264_CANDIDATES:
            url = urljoin(base, path)
            if (peek := await _peek(session, url)) and "html" not in peek[0] and peek[1].startswith(H264_START):
                return CameraSource("go2rtc", url, snapshot)
        for path in MJPEG_CANDIDATES:
            url = urljoin(base, path)
            if (peek := await _peek(session, url)) and peek[0].startswith("multipart/x-mixed-replace"):
                return CameraSource("mjpeg", url, snapshot)
    return CameraSource("snapshot", None, snapshot)


async def async_setup_entry(
    hass: HomeAssistant, entry: MoonrakerConfigEntry, async_add_entities: AddConfigEntryEntitiesCallback
) -> None:
    c = entry.runtime_data
    base_uid = entry.unique_id or entry.entry_id
    if c.native_stream_source:
        # Replaces Moonraker's webcam list (on Creality stock firmware those URLs don't work).
        async_add_entities([StreamSourceCamera(c, "Camera", c.native_stream_source, None, f"{base_uid}_webcam_native", {})])
        return
    entities: list[Camera] = []
    for cam in c.state.webcams:
        if cam.get("enabled") is False:
            continue
        name = cam.get("name") or "Webcam"
        uid = f"{base_uid}_webcam_{slug(cam.get('uid') or name)}"
        src = await resolve_source(c.session, cam, c.web_url)
        _LOGGER.debug("%s webcam %s -> %s", entry.title, name, src)
        if src.kind == "go2rtc" and src.stream:
            entities.append(StreamSourceCamera(c, name, src.stream, src.snapshot, uid, cam))
        elif src.kind == "mjpeg" and src.stream:
            entities.append(MoonrakerMjpegCamera(c, name, src.stream, src.snapshot, uid, cam))
        elif src.snapshot:
            entities.append(SnapshotCamera(c, name, src.snapshot, uid, cam))
    async_add_entities(entities)


def _attrs(cam: dict[str, Any], **extra: Any) -> dict[str, Any]:
    attrs = {k: cam.get(k) for k in ("service", "rotation", "flip_horizontal", "flip_vertical", "aspect_ratio") if k in cam}
    return attrs | {k: v for k, v in extra.items() if v is not None}


async def _fetch(session: aiohttp.ClientSession, url: str) -> bytes | None:
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as resp:
            resp.raise_for_status()
            return await resp.read()
    except (aiohttp.ClientError, TimeoutError):
        return None


class MoonrakerMjpegCamera(MjpegCamera):
    _attr_has_entity_name = True

    def __init__(self, c: MoonrakerCoordinator, name: str, stream: str, snapshot: str | None, uid: str, cam: dict) -> None:
        super().__init__(
            name=name, mjpeg_url=stream, still_image_url=snapshot, unique_id=uid, device_info=c.device_info, verify_ssl=False
        )
        self._attr_extra_state_attributes = _attrs(cam, stream_url=stream)


class SnapshotCamera(Camera):
    _attr_has_entity_name = True

    def __init__(self, c: MoonrakerCoordinator, name: str, snapshot: str, uid: str, cam: dict) -> None:
        super().__init__()
        self._c = c
        self._url = snapshot
        self._attr_name = name
        self._attr_unique_id = uid
        self._attr_device_info = c.device_info
        self._attr_extra_state_attributes = _attrs(cam)

    async def async_camera_image(self, width: int | None = None, height: int | None = None) -> bytes | None:
        return await _fetch(self._c.session, self._url)


class StreamSourceCamera(Camera):
    """Camera whose live view is served by HA's go2rtc from a stream source.

    Stills come from a direct snapshot URL when there is one, otherwise from go2rtc.
    """

    _attr_has_entity_name = True
    _attr_supported_features = CameraEntityFeature.STREAM

    def __init__(
        self, c: MoonrakerCoordinator, name: str, source: str, snapshot: str | None, uid: str, cam: dict
    ) -> None:
        super().__init__()
        self._c = c
        self._source = source
        self._snapshot = snapshot
        self._attr_use_stream_for_stills = snapshot is None
        self._attr_name = name
        self._attr_unique_id = uid
        self._attr_device_info = c.device_info
        self._attr_extra_state_attributes = _attrs(cam, stream_source=source.split("#", 1)[0]) | (
            {} if cam else {"service": source.split(":", 1)[0]}
        )

    async def stream_source(self) -> str | None:
        return self._source

    async def async_camera_image(self, width: int | None = None, height: int | None = None) -> bytes | None:
        if self._snapshot is None:
            return None  # use_stream_for_stills -> go2rtc
        return await _fetch(self._c.session, self._snapshot)
