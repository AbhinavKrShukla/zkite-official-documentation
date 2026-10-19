---
title: Device Lab Testing
description: Test and verify all native device services on physical hardware using the self-contained Device Lab application.
---

ZKite includes a comprehensive, self-contained reference application: **Device Lab**. It exercises every device API—permissions, pickers, camera, microphone, audio playback, sensors, location, biometric authentication, and encrypted storage—without third-party dependencies.

---

## Running Device Lab

Device Lab is located in the official ZKite repository under `examples/device_lab`.

```bash
# Clone the repository (if not already local)
git clone https://github.com/AbhinavKrShukla/zkite.git
cd zkite/examples/device_lab

# Connect your Android phone via USB and run
zkite run
```

`zkite run` scans the Python code, automatically infers required permissions in `app.json`, builds a development APK, verifies the manifest, installs it to your device over ADB, and launches the application.

---

## Testing File Uploads Locally

Device Lab contains a test button to stream a selected file over multipart HTTP. To test uploads without a remote cloud server:

1. **Start a local HTTP echo server** on your computer on port `8769`:
   ```bash
   python -m http.server 8769
   ```

2. **Reverse the port over ADB** so your connected Android phone routes requests to `localhost:8769` directly to your computer:
   ```bash
   adb reverse tcp:8769 tcp:8769
   ```

3. Tap **Upload Test** inside Device Lab. The upload streams over ADB with live progress updates.

---

## Device Qualification Checklist

When developing or certifying an application using device APIs, test these real-world mobile edge cases:

* **Permission Denial**: Tap "Don't allow" when prompted with microphone, camera, or location dialogs. Verify your UI displays a graceful message without crashing.
* **Picker Cancellation**: Launch the document or photo picker and immediately press the Android back button or gesture. Verify the operation returns `None` cleanly.
* **Hardware Availability**: Test on devices that lack specific sensors (such as an emulator without a magnetometer or gyro). Verify that `UnsupportedFeature` is handled gracefully.
* **Background & Resume**: Begin an audio recording or sensor stream, then press the home button or lock the screen. Verify the sensor stream pauses cleanly and resumes upon return.
* **Hot Reload Safety**: Edit Python code while an async device operation is running. Verify that in-flight coroutines are invalidated without corrupting application state.
