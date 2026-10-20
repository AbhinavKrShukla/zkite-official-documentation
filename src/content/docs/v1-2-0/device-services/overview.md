---
title: Device Services & Permissions
description: Native Android device integration in pure Python, static permission inference, APK/AAB manifest verification, and desktop-safe imports.
---

ZKite 1.2.0 exposes native Android device operations as ordinary Python modules under the `zkite` namespace. You can capture photos, record audio, query motion sensors, read/write the clipboard, vibrate the device, access encrypted Keystore secrets, and present biometric prompts directly from declarative Python—without writing any Java, Kotlin, Gradle, Android SDK, or JNI code.

---

## Architecture & Desktop Safety

The device bridge is implemented natively within the pre-compiled Android engine:

* **Pure Python API**: Import device services directly from `zkite`:
  ```python
  from zkite import (
      audio,
      biometrics,
      camera,
      clipboard,
      device,
      files,
      haptics,
      location,
      network,
      notifications,
      secrets,
      sensors,
      share,
  )
  ```
* **Desktop-Safe Imports**: Importing device modules on your development computer (macOS, Linux, or Windows) is completely safe. This ensures linters, type checkers, unit tests, and IDE tooling function smoothly. Calling an Android-only operation on desktop raises a clean `zkite.errors.DeviceUnavailable` exception.
* **Native Backend Only**: Device integration is supported on the primary native Android backend. The experimental WebView backend does not implement the device bridge.

---

## Automatic Permissions Scanner

Starting in ZKite 1.2.0, build and development commands (`zkite run`, `zkite build apk`, `zkite build aab`, and preview preparation) statically analyze your project's Python source **without executing it**, automatically synchronizing required Android permissions into `app.json` before packaging.

### How It Works

Suppose your application imports audio and haptic feedback:

```python
from zkite import audio, haptics

async def start_recording():
    recording = await audio.record()
    await haptics.vibrate(duration_ms=80)
    return recording
```

During build or run preparation, ZKite's static scanner identifies the usage of `audio.record()` and `haptics.vibrate()` and updates `app.json`:

```json title="app.json"
{
  "android": {
    "permissions": ["RECORD_AUDIO", "VIBRATE"],
    "inferred_permissions": ["RECORD_AUDIO", "VIBRATE"]
  }
}
```

### Permission Ownership & Pruning

* **`permissions`**: Contains all manifest permission declarations (both manually declared and automatically inferred).
* **`inferred_permissions`**: Records permissions managed by the automatic scanner.
* **Automatic Pruning**: When you remove the last detected code reference to a device API, subsequent builds automatically prune that permission from both `permissions` and `inferred_permissions`.
* **Retaining a Permission Manually**: If you want to keep a permission permanently even if the scanner does not detect direct usage, keep it in `permissions` and remove it from `inferred_permissions`.
* **Version Control**: Commit `app.json` to Git so that changes to inferred and manual permissions are clearly reviewable in pull requests.
* **Safe Rewrites**: A failed parse leaves `app.json` completely untouched. If `app.json` is being edited concurrently, an explicit error is raised rather than overwriting changes. Scans with no changes do not touch the file.

### Diagnostic Reporting

Each scan prints the detection reasons to the terminal and records an auditable report to `.zkite/permissions.json`. The scanner detects:
* Standard imports and module aliases (`import zkite.audio as snd`)
* Local re-exports and function references
* Literal `getattr()` lookups and nested imports
* Remote `Image` URL sources (infers `INTERNET`)
* Common Python HTTP clients (such as `requests`, `urllib`, `httpx`, and `aiohttp`)

---

## Explicit Capabilities

The static scanner is intentionally conservative: it inspects code branches and functions without proving runtime reachability. However, it cannot deduce dynamic runtime behavior, such as reflection, `eval()`, dynamic imports, or third-party libraries calling platform APIs under the hood.

For these cases, declare explicit capabilities or permissions in `app.json`:

```json title="app.json"
{
  "android": {
    "capabilities": ["audio.record", "location", "notifications"],
    "permissions": ["INTERNET"]
  }
}
```

### Supported Capabilities

| Capability Name | Triggered Permissions / Hardware |
| :--- | :--- |
| `files` | System file & photo picking (no broad storage required) |
| `camera.capture` | External camera intent delegation |
| `camera.torch` | Flashlight / camera torch toggle |
| `audio.record` | `RECORD_AUDIO` |
| `audio.play` | Android MediaPlayer integration |
| `haptics` | `VIBRATE` (for custom patterns) |
| `sensors` | Accelerometer, gyroscope, orientation, light, proximity |
| `share` | Android system share chooser |
| `clipboard` | System clipboard read/write |
| `device` | System device info, battery, keep-awake |
| `network` | `INTERNET` |
| `location` | `ACCESS_COARSE_LOCATION` / `ACCESS_FINE_LOCATION` |
| `notifications` | `POST_NOTIFICATIONS` (Android 13+) |
| `secrets` | App-owned Android Keystore AES-GCM encrypted storage |
| `biometrics` | Android `BiometricPrompt` authentication |

---

## Runtime Consent vs. Manifest Declarations

Declaring a permission in the manifest is only the first step:

* **Normal Permissions** (such as `INTERNET`): Automatically granted at installation time without runtime prompts.
* **Dangerous Permissions** (such as `RECORD_AUDIO`, location, camera, or `POST_NOTIFICATIONS`): Require explicit runtime consent from the user.
* **Contextual Prompts**: ZKite device services automatically trigger Android's standard runtime permission dialog right when the API is invoked.
* **Graceful Handling**: If the user denies a permission request, ZKite raises a typed `PermissionDenied` exception instead of crashing your app. You can catch this exception and guide the user in your UI.
* **Granular Scoping**: Photo/file pickers, system camera capture, and semantic haptics do not require broad storage or system permissions; ZKite uses privacy-preserving Android system pickers and intents.

---

## Compiled Manifest Verification in APK & AAB

To ensure that distribution packages adhere strictly to Android platform and Google Play policies, ZKite performs post-signing manifest verification:

* **Built-in Rust Parser**: ZKite parses the compiled binary XML manifest directly from the signed package—inspecting `AndroidManifest.xml` in APKs and `base/manifest/AndroidManifest.xml` in AABs. No external Java SDK or aapt tools are required.
* **Structure Validation**: Verifies that `<uses-permission>` tags are direct children of `<manifest>`, checks resource encoding and namespaces, and rejects duplicate permission declarations.
* **Config Matching**: Compares compiled permissions against the resolved permissions in `app.json`.
* **Hardware Tagging**: To prevent Google Play from unintentionally filtering out devices that lack specific sensors or hardware, ZKite marks camera, autofocus, microphone, and location hardware features as optional (`android:required="false"`) in the manifest.

:::caution[Store Policy Compliance]
Manifest verification ensures technical compliance with Android's binary package format. It is not an approval guarantee from Google Play. You must still provide an accurate Privacy Policy, complete Google Play Data Safety forms, and declare any restricted permissions in the Play Console according to your actual app behavior.
:::
