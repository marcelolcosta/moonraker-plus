# Moonraker Plus for Home Assistant

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/docs/faq/custom_repositories)
[![Validate](https://github.com/marcelolcosta/moonraker-plus/actions/workflows/validate.yml/badge.svg)](https://github.com/marcelolcosta/moonraker-plus/actions/workflows/validate.yml)

<img src="custom_components/moonraker_plus/brand/icon.png" alt="" width="96" align="right">

A custom integration for Klipper printers running Moonraker. It supports multi-material
systems: **Happy Hare** MMUs, the **Creality CFS** (K2 series) and the **Snapmaker U1**
toolchanger.

- Live updates over the Moonraker WebSocket (local push), batched to one state write per second.
- Discovers each printer's heaters, temperature sensors, fans, filament sensors and lights on
  its own.
- Print job: state, progress, time left (three estimates), ETA, layer count, filament used,
  and the thumbnail.
- Material slots: one sensor per gate, CFS slot or toolhead. The state is the material, and the
  attributes hold color, vendor, name and the active flag. CFS units also get temperature and
  humidity sensors.
- Controls: pause, resume and cancel; lights (output pins and LEDs); and buttons for whichever
  macros you pick in the options. Emergency stop and firmware restart exist but are disabled by
  default.
- Cameras from Moonraker's webcam list: MJPEG streams, or snapshot-only cameras for WebRTC and
  other services.

## Dashboard

The integration ships its own card, so there's nothing extra to install.

**Whole dashboard (recommended).** Settings → Dashboards → Add dashboard → New dashboard from
scratch. Open it, click ⋮ → Edit dashboard → ⋮ → Raw configuration editor, replace everything
with:

```yaml
strategy:
  type: custom:moonraker-plus
```

You get an overview with one compact card per printer. Tap a printer to open its page, which has
the camera, all temperatures, fans and macros. Printers you add later show up on their own.

**Single card.** In any dashboard, add the card "Moonraker Plus printer", or use YAML:

```yaml
type: custom:moonraker-plus-card
device_id: <pick in the visual editor>
variant: compact   # or full
navigation_path: k1-max   # optional: open this view on tap
```

The card adapts to each printer. It shows the job ring only while printing. It shows CFS units,
Happy Hare gates or toolheads with their real filament colors (solid ring = active slot, dashed
ring = next gate). It shows only the heaters and fans that exist, plus pause, resume, cancel,
light and your macro buttons. Cancel asks for confirmation.

## Install with HACS

1. In Home Assistant, open **HACS** → ⋮ → **Custom repositories**.
2. Add `https://github.com/marcelolcosta/moonraker-plus` with type **Integration**.
3. Search for **Moonraker Plus**, open it, then select **Download**.
4. Restart Home Assistant.
5. Go to **Settings → Devices and services → Add integration → Moonraker Plus**, and enter the
   printer's IP address (port `7125`).

Requires Home Assistant 2025.2 or newer. The integration's own icon shows on 2026.3 and newer.

## Install (manual)

Download the `moonraker_plus.zip` asset from the latest
[release](https://github.com/marcelolcosta/moonraker-plus/releases), unzip it into your HA
`config/custom_components/` folder (you should end up with `custom_components/moonraker_plus/`),
restart HA, then add **Moonraker Plus** under Settings → Devices & services.

## Options

- **Web interface URL**: the base for relative webcam URLs. It defaults to `http://<host>`.
  Set it if your UI runs on another port, e.g. `http://<host>:4408`.
- **Camera stream source**: optional. Any source HA's go2rtc understands (`rtsp://…`,
  `webrtc:…`, `ffmpeg:…`). It replaces the cameras from Moonraker.
- **Macros exposed as buttons**: macros whose names start with `_` are hidden.

Creality stock-firmware cameras (K2 series) are detected automatically. They're WebRTC on port
8000, and HA's built-in go2rtc handles the live view and snapshots.

## Supported printers

Tested with stock Klipper/Moonraker (Mainsail), Happy Hare (ERCF), the Creality K2 Plus on stock
firmware (CFS and WebRTC camera), and the Snapmaker U1 on paxx firmware (toolchanger and H.264
camera). Other Klipper printers running Moonraker should work; the integration discovers each
printer's heaters, fans, sensors and lights by itself.

## License

Moonraker Plus is **source-available for non-commercial use** under the
[PolyForm Noncommercial License 1.0.0](LICENSE.md). Personal and other non-commercial use is
free. **Commercial use requires a separate commercial license.** Contact
[@marcelolcosta](https://github.com/marcelolcosta).

Third-party components are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). The Layer
Lizard name and logo aren't covered by the software license.
