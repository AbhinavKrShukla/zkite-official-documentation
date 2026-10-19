---
title: What's New in 1.2.0 & Migration Guide
description: Comprehensive overview of new features, bug fixes, device APIs, and performance improvements across ZKite 1.2.0, 1.1.2, 1.1.1, 1.1.0, and 1.0.0.
---

ZKite **1.2.0** is a major milestone release that elevates ZKite from a declarative UI renderer to a full-featured native Android application platform. It introduces comprehensive **device services** in pure Python—file/photo picking, streaming multipart uploads, external camera/video capture, flashlight torch control, AAC microphone recording, media audio playback with focus handling, Android text-to-speech, semantic haptics and vibration patterns, 8 hardware sensor streams, system sharing, clipboard, device & battery info, foreground location, local notifications, hardware-backed Keystore encrypted secrets, and biometric authentication.

It also introduces **automatic permission scanning** without executing code, compiled **APK/AAB manifest verification**, and the **Device Lab** reference app.

---

## Evolution: 1.0.0 vs. 1.1.0 vs. 1.1.1 vs. 1.1.2 vs. 1.2.0

| Feature / Area | ZKite 1.0.0 / 1.1.0 | ZKite 1.1.1 | ZKite 1.1.2 | ZKite 1.2.0 (Latest) |
| :--- | :--- | :--- | :--- | :--- |
| **Device Services** | None | None | None | **Native Python Device Services**: Files, camera, mic, audio, haptics, sensors, share, clipboard, location, notifications, secrets, biometrics |
| **Permission Management** | Manual declarations in `app.json` | Manual declarations in `app.json` | Manual declarations in `app.json` | **Automatic Permissions Scanner**: Static Python analysis, `inferred_permissions`, `capabilities`, auto-pruning, and `.zkite/permissions.json` |
| **Platform Manifest Verification** | None | None | None | **Built-in Rust Binary XML Validator**: Verifies `<uses-permission>` tags in signed APKs and AABs before saving output |
| **Async Operations & I/O** | Manual threads | Manual threads | Nonblocking `Task` API (4 workers) | **First-Class `async def` Handlers**: Nonblocking background loop, atomic `state.update()`, and typed `DeviceError` hierarchy |
| **Files & Storage** | Local project assets only | Local project assets only | Local project assets only | **SAF & Photo Picker**: `FileRef`, `copy_to()`, `local_copy()`, persistent URIs, `data_dir()`, `cache_dir()`, and atomic `files.save()` |
| **HTTP File Uploads** | Standard synchronous requests | Standard synchronous requests | Standard synchronous requests | **Streaming Multipart `network.upload`**: Bounded memory, progress callbacks, TLS verification, max 4 concurrent streams |
| **Camera & Microphone** | None | None | None | **Full-Resolution Intent Capture**: Photos, video, torch control, and AAC/M4A microphone recording with duration bounds |
| **Audio & Haptics** | None | None | None | **MediaPlayer & Haptics**: Local/FileRef playback, audio focus handling, Android TTS, semantic feedback & custom vibration patterns |
| **Hardware Sensors** | None | None | None | **8 Live Sensor Streams**: Accelerometer, gyro, rotation vector, light, proximity, magnetometer, shake (1–100 Hz, monotonic timestamps) |
| **Security & Secrets** | None | None | None | **Hardware Keystore AES-GCM**: App-owned 256-bit encrypted secrets (up to 16 KiB) and `BiometricPrompt` authentication |
| **Tab Navigation** | None | None | Controlled `Tabs` with swipe physics | Preserved scroll offsets, peer swiping, and gesture momentum |
| **Text & Overflow** | Basic text | First-press toolbar, UTF-16 cursor | Overflow controls (`ellipsis`/`clip`), wrap, Noto color emoji | Unicode grapheme clusters, full color emoji, and auto-inferred remote image network permissions |
| **Scaffold (`new`)** | Basic counter | Basic counter | Interactive Discover/Playground | Interactive Discover/Playground + Device Lab testing example |

---

## 1. What's New in ZKite 1.2.0

### Automatic Permissions Inference & Manifest Verification
Building (`zkite build apk`/`aab`) or running (`zkite run`) now statically scans your project's Python code **without running it**, automatically declaring permissions in `app.json`:
* **Ownership Model**: Scanned permissions are tracked under `android.inferred_permissions`. Removing a feature from Python automatically prunes that permission from the manifest.
* **Preserves Manual Entries**: Manual entries in `android.permissions` remain intact.
* **Compiled Manifest Checking**: ZKite parses the compiled binary `AndroidManifest.xml` in APKs and `base/manifest/AndroidManifest.xml` in AABs using an internal Rust parser, checking namespace encodings, verifying direct children rules, and rejecting duplicate declarations.
* **Play Store Safety**: Camera, autofocus, microphone, and location hardware features are tagged as `android:required="false"` to prevent unintentional Google Play device filtering.

### Nonblocking Async Event Handlers & Typed Error Hierarchy
Event handlers support `async def`, running on a background async loop so system dialogs and file pickers never stutter UI rendering:
* **Atomic State Commits**: `state.update()` is thread-safe and atomic with respect to the render lock.
* **Typed Exceptions**: Catch `DeviceError` subclasses like `PermissionDenied`, `PermissionNotDeclared`, `UnsupportedFeature`, `ResourceBusy`, `DeviceUnavailable`, and `OperationInterrupted`.
* **Concurrency Guards**: Maximum 64 event coroutines, 32 pending Android requests, 16 sensor subscriptions, and 8 audio handles.

### File Selection, Persistent Storage & Streaming Uploads
* **Native Pickers**: `files.pick()`, `files.pick_many()`, and privacy-preserving Android 13+ `files.pick_photo()` without broad storage permissions.
* **Materialization**: `FileRef.copy_to()` with atomic destination replacement and `FileRef.local_copy()` async context manager.
* **Streaming Multipart Uploads**: `network.upload()` streams multipart requests with throttled `on_progress(sent, total)` callbacks and fixed memory buffers.

### Camera, Torch & AAC Audio Recording
* **Camera Capture**: Delegated to the user's native camera app for full-resolution photos and videos.
* **Flashlight Torch**: `camera.torch(True/False)` with auto-off when backgrounded.
* **Microphone Recording**: `audio.record(max_seconds=60)` records high-quality AAC/M4A audio with foreground lifecycle tracking.

### Audio Playback, Text-to-Speech & Haptics
* **Audio Playback**: `audio.play()` supports pause, seek, resume, stop, and handles audio focus loss and headphone disconnects.
* **Text-to-Speech**: `audio.speak()` speaks text using Android's installed speech synthesis engines.
* **Semantic Haptics**: `haptics.perform()` delivers click, confirm, reject, long-press, and keyboard feedback without needing manifest permissions.
* **Custom Vibrations**: `haptics.vibrate()` supports duration pulses and custom timing patterns up to 10 seconds.

### 8 Hardware Sensor Streams
Subscribe to real-time streams at 1–100 Hz:
* Accelerometer, linear acceleration, gyroscope, 3D rotation vector, magnetometer, ambient light, proximity, and shake detection.
* Samples include monotonic timestamps, sensor accuracy, and dropped sample counters.
* Auto-pauses in background and auto-closes on hot reload.

### System Integrations, Encrypted Secrets & Biometrics
* **System Chooser**: `share.send()` for text, URLs, and files.
* **Clipboard**: Async `clipboard.read()` and `clipboard.write()`.
* **Hardware & Status**: `device.info()`, `device.battery()`, `device.network()`, `device.open_url()`, and `device.keep_awake()`.
* **Foreground Location**: Single-fix GPS/cellular location without Google Play Services.
* **Local Notifications**: Android notification channels with `notifications.show()`.
* **Hardware Keystore Secrets**: AES-256-GCM encrypted values (up to 16 KiB) stored in Android's `no_backup` directory.
* **Biometric Authentication**: Official Android `BiometricPrompt` fingerprint and face unlock.

### Device Lab Reference Application
Test every device feature on physical hardware without external dependencies using `examples/device_lab` and `adb reverse` local upload testing.

---

## 2. Key Features from 1.1.2, 1.1.1 & 1.1.0

* **Nonblocking `Task` API (1.1.2)**: Module-level background worker queue for synchronous I/O.
* **Controlled `Tabs` Widget (1.1.2)**: Horizontal peer swiping with velocity momentum and preserved scroll offsets.
* **Text Overflow & Color Emoji (1.1.2)**: `wrap`, `multiline`, `max_lines`, `overflow="ellipsis"`, and native Noto color emoji.
* **Live Dev Dependency Sync (1.1.1)**: Instant package synchronization on file save.
* **Screen Transitions (1.1.1)**: Smooth 160ms slide-and-fade navigation transitions.
* **`app.json` Configuration (1.1.0)**: Declarative mobile identity, package name, version codes, and permissions.
* **Native HTTPS Image Loader (1.1.0)**: Asynchronous verified TLS image loading with automatic caching.

---

## Upgrading Your Project to 1.2.0

### 1. Upgrade the CLI
Install the 1.2.0 release in your active Python 3.14 virtual environment:
```bash
pip install --upgrade zkite==1.2.0
```

On Windows (PowerShell):
```powershell
.\.venv\Scripts\python.exe -m pip install --upgrade zkite==1.2.0
```

### 2. Verify Your Environment
```bash
zkite --version
# Output: zkite 1.2.0

# Verify matching framework and payload packages
python -m pip show zkite zkite-framework zkite-payload
```

### 3. Review `app.json` Permissions
When you run `zkite run` or `zkite build apk`, ZKite will inspect your Python code and update `app.json` with `android.inferred_permissions`. Review the changes and commit `app.json` to your Git repository:

```bash
git diff app.json
```

If your code invokes device APIs dynamically, add explicit entries to `android.capabilities` or `android.permissions`.

:::tip[Archived Documentation Versions]
Looking for documentation for an earlier release?
* [ZKite 1.1.2 Documentation Archive](/v1-1-2/getting-started/overview/)
* [ZKite 1.1.1 Documentation Archive](/v1-1-1/getting-started/overview/)
* [ZKite 1.1.0 Documentation Archive](/v1-1-0/getting-started/overview/)
* [ZKite 1.0.0 Documentation Archive](/v1-0-0/getting-started/overview/)
:::
