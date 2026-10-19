---
title: What's New in 1.1.2 & Migration Guide
description: Comprehensive overview of new features, bug fixes, and performance improvements across ZKite 1.1.2, 1.1.1, 1.1.0, and 1.0.0.
---

ZKite **1.1.2** is the latest stable release of the framework, introducing a new premium Discover/Playground starter template, the nonblocking `Task` background I/O API, adaptive momentum scrolling, granular text wrapping and line-overflow controls, full-bleed adaptive launcher icons and native color emoji, the controlled swipeable `Tabs` widget, Android-aware dependency markers and package extras, pure-Python ASGI server compatibility (Starlette and Uvicorn), and automatic release key discovery.

It builds directly upon **1.1.1** and **1.1.0** while maintaining backwards compatibility for existing projects.

---

## Evolution: 1.0.0 vs. 1.1.0 vs. 1.1.1 vs. 1.1.2

| Feature / Area | ZKite 1.0.0 | ZKite 1.1.0 | ZKite 1.1.1 | ZKite 1.1.2 (Latest) |
| :--- | :--- | :--- | :--- | :--- |
| **Starter Scaffold (`new`)** | Basic counter template | Basic counter template | Basic counter template | **Interactive Discover/Playground**: Orange-and-white theme, swipeable tabs, and state persistence |
| **Background I/O & Tasks** | Manual `threading.Thread` | Manual `threading.Thread` | Manual `threading.Thread` | **First-class `Task` API**: Module-level tasks, 4 managed workers, reactive `loading`/`data`/`error`, hot reload cancellation, stale result discard |
| **Tab Navigation** | None (Stack navigation only) | None | None | **Controlled `Tabs` Widget**: Multi-page horizontal swipe physics with velocity momentum, scroll offset retention, and CSS snap on web |
| **Text & Overflow** | Basic text rendering | Basic selection | First-press toolbar, UTF-16 cursor, keyboard tracking | **Overflow Controls & Emoji**: `wrap`, `multiline`, `max_lines`, `overflow="ellipsis"`, Noto color emojis & flag fallbacks |
| **Scrolling Physics** | Basic touch scrolling | Basic touch scrolling | Viewport hit isolation & scroll clamping | **Smooth Momentum**: Adaptive velocity- and density-aware spline curves, held-finger gesture cancellation, `min-h-0` flex sizing |
| **App Icons** | Flat PNG asset | `android.icon` in `app.json` | PNG resource packaging | **Full-Bleed Adaptive Icons**: Native Android adaptive icon resources without baked-in padding; auto-masked by system launchers |
| **Dependency Resolution** | Static build-time | Resolves on build | Live automatic dev sync cached in `.zkite/dev-dependencies` | **Android-Aware Markers & Extras**: Evaluates markers against Android target (`aarch64`/`x86_64`, CPython 3.14.6); package extras tracked |
| **ASGI Web Servers** | Not supported | Not supported | Not supported | **Pure-Python Servers**: Starlette & Uvicorn supported out of the box with `asyncio` and `h11` networking |
| **Release Signing Keys** | Manual `--keystore` flag | Manual `--keystore` flag | Manual `--keystore` flag | **Automatic Key Discovery**: Default keys under ignored `keystore/` folder; auto-created and reused by APK/AAB builds |
| **Framework Errors** | Tracebacks in all builds | Standalone release restart screen | Resilient dev reload diagnostics | **Actionable Public Errors**: Clean errors pointing to entry-point guidance without exposing internal planning-doc paths |

---

## 1. What's New in ZKite 1.1.2

### New Premium Starter Application
Running `zkite new myapp` creates an interactive orange-and-white Discover/Playground application with swipeable tabs and save interaction instead of a basic counter template. Creating or upgrading the framework preserves your existing application source files.

### Nonblocking API Calls with `Task`
Synchronous I/O operations inside `view()` or UI handlers block the main Android thread. ZKite 1.1.2 introduces the module-level `Task` API:

```python
import json
from urllib.request import urlopen
from zkite import Button, Column, Task, Text

request = Task()

def fetch_data():
    with urlopen("https://api.example.com/items", timeout=15) as res:
        return json.loads(res.read())

def view():
    return Column("flex-1 p-6 gap-4 bg-white",
        Button("bg-orange-600 text-white p-4 rounded-xl", "Fetch",
               on_tap=lambda: request.start(fetch_data), disabled=request.loading),
        Text("text-slate-800", "Loading…" if request.loading else str(request.data)),
        Text("text-red-600", str(request.error) if request.error else ""),
    )
```

* **4 Managed Workers**: Background jobs execute with a bounded queue limit of 32 jobs.
* **Reactive Frame Push**: Completion automatically updates `loading`, `data`, and `error` under the render lock and presents a new frame.
* **Automatic Invalidation**: Calling `request.start()` again invalidates earlier in-flight requests. Calling `cancel()` or performing a hot reload immediately discards stale results.
* **Data Continuity**: Previous successful data is preserved during refreshes or transient connection failures.

### Swipeable `Tabs` Widget
`Tabs` allows horizontal peer navigation with native velocity swipe physics:

```python
from zkite import ScrollView, Tabs, Text, store

@store
class Screen:
    tab: int = 0

def view(s: Screen):
    return Tabs(
        "flex-1",
        ScrollView("flex-1", Text("p-6", "Discover Page")),
        ScrollView("flex-1", Text("p-6", "Playground Page")),
        ScrollView("flex-1", Text("p-6", "Settings Page")),
        labels=["Discover", "Playground", "Settings"],
        index=s.tab,
        on_change=lambda index: s.update(tab=index),
        key="main-tabs",
    )
```

* **Preserved Scroll Offsets**: Pages remain mounted in memory, so vertical scroll offsets survive tab switching.
* **Smooth Physics**: Native pages follow horizontal gesture momentum and snap cleanly to page boundaries. WebView uses CSS scroll snapping.

### Text Overflow Controls, Line Limits & Emoji
Text now wraps inside its parent container by default and provides granular line clamping:

```python
# Truncation with ellipsis
Text("flex-1", title, multiline=False, overflow="ellipsis")
Text("w-full", summary, max_lines=3, overflow="ellipsis")
Text("w-full", description, max_lines=2, overflow="clip")
Text("", ticker, wrap=False, overflow="visible")
```

* **Color Emoji & Flags**: Native text rendering incorporates Android's installed Noto emoji fonts, supporting full-color bitmap emojis and international flag sequences.
* **Grapheme Clusters**: Native truncation respects Unicode grapheme boundaries, preventing surrogate pair splits.

### Smooth Momentum Scrolling
Scrolling containers use an adaptive spline curve sampled by elapsed time:
* **Velocity Tracking**: Deceleration curves respond naturally to gesture flick speed.
* **Held-Finger Cancellation**: Pausing a finger on the display before lifting resets stale velocity vectors to prevent unwanted inertia flings.
* **Flex Layout Rules**: Use `flex-1` with `min-h-0` on intermediate parents to let scrolling containers shrink within available screen height.

### Android-Aware Dependency Markers & Pure-Python ASGI Servers
* **Target Environment Evaluation**: Dependency markers evaluate against the target Android environment (ARM64 uses `aarch64`, x86_64 uses `x86_64`, CPython matches 3.14.6). Package extras are tracked separately.
* **Starlette & Uvicorn Support**: Run lightweight ASGI servers directly inside your Android app on their pure-Python `asyncio` and `h11` networking stack.

### Automatic Release Signing Keys in `keystore/`
Release builds automatically generate and discover signing identities under `keystore/`:
* `zkite keygen` creates `keystore/release.pem` and `keystore/release.p12` by default.
* `zkite build apk` and `zkite build aab` automatically discover and reuse `keystore/release.pem`, or generate it if missing.
* The `keystore/` directory is automatically added to `.gitignore`.

### Cleaner Public Errors
Framework errors no longer expose internal planning-document references or internal module paths, providing actionable entry-point guidance directly in the terminal and dev overlays.

---

## 2. Key Features from 1.1.1 & 1.1.0

* **Live Dev Dependency Sync (1.1.1)**: Edits to `requirements.txt` or `pyproject.toml` immediately sync packages live without restarting `zkite dev`.
* **Screen Navigation Entrance Transitions (1.1.1)**: Smooth 160ms slide-and-fade native transitions and `Navigator.reset()`.
* **Selection Toolbar & Unicode (1.1.1)**: Reliable first-press native Android text selection toolbar and UTF-16 cursor fidelity.
* **`app.json` Configuration (1.1.0)**: Declarative mobile identity, package name, version codes, and permissions.
* **Recursive Asset Packaging (1.1.0)**: Automatic bundling of nested files in `assets/`.
* **Native HTTPS Image Loader (1.1.0)**: Asynchronous verified TLS image loading with automatic memory caching.

---

## Upgrading Your Project to 1.1.2

### 1. Upgrade the CLI
Install the latest release in your active Python 3.14 virtual environment:
```bash
pip install --upgrade zkite==1.1.2
```

On Windows (PowerShell):
```powershell
.\.venv\Scripts\python.exe -m pip install --upgrade zkite==1.1.2
```

### 2. Verify Version
```bash
zkite --version
# Output: zkite 1.1.2
```

### 3. Adopt New Features
* Replace blocking network calls with module-level `Task` instances.
* Use `Tabs` for multi-section peer screens.
* Add `max_lines` and `overflow="ellipsis"` to clamp long titles or summaries.
* Run `zkite build apk` or `zkite build aab` to take advantage of automatic `keystore/` release key discovery.

:::tip[Archived Documentation Versions]
Looking for documentation for an earlier release?
* [ZKite 1.1.1 Documentation Archive](/v1-1-1/getting-started/overview/)
* [ZKite 1.1.0 Documentation Archive](/v1-1-0/getting-started/overview/)
* [ZKite 1.0.0 Documentation Archive](/v1-0-0/getting-started/overview/)
:::
