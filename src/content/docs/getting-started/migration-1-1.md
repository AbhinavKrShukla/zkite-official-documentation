---
title: What's New in 1.1.1 & Migration Guide
description: Comprehensive overview of new features, bug fixes, and performance improvements across ZKite 1.1.1, 1.1.0, and 1.0.0.
---

ZKite **1.1.1** is the latest stable release of the framework, introducing live dependency synchronization during development, native navigation transitions, hardened text selection with emoji/Unicode handling, and interaction fixes. It builds directly upon **1.1.0** and maintains backwards compatibility for projects built with **1.0.0**.

---

## Evolution: 1.0.0 vs. 1.1.0 vs. 1.1.1

| Feature / Area | ZKite 1.0.0 | ZKite 1.1.0 | ZKite 1.1.1 (Latest) |
| :--- | :--- | :--- | :--- |
| **Development Dependency Sync** | Requires manual restart / rebuild | Resolves on build; dev requires manual sync | **Live automatic reload**: Edits to `requirements.txt` / `app.json` push packages/resources live; unneeded wheels reconciled; cached in `.zkite/dev-dependencies` |
| **Navigation (`Nav`)** | Base push / pop / replace | Basic stack navigation | **Harden validation**: Screen destinations & params validated before mutation; isolated entry identity; **`Navigator.reset(screen, **params)`**; optional **160ms entrance animations** (`transition=False` to disable) |
| **Text Input & Selection** | Initial baseline | Basic text selection bounds | **Native toolbar on first long-press**; exact UTF-16 cursor & Java modified UTF-8 conversion preserving emoji; suppressed duplicate IME callbacks; keyboard pan alignment |
| **Virtual List (`List`)** | Fixed count & height | Initial virtual recycling | **Viewport hit-test isolation** (clipped items cannot steal taps outside viewport); **scroll offset clamping** when lists shrink |
| **Interactive Controls** | Basic tap events | Basic controls | **Disabled state**: Visual indications and interaction suppression; **Slider pointer-up commit** |
| **App Configuration** | `pyproject.toml` (`[tool.zkite]`) | **`app.json`** introduced (TOML fallback preserved) | Standard **`app.json`** with live dependency sync |
| **Asset Directory** | Flat root staging only | **Recursive `assets/` directory** staged automatically | Recursive `assets/` with async off-UI-thread extraction and frame-paced splash dismissal |
| **Remote Images** | Local & data URIs | **Native HTTPS image loader** with TLS verification & cache | HTTPS loader with cached retry pacing |
| **Packaging & Errors** | Developer tracebacks in all builds | Standalone release builds show clean generic restart screen | Standalone release masking with robust dev reload diagnostics |

---

## 1. What's New in ZKite 1.1.1

### Live Development Dependency Synchronization
During `zkite dev`, the resolver now shares the full build dependency resolver:
* **Live Refresh**: Adding or changing a package in `requirements.txt`, `[project].dependencies`, or `app.json` immediately fetches/resolves the package graph, transfers wheels, distribution metadata, and certificates to the connected Android device, and reloads the preview.
* **Automatic Reconciliation**: Removed packages are automatically deleted from managed device storage.
* **Error Resilience**: If an invalid dependency constraint is introduced, `zkite dev` reports the error and leaves the running preview app intact.
* **Local Cache**: Resolved wheels are cached locally under `.zkite/dev-dependencies`. Standard source code edits reuse the installed package set in milliseconds without re-resolving dependencies.

### Hardened Screen Navigation & Native Transitions
The `Nav` container and `Navigator` receive major architectural enhancements:
* **Native Entrance Animations**: Native screens now display a smooth 160 ms entrance transition by default. To disable transitions for a stack:
  ```python
  Nav("flex-1", home_screen, detail_screen, transition=False)
  ```
* **Full Stack Reset**: Replace the entire navigation stack with a single destination and parameters:
  ```python
  nav.reset(dashboard_screen, user_id=42)
  ```
* **Pre-mutation Validation**: Screen registrations, missing arguments, or invalid destinations raise Python exceptions before altering the navigation stack.
* **Stack Entry Identity**: Each pushed entry receives its own widget identity, preventing detail screens from leaking scroll state or input focus when navigating between multiple instances of the same screen template.
* **Nested Host Injection**: Nested `Nav(host=...)` automatically injects the proper host into child screens' `Navigator`.

### Refined Text Selection & Unicode/Emoji Editing
* **Android Selection Toolbar**: The native Android text selection toolbar and handles now appear reliably on the very first long-press.
* **Full Unicode & Emoji Fidelity**: UTF-16 cursor indices and Java modified UTF-8 are correctly converted at the native C/JNI boundary, preventing crashes or caret misalignment when users type emojis or accented characters.
* **Keyboard Pan Tracking**: Selection overlays dynamically track Android 11+ window insets without double-panning the window.
* **IME Duplicate Suppression**: Suppresses redundant Android IME change callbacks for smoother typing performance.

### Touch Hit Testing & List Clamping
* **Clipped Row Tap Isolation**: Controls scrolled outside a `ScrollView` or `List` viewport now respect inherited clipping and cannot intercept taps destined for other UI components.
* **List Scroll Clamping**: Dynamically shrinking the item count of a scrolled list clamps its viewport scroll offset cleanly rather than leaving an empty view.
* **Interactive Control States**: Disabled controls (`disabled=True`) visually indicate an inactive state and cleanly discard pointer events.
* **Slider Final Value**: Sliders commit their exact value on the final pointer-up gesture.

### Responsive Startup & Splash Pacing
* **Off-UI-Thread Asset Extraction**: App asset extraction now runs asynchronously on background worker threads, preventing ANRs (Application Not Responding) during cold launch.
* **Guaranteed Frame Dismissal**: The startup splash view is dismissed only after the first native frame is actually presented to the screen.

---

## 2. Key Features Introduced in 1.1.0

### Declarative App Configuration (`app.json`)
```json title="app.json"
{
  "name": "myapp",
  "version": "0.1.0",
  "backend": "native",
  "android": {
    "package": "com.yourcompany.myapp",
    "label": "My App",
    "version_code": 1,
    "permissions": ["INTERNET"],
    "icon": "assets/icon.png"
  }
}
```

### Recursive Asset Packaging (`assets/`)
Assets inside the `assets/` directory are bundled recursively:
```text
myapp/
├── main.py
├── app.json
├── assets/
│   ├── icon.png
│   ├── images/
│   │   ├── hero.png
│   │   └── avatar.jpg
│   └── fonts/
└── requirements.txt
```

### Built-in HTTPS Remote Image Loader
Load web images asynchronously over verified TLS with automatic memory caching and retry management:
```python
Image("w-48 h-48 rounded-2xl", src="https://example.com/photos/profile.jpg", fit="cover")
```

---

## Upgrading Your Project

### 1. Upgrade the CLI
Install the latest stable release:
```bash
pip install --upgrade zkite==1.1.1
```

On Windows (PowerShell):
```powershell
.\.venv\Scripts\python.exe -m pip install --upgrade zkite==1.1.1
```

### 2. Verify Version
```bash
zkite --version
# Output: zkite 1.1.1
```

### 3. Check Dependency Caching
When running `zkite dev`, verify that your pure-Python dependencies (e.g. `requests`) cache properly under `.zkite/dev-dependencies`. If you ever need to clear the dependency cache, simply delete that directory:
```bash
rm -rf .zkite/dev-dependencies
```

:::tip[Looking for Older Versions?]
* [ZKite 1.1.0 Full Documentation Archive](/v1-1-0/overview/)
* [ZKite 1.0.0 Documentation](/v1-0-0/getting-started/overview/)
:::
