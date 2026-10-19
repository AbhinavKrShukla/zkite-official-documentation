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

### Should I upgrade only `zkite-framework`?
No. Always keep the CLI (`zkite`), the framework (`zkite-framework`), and the runtime payload (`zkite-payload`) at the exact same version:
```bash
pip install zkite==1.1.2
```
