---
title: Frequently Asked Questions
description: Answers to common developer questions about ZKite architecture, builds, and development.
---

### Do I need to run `zkite dev` before `zkite run`?
No. `zkite run` is a standalone command that compiles, installs, and launches your application directly without requiring a preceding development preview session.

### Does the finished Android app need Python installed on the phone?
No. ZKite bundles a lightweight CPython 3.14 native runtime directly inside the compiled APK. End-users install your application like any standard Android app from an APK or app store.

### Is the app a website inside a WebView wrapper?
No. The default and supported ZKite architecture uses **native Android rendering**. Layouts, views, and touch events are processed directly through native Android UI views, not an embedded web browser.

### Can I install and use any Python package from PyPI?
You can use pure-Python packages (e.g. `requests`, `pydantic`, `jinja2`). Packages requiring compiled C extensions specifically compiled for desktop Windows or Linux cannot be copied into an Android environment without Android-specific compilation.

### Can I organize my project into nested subfolders?
In ZKite 1.0.0, application source modules and asset images must reside at the root of your project directory beside `main.py` for automatic packaging into the Android build bundle.

### Why does my phone show both a development app and a normal app?
The development preview (`zkite dev`) uses a distinct package identifier and data sandbox so that active development does not overwrite or corrupt data in your installed standalone app.

### Why do store values reset after closing the app?
`Store` state is purely in-memory. For values that must persist across app terminations and reboots, write them to local files (such as JSON) or an SQLite database.

### Why does the Android status bar remain white on a dark screen?
The application's screen background and the Android OS status bar are separate layers. Wrap your root widget in [`SystemBars`](/widgets/system-bars/) with `status_color="#0b0f19"` and `status_icons="light"` to match your theme.

### Can I build an APK without having a phone plugged in?
Yes! Use `zkite build apk` or `zkite build aab`. Build commands do not require a connected physical device or emulator.
