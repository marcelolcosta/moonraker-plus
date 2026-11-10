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
- Controls: pause, resume, cancel and **emergency stop**; **target temperatures** for every
  nozzle, the bed and the chamber (heater or chamber temperature fan), limited to each printer's
  `max_temp`; **fan speed** for client-controllable fans (chamber/exhaust fans, part fan); lights
  (output pins and LEDs); and buttons for whichever macros you pick in the options. Firmware
  restart exists but is disabled by default.
- Print events (started, paused or filament runout, resumed, completed, cancelled, error,
  Klipper shutdown) as device triggers, plus a ready-made blueprint for phone notifications.
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
light and your macro buttons. Tap a temperature (nozzle, bed, chamber) or a fan to set it with
presets or an exact value. Cancel and emergency stop ask for confirmation.

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

## Notifications

The **print notifications** blueprint sends a Companion app notification when a print starts,
pauses (the message names the filament sensor on a runout), resumes, completes, is cancelled,
fails, or Klipper shuts down. The notification carries the print thumbnail or a camera
snapshot. Each printer's notification replaces its previous one, and pauses and errors are
sent with high priority.

### Before you start

- The [Home Assistant Companion app](https://companion.home-assistant.io/) is installed on your
  phone and signed in to your Home Assistant, and notifications are allowed for it in the
  phone's settings. The phone then appears under **Settings → Devices & services → Mobile App**.
- Moonraker Plus 0.4.0 or later is installed and your printers are set up.

### Step 1: import the blueprint (once)

1. Click this button and choose your Home Assistant instance:

   [![Import blueprint](https://my.home-assistant.io/badges/blueprint_import.svg)](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https%3A%2F%2Fgithub.com%2Fmarcelolcosta%2Fmoonraker-plus%2Fblob%2Fmain%2Fblueprints%2Fautomation%2Fmoonraker_plus%2Fprint_notifications.yaml)

   Without the button: go to **Settings → Automations & scenes → Blueprints**, click
   **Import blueprint**, paste this URL and click **Preview**:

   ```
   https://github.com/marcelolcosta/moonraker-plus/blob/main/blueprints/automation/moonraker_plus/print_notifications.yaml
   ```

2. Click **Import blueprint**. "Moonraker Plus - print notifications" now appears in the
   blueprint list.

### Step 2: create an automation for a printer

1. In **Settings → Automations & scenes → Blueprints**, click
   **Moonraker Plus - print notifications**. A new automation opens.
2. Fill in:
   - **Printer**: the printer to watch.
   - **Phone**: the phone that receives the notifications.
   - **Notify on**: the events you want. Completed, paused, cancelled, error and Klipper
     shutdown are on by default; started and resumed are off.
   - **Picture**: the print thumbnail (default), a camera snapshot, or none.
   - **Open when tapped** (optional): a dashboard path, e.g. `/dashboard-printers/k1max`.
     Copy it from your browser's address bar, everything after the host and port. Leave it
     empty to just open the app.
3. Click **Save** and give it a name, e.g. "K1 Max notifications".

Repeat step 2 for each printer. To notify more than one phone, create another automation for
the same printer with the other phone.

### Step 3: test it (optional, safe)

You don't need to wait for a print to finish. A test event sends nothing to the printer.

1. Find the printer's device ID: open **Settings → Devices & services → Moonraker Plus**,
   click the printer's device, and copy the last part of the address bar
   (`…/config/devices/device/<device id>`).
2. Go to **Developer tools → Events**. Under **Fire an event**, set the event type to
   `moonraker_plus_event` and paste this as the event data, with your device ID:

   ```yaml
   device_id: PASTE_THE_DEVICE_ID_HERE
   entry_id: test
   printer: K1 Max
   type: print_completed
   filename: test_print.gcode
   print_duration: 3725
   ```

3. Click **Fire event**. Your phone should show "K1 Max finished printing" with
   "test_print done in 1h 2m". The test has no thumbnail, so no picture is attached.

If nothing arrives, open the automation, click **⋮ → Traces**, and check whether it ran and
what failed. Also check that **Print completed** is selected under **Notify on**.

### Updating the blueprint

Blueprints don't update with the integration. To get a newer version, go to
**Settings → Automations & scenes → Blueprints**, click **⋮** next to the blueprint, and choose
**Re-import blueprint**. Your automations keep their settings.

### Your own automations

Every printer device offers triggers such as **Print completed**, **Print paused** and
**Klipper shut down**. In the automation editor, choose **Add trigger → Device**, pick the
printer, then the trigger. The same events are available as the `moonraker_plus_event` event,
whose data holds `type`, `printer`, `filename`, `message`, `progress`, `print_duration`,
`thumbnail_entity` and `camera_entity`. `type` is one of `print_started`, `print_paused`,
`print_resumed`, `print_completed`, `print_cancelled`, `print_error` or `klipper_shutdown`.

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
