---
title: Connect an Android Device
description: Enable USB debugging, authorize your computer, and manage devices with adb for ZKite.
---

ZKite uses the standard Android Debug Bridge (`adb`) to discover target devices, install runtime previews, and stream development logs.

## 1. Enable Developer Options & USB Debugging

On your physical Android phone:

1. Open **Settings** > **About Phone**.
2. Tap **Build Number** 7 times until you see the prompt *"You are now a developer!"*.
3. Go back to **Settings** > **System** (or **Developer options**).
4. Turn on **USB Debugging**.
5. Keep the screen unlocked for the initial connection authorization.

## 2. Connect and Authorize USB Debugging

1. Plug your phone into your computer using a data-capable USB cable (a charging-only cable will not establish transport).
2. Unlock your phone screen.
3. Accept the debugging authorization prompt for your computer (check **Always allow from this computer**).

## 3. Verify Connection with `adb devices -l`

Run `adb devices -l` and inspect the reported state:

| State | Meaning and Next Action |
| :--- | :--- |
| `device` | Connected and authorized; ready for development. |
| `unauthorized` | Unlock the phone and accept the USB authorization prompt. |
| `offline` | Transport not ready; check the cable, reconnect, and test again. |
| *No entry* | Check the cable, USB connection mode (File Transfer/MTP), Linux `udev` permissions or Windows driver, and platform-tools installation. |

## 4. Interactive Device Picker vs. `--serial`

### Single Device
With one authorized device connected, `zkite run` and `zkite dev` select it automatically without prompting.

### Multiple Devices (Interactive Menu)
With multiple authorized devices connected in an interactive terminal:
* A selection menu displays connected device model names and serials.
* Use **Up / Down arrow keys** to navigate.
* Press **Enter** to connect.
* Press **Esc** or **Ctrl+C** to cancel.
*(Do not type numbers or yes/no).*

### Explicit CLI Selection & CI
In automated scripts, CI pipelines, or non-interactive terminals, pass the device serial explicitly:

```bash
# Pass serial flag explicitly
zkite run --serial DEVICE_SERIAL
zkite dev --serial DEVICE_SERIAL

# Or use the environment variable
export ANDROID_SERIAL=DEVICE_SERIAL
```

An explicit `--serial` always takes precedence over `ANDROID_SERIAL`.

### Custom ADB Path
If multiple copies of adb are installed on your machine, pass `--adb`:

```bash
zkite dev --adb /path/to/platform-tools/adb
```
