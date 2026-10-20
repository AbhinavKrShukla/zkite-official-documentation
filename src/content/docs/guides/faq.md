---
title: Frequently Asked Questions
description: Answers to common developer questions about ZKite architecture, builds, and development.
---

### Do I need to run `zkite dev` before `zkite run`?
No. `zkite run` builds, installs, and launches a standalone application by itself without requiring a prior development preview session.

### Does the finished app need Python installed on the phone?
No. ZKite bundles a lightweight CPython 3.14 native runtime directly inside the application APK. End-users install your application like any standard Android app.

### Is the native app a website in a shell?
No. The default and supported ZKite architecture uses **native Android rendering**. Layouts, views, and touch events are drawn directly through Android hardware-accelerated platform canvas and views, not an embedded web browser or DOM.

### Can I use every Python package from PyPI?
No. You can use compatible pure-Python dependencies (such as `requests`, `pydantic`, `jinja2`). Packages requiring desktop compiled C extensions (like desktop `numpy` or `scipy`) cannot be bundled without Android cross-compilation.

### Can I organize my project into nested subfolders?
* **For Assets**: Yes! In ZKite 1.1.1 & 1.1.0, the `assets/` folder is packaged recursively (e.g. `assets/images/logo.png`, `assets/fonts/`).
* **For Code**: Top-level helper `.py` modules beside `main.py` are packaged automatically. Arbitrary nested Python packages are not automatically staged in this release.

### Why is there both a development app and a normal app on my device?
The development preview (`zkite dev`) uses a distinct package identifier and data sandbox so that active development does not overwrite or corrupt data in your installed standalone app.

### Why did a store value disappear after restarting the app?
`@store` state is in-memory process state. Data that must survive app termination and device reboots requires deliberate persistence (e.g. JSON files or SQLite).

### Why does the top bar remain white with a dark screen?
The application's screen background and Android system bars are separate layers. Wrap your root screen widget in [`SystemBars`](/widgets/system-bars/) and configure explicit hex colors.

### Can I change the battery icon or replace Android navigation?
No. `SystemBars` styles the backgrounds and icon contrast mode of the surrounding bars; it does not replace the operating system's indicators or system navigation gestures.

### Why does changing an icon not hot reload immediately?
App launcher icons are Android package resources compiled into the APK manifest. In 1.1.2, launcher icons use adaptive icon resources. Restart `zkite dev` or rerun `zkite run` so the preview or standalone APK is rebuilt with the new icon. Note that unlike launcher icons, dependency edits in `requirements.txt` or `pyproject.toml` *do* hot reload automatically!

### How do I run blocking network or file calls without freezing the UI?
Use the module-level [`Task`](/core-concepts/state-and-events/#background-io-with-the-task-api-new-in-112) API introduced in ZKite 1.1.2. It executes work across 4 managed background workers outside the UI thread and automatically pushes fresh UI frames with reactive `loading`, `data`, and `error` states.

### Can I build without connecting an Android phone?
Yes. Both `zkite build apk` and `zkite build aab` run completely offline without requiring a connected physical device or emulator, and automatically discover release keys in `keystore/`.

### Can I publish my finished mobile app to PyPI?
No. Pip distributes the desktop developer framework. Mobile end-users receive an APK or an Android App Bundle distributed through an Android app store.

### Do permissions get added automatically? (New in 1.2.0)
Yes. `zkite run`, `zkite build apk`, and `zkite build aab` statically inspect your Python source code for recognized device API calls and update `app.json` with `android.inferred_permissions`. When you delete the last reference to a device API, subsequent builds automatically prune that permission. For dynamic code or third-party libraries, declare permissions or capabilities explicitly.

### Does a valid APK/AAB guarantee Google Play acceptance? (New in 1.2.0)
No. ZKite's built-in manifest verification confirms technical correctness (such as valid `<uses-permission>` tags and optional hardware flags). However, Google Play acceptance requires completing Data Safety disclosures, providing a working Privacy Policy, and justifying any restricted permissions.

### Can I use the new device APIs on WebView or desktop? (New in 1.2.0)
The device bridge is implemented exclusively on the native Android backend. Device module imports are completely desktop-safe for linting, typing, and testing, but calling an Android-only device function on desktop or in the experimental WebView backend raises `DeviceUnavailable`.

### How do file and photo pickers access files without storage permissions? (New in 1.2.0)
ZKite uses Android's Storage Access Framework (SAF) and modern Photo Picker (API 33+). Instead of requiring broad storage permissions, Android presents a system dialog where the user selects specific documents or photos. The system then grants temporary, scoped URI access solely to those chosen files.

### Can I test deep links locally with hot reload? (New in 1.2.1)
Deep link URL patterns must be registered under `android.deep_links` in `app.json` and compiled into the Android manifest using `zkite run` or `zkite build`. Once installed on your device or emulator, you can test links via `adb shell am start` or by clicking links in other apps; your Python listener (`links.listen`) will receive incoming links live.

### Can I layer Python widgets directly on top of native video? (New in 1.2.1)
The Android native video surface is rendered by hardware above the Python view hierarchy. Standard Python widgets cannot paint on top of that video surface. To customize controls directly over the video, use the `control_style` configuration. To use pure Python controls (like `media.Controls`), render bounded video with `controls=False` and place your Python widgets outside the video rectangle or inside an `Overlay`.

### Should I upgrade only `zkite-framework`?
No. Always keep the CLI (`zkite`), the framework (`zkite-framework`), and the runtime payload (`zkite-payload`) at the exact same version:
```bash
pip install zkite==1.2.1
```
