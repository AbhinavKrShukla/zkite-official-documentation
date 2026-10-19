---
title: Development Cycle & Hot Reload
description: Master the difference between development previews and standalone runs, hot reload boundaries, and error behaviors.
---

ZKite offers two distinct workflows: **Development Preview** (`zkite dev`) for instant feedback during coding, and **Standalone Run** (`zkite run`) for independent app testing.

## Workflow Comparison

| Workflow | What It Is For | Requires Host Server? | Hot Reload? |
| :--- | :--- | :--- | :--- |
| `zkite dev` | Fast source-edit feedback and live synchronization on a connected device. | **Yes** (Runs while editing) | **Yes** (< 90ms) |
| `zkite run` | Builds, signs, installs, and launches a self-contained standalone app. | **No** (Runs independently) | No |
| `zkite build apk` | Generates installable `.apk` binary files for testing. | No | No |
| `zkite build aab` | Generates production `.aab` bundles for Google Play distribution. | No | No |

---

## 1. Development Preview (`zkite dev`)

When you run `zkite dev`:
1. ZKite prepares and installs a preview build on the selected device under a **separate development package identity**.
2. It displays your project icon with a development label. Having two launcher entries on your phone (the dev preview and the standalone app) is expected.
3. It watches your supported Python source files and synchronizes changes over ADB.
4. Stop the session at any time with **Ctrl+C**.

```bash
# Start live development preview
zkite dev

# Use custom port if default (8765) is busy
zkite dev --port 9000
```

---

## 2. Standalone Run (`zkite run`)

When you run `zkite run`:
1. ZKite compiles an APK tailored for your device architecture, signs it with the local project key (`.zkite/debug.pem`), installs it, and launches it.
2. The application is completely autonomous: you can unplug the USB cable and run the app anywhere.

```bash
# Build, install, and launch standalone app
zkite run

# Follow Android system logs and Python stdout in your terminal
zkite run --logs
```

---

## What Hot Reload Does and Does Not Reload

Understanding reload boundaries avoids confusion during development:

### Automatically Synchronized via Hot Reload (1.1.1):
* Layout, styling utility classes, and widget hierarchy modifications.
* Event callbacks and helper functions in top-level `.py` modules.
* State values: compatible store fields retain their values across reloads; newly added fields take their declared defaults.
* **Background Tasks (New in 1.1.2)**: A successful hot reload automatically cancels outstanding in-flight `Task` results, preventing obsolete network or I/O responses from updating newly edited components.
* **Dependencies**: Adding, modifying, or removing pure-Python dependencies in `requirements.txt` or `pyproject.toml` automatically re-resolves and synchronizes packages to the device live without restarting `zkite dev`. Resolved packages are cached under `.zkite/dev-dependencies`.

### Requires Restarting `zkite dev`:
* Android permissions, package identifier, and app label changes in `app.json`.
* Replacing the app launcher icon file or adaptive icon resources.
* Launcher resources requiring a freshly prepared preview package.

---

## Error Handling: Dev Preview vs. Standalone

ZKite 1.1.2 provides differentiated error handling between development and release:

* **In `zkite dev`**: Uncaught exceptions during startup, view rendering, or event callbacks display detailed, interactive on-screen error overlays with Python tracebacks. Framework errors provide actionable entry-point guidance without exposing internal planning-document paths. If a dependency declaration change fails to resolve, `zkite dev` reports the error and leaves the existing app running.
* **In Standalone APK / AAB**: Uncaught exceptions display a clean, user-friendly restart screen rather than exposing raw developer tracebacks on the mobile display.
* **Diagnostic Logs**: In all modes, full tracebacks and diagnostic logs are written to Android logcat and can be streamed in your terminal using `zkite run --logs`.
