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
5. *(Optional but recommended)*: Enable **Stay Awake** while charging to keep the screen active during development sessions.

## 2. Connect and Authorize USB Debugging

1. Plug your phone into your computer using a quality data cable (a charging-only cable will not show data transport).
2. Unlock your phone.
3. A modal dialog will appear on your phone:
   > **Allow USB debugging?**
   > Computer's RSA key fingerprint: `xx:xx:...`
4. Check **"Always allow from this computer"** and tap **Allow**.

## 3. Verify Connection in the Terminal

Run the following command in your terminal:

```bash
adb devices
```

You should see your device listed as `device`:

```text
List of devices attached
35291FDJ2000AB    device
```

:::caution[Troubleshooting Device States]
* If it says `unauthorized`: Unlock your phone and accept the USB authorization dialog.
* If the list is empty:
  * On Linux: Ensure your user has permissions for `/dev/bus/usb` (add appropriate `udev` rules).
  * On Windows: Open Device Manager and install your phone manufacturer's ADB USB driver.
:::

## 4. Selecting Multiple Devices

If you have both a physical phone and an emulator running simultaneously:

```bash
# Explicitly choose target device using its serial ID
zkite dev --serial 35291FDJ2000AB

# Or set an environment variable
export ANDROID_SERIAL=35291FDJ2000AB
```
