---
title: Camera & Microphone
description: Full-resolution system camera capture, video recording, flashlight torch control, and AAC/M4A audio recording.
---

ZKite 1.2.0 enables native multimedia capture without requiring camera boilerplate or custom Java classes. Capture full-resolution photos, record videos, control the hardware torch, and record microphone audio with duration limits.

---

## Taking Photos & Videos

To capture photos or videos, ZKite delegates capture to the user's preferred installed Android camera application:

```python
from zkite import camera

# 1. Take a full-resolution photo
photo = await camera.capture()
if photo:
    print(f"Captured photo: {photo.name} ({photo.size} bytes)")
    # Captured photo resides in files.cache_dir(); copy if permanent:
    # await photo.copy_to(permanent_path)

# 2. Record a video with an optional maximum duration limit
video = await camera.record_video(duration=30)
if video:
    print(f"Captured video clip: {video.name}")
```

### Advantages of Intent-Based Capture

* **Full Sensor Resolution**: ZKite provides the camera app with a temporary output file URI, ensuring the camera delivers the full optical sensor resolution—not an impoverished thumbnail.
* **Familiar User Controls**: Users enjoy their phone's native camera features (HDR, optical zoom, flash control, night mode, portrait blur) without any implementation complexity in your app.
* **No `CAMERA` Manifest Permission Required**: Because capture is delegated to the system camera app via standard Android intents, your app does **not** need the dangerous `android.permission.CAMERA` manifest permission.

---

## Flashlight Torch Control

Control the device's rear flashlight through `camera.torch`:

```python
from zkite import camera

# Turn flashlight on
await camera.torch(True)

# Turn flashlight off
await camera.torch(False)
```

* **Automatic Cleanup**: For safety and battery conservation, the flashlight turns off automatically when your app leaves the foreground.
* **Hardware Detection**: If the device lacks a camera flash, calling `camera.torch(True)` raises `UnsupportedFeature`.

---

## Microphone Recording

Record voice notes, interviews, or memos using Android's hardware audio encoder:

```python
from zkite import audio
from zkite.errors import DeviceError, PermissionDenied

async def record_voice_clip():
    try:
        # Starts recording in AAC/M4A format
        recording = await audio.record(max_seconds=60)
        
        # ... user performs action or taps 'Stop' ...
        
        # Stop and finalize recording into a FileRef
        clip = await recording.stop()
        print(f"Audio saved to: {clip.path}")
        return clip
    except PermissionDenied:
        print("Microphone access was denied by the user")
    except DeviceError as exc:
        print(f"Recording error: {exc}")
```

### Discarding a Recording

To cancel and discard an active recording without saving:

```python
await recording.cancel()
```

### Recording Lifecycle & Constraints

* **Audio Format**: Recorded using the platform-standard AAC encoder packaged in an MPEG-4 (`.m4a`) container.
* **Automatic Permissions**: Using `audio.record()` causes the static scanner to declare `RECORD_AUDIO` in `app.json` and triggers Android's runtime microphone permission prompt.
* **Foreground Lifecycle**: Audio recording automatically terminates if the application is backgrounded or when another app assumes microphone focus.
* **Minimum Duration**: Extremely short recordings (&lt; 0.2s) or aborted recordings raise a descriptive `DeviceError`.
* **Privacy Indicators**: Android 12+ green status bar privacy indicators and system microphone toggles are fully respected. If the user disabled microphone access in global system settings, `ResourceBusy` or `PermissionDenied` is raised.

:::note[Current Scope Limitations]
In ZKite 1.2.0, inline viewfinder camera previews (`CameraPreview` widget), raw PCM byte streams, and background audio recording services are not included.
:::
