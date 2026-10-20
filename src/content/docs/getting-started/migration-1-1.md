---
title: What's New in 1.2.1 & Migration Guide
description: Comprehensive overview of new features, bug fixes, device APIs, and performance improvements across ZKite 1.2.1, 1.2.0, 1.1.2, 1.1.1, 1.1.0, and 1.0.0.
---

ZKite **1.2.1** builds directly upon the comprehensive native device services platform introduced in 1.2.0. It adds native **deep links and verified HTTPS Android App Links**, **hardware video playback with customizable native overlays and pure Python controls**, **unbounded audio playback** with the removal of sample timer cutoffs, **fullscreen video**, and streamlined media controls.

---

## Evolution: 1.0.0 through 1.2.1

| Feature / Area | ZKite 1.0.0 – 1.1.2 | ZKite 1.2.0 | ZKite 1.2.1 (Latest) |
| :--- | :--- | :--- | :--- |
| **Deep Links & App Links** | None | None | **Native Deep Links & App Links**: `zkite.links` (`listen`, `create`, `next_link`), `app.json` `deep_links`, custom schemes & verified HTTPS App Links, 32-link queue, singleTask launch |
| **Media Playback** | Basic sound effects | Native audio player (`audio.play`), audio focus, TTS, haptics | **Audio & Video Playback (`audio`, `video`)**: Unbounded audio, native video with `control_style`, fullscreen mode, pure Python `media.Controls`, removed demo 2s cutoff |
| **Device Services** | None | Files, camera, mic, haptics, sensors, share, clipboard, location, notifications, secrets, biometrics | Preserved and expanded with deep links and video playback |
| **Permission Management** | Manual declarations in `app.json` | Automatic static analysis scanner, `inferred_permissions`, auto-pruning | Extended: auto-infers `INTERNET` for remote video/audio HTTP(S) streams |
| **Async Operations & I/O** | Threads / `Task` API | First-class `async def` event handlers, background loop, atomic `state.update()` | Async event loop with cancellable `links.listen()` and `player.watch()` |
| **Tab Navigation** | None (1.0) / Tabs (1.1.2) | Preserved scroll offsets, peer swiping, gesture momentum | Preserved scroll offsets, peer swiping, gesture momentum |
| **Scaffold (`new`)** | Basic counter / Discover | Discover + Device Lab testing example | Discover + Device Lab (updated for continuous audio) + Media player example |

---

## 1. What's New in ZKite 1.2.1

### Native Deep Links & Verified HTTPS App Links
ZKite 1.2.1 connects Android URL intents directly to reactive Python state stores:
* **Declarative Manifest Configuration**: Register custom schemes (`myapp://open/...`) or verified HTTPS App Links (`https://app.yourdomain.com/...`) under `android.deep_links` in `app.json`.
* **Reactive Link Listener (`links.listen`)**: Register a sync or `async def` callback once at module scope. Annotated state stores are automatically injected.
* **Link Dataclass**: `Link` provides `url`, `scheme`, `host`, `path`, and parsed `query` dictionary.
* **Safe Encoding & Sharing**: `links.create()` encodes paths and query parameters, ready to dispatch via `zkite.share.send()`.
* **SingleTask Mode & Buffer**: Apps launch in Android `singleTask` mode, buffering up to 32 links across cold launches and runtime `onNewIntent` events.

### Native Video Playback & Immersive Fullscreen
* **Hardware-Accelerated Video (`video.play`)**: Play local files, assets, `FileRef` pickers, or HTTP(S) video streams with native Android decoders.
* **Fullscreen Support**: Launch in fullscreen with `bounds=None`, toggle programmatically with `await player.fullscreen(True/False)`, or use the overlay's **Fullscreen** button. Tap **Exit fullscreen** or the Android Back button to restore previous bounds and system bars.
* **Fit Modes**: Configure aspect-ratio behavior with `fit="contain"` (letterbox), `"cover"` (crop), or `"fill"` (stretch).

### Customizable Native Controls Overlay
* **Unobtrusive Design**: Native video overlay intentionally contains no video title.
* **Custom Styling (`control_style`)**: Configure accent colors, foreground/background colors, text size (8–72sp), padding (0–100dp), placement (top/bottom), auto-hide timer, skip seconds, and toggle visibility for time, seek, skip, mute, speed, close, and fullscreen controls.
* Set `controls=False` to completely remove native overlays when rendering custom Python widgets.

### Pure Python UI Controls (`media.Controls`)
* **Flexible Composition**: Use `zkite.media.Controls` directly in your Python view tree or within floating `Overlay` sheets.
* **Modular Parts**: Enable or reorder parts: `"status"`, `"time"`, `"seek"`, `"buttons"`, `"volume"`, `"speed"`, `"loop"`, and `"fullscreen"`.
* **Live Progress Tracking**: `player.watch(callback, interval=0.25)` streams progress snapshots to your state store with automatic hot-reload cleanup.

### Unbounded Audio & Device Lab Enhancement
* **No Artificial Cutoffs**: Audio playback now continues seamlessly until track completion, manual stop, or OS interruption. The 2-second sample cutoff from earlier Device Lab demos has been completely removed.
* **Detailed Interruption Reasons**: Player state distinguishes `user`, `background`, `route_disconnected`, `focus_transient`, `focus_lost`, and `surface_lost`.

---

## 2. Key Features from 1.2.0 and Earlier

* **Native Device Services (1.2.0)**: SAF file and photo pickers (`files.pick`, `files.pick_photo`), external camera capture, AAC mic recording, 8 hardware sensors (1–100 Hz), Android Keystore AES-256 encrypted secrets, and `BiometricPrompt` authentication.
* **Automatic Permissions Scanner (1.2.0)**: Static Python code analysis automatically tracks and prunes Android permissions under `android.inferred_permissions`.
* **Compiled Manifest Verification (1.2.0)**: Built-in binary XML validator inspects signed APKs and AABs.
* **Streaming Multipart Uploads (1.2.0)**: `network.upload()` with bounded RAM and progress callbacks.
* **Controlled `Tabs` (1.1.2)**: Horizontal peer swiping with gesture momentum.
* **Text Overflow & Emoji (1.1.2)**: Grapheme clusters, Noto color emoji, `overflow="ellipsis"`.
* **Screen Transitions (1.1.1)**: Native 160ms slide-and-fade navigation transitions.

---

## Upgrading Your Project to 1.2.1

### 1. Upgrade the CLI
Install the 1.2.1 release in your active Python 3.14 virtual environment:
```bash
pip install --upgrade zkite==1.2.1
```

On Windows (PowerShell):
```powershell
.\.venv\Scripts\python.exe -m pip install --upgrade zkite==1.2.1
```

### 2. Verify Your Environment
```bash
zkite --version
# Output: zkite 1.2.1

# Verify matching framework and payload packages
python -m pip show zkite zkite-framework zkite-payload
```

### 3. Review `app.json` Configuration
If you adopt deep links, configure `android.deep_links` in `app.json` and rebuild the application:
```bash
zkite run
```

:::tip[Archived Documentation Versions]
Looking for documentation for an earlier release?
* [ZKite 1.2.0 Documentation Archive](/v1-2-0/getting-started/overview/)
* [ZKite 1.1.2 Documentation Archive](/v1-1-2/getting-started/overview/)
* [ZKite 1.1.1 Documentation Archive](/v1-1-1/getting-started/overview/)
* [ZKite 1.1.0 Documentation Archive](/v1-1-0/getting-started/overview/)
* [ZKite 1.0.0 Documentation Archive](/v1-0-0/getting-started/overview/)
:::
