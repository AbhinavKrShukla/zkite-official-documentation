---
title: What's New in 1.1.0 & Migration Guide
description: Key changes in ZKite 1.1.0, comparing features with 1.0.0, and how to migrate your existing projects.
---

ZKite **1.1.0** introduces significant enhancements to configuration, asset packaging, networking, image loading, and runtime error resilience, while maintaining backward compatibility for projects built on **1.0.0**.

---

## At a Glance: 1.0.0 vs. 1.1.0

| Feature / Area | ZKite 1.0.0 | ZKite 1.1.0 |
| :--- | :--- | :--- |
| **App Configuration** | Configured in `pyproject.toml` under `[tool.zkite]` | Configured in **`app.json`** (`pyproject.toml` remains supported as fallback) |
| **Project Scaffolding** | `zkite new <NAME>` creates `pyproject.toml` | `zkite new <NAME> [.]` creates `main.py`, `app.json`, `assets/`, `zkite.tailwind.json`, `.gitignore` |
| **Asset Directory** | Flat root staging only (all files beside `main.py`) | **Recursive `assets/` directory** staged automatically (e.g. `assets/images/logo.png`) |
| **Remote Images** | No automatic remote image loader | **Built-in HTTPS image loader** for PNG/JPEG with verified TLS, 2 MiB limit, and cache |
| **Dependencies** | Declared in `pyproject.toml` only | Supported via **`requirements.txt`** (pip), `pyproject.toml` (uv), or `app.json` |
| **Network Permission** | Explicitly configured in TOML permissions | Auto-included by default in scaffolded `app.json` (`"permissions": ["INTERNET"]`) |
| **Release Error Masking** | Developer error messages in all builds | Standalone APK/AAB builds show a clean generic restart message; dev preview keeps detailed overlay |
| **Lifecycle & Text Selection** | Initial baseline | Fixes preserving queued render commands, rejecting expired surfaces, and text selection overlay guards |

---

## 1. Declarative App Configuration (`app.json`)

In 1.1.0, application identity and Android settings move to a dedicated `app.json` file at the root of your project:

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

:::tip[Backward Compatibility with 1.0.0]
If your project does not have an `app.json`, ZKite continues to read legacy TOML settings from `pyproject.toml` under `[tool.zkite]`. When `app.json` is present, it takes precedence and legacy TOML app settings are ignored.
:::

---

## 2. Recursive Asset Packaging (`assets/`)

In 1.0.0, asset files and images had to be placed in the project root directly beside `main.py`.

In 1.1.0, the `assets/` directory created by `zkite new` is packaged recursively into your Android app bundle:

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

You can reference nested assets directly in widgets:
```python
Image("w-32 h-32 rounded-xl", src="assets/images/hero.png")
```

Top-level Python helper modules and root PNG/JPG/JPEG files remain supported for backwards compatibility.

---

## 3. Built-in HTTPS Remote Image Loader

ZKite 1.1.0 adds native asynchronous HTTPS image loading:

```python
Image(
    "w-48 h-48 rounded-2xl",
    src="https://example.com/photos/profile.jpg",
    fit="cover"
)
```

### Specifications:
* **Formats**: PNG and JPEG-family formats over HTTPS with verified TLS.
* **Concurrency & Limits**: 4 download worker threads, 15-second network timeout, 2 MiB max per image, bounded in-memory cache.
* **Retries & Failures**: Failed requests leave an empty image and log a diagnostic; subsequent renders can retry after 30 seconds.
* **Security**: HTTPS redirects cannot downgrade to unencrypted HTTP. Plain HTTP cleartext is blocked.
* **Permissions**: Requires the `INTERNET` permission in `app.json`.

---

## 4. Simplified Dependencies (`requirements.txt` & uv)

ZKite 1.1.0 simplifies dependency declarations:

* **For standard pip projects**: Create `requirements.txt` with one pinned package per line (e.g. `requests==2.32.5`). No `pyproject.toml` is needed.
* **For uv projects**: Declare packages in `pyproject.toml` under `[project].dependencies`.
* **Explicit overrides**: Specify `"dependencies": [...]` in `app.json` to override `pyproject.toml`.

---

## 5. Scaffolding into Existing Directories

The `zkite new` command now supports scaffolding into the current working directory using `.`:

```bash
mkdir my-mobile-app && cd my-mobile-app
zkite new my-mobile-app .
```

Existing scaffold paths are never overwritten; any unrelated files in the target directory are preserved.

---

## 6. Production Error Handling

In standalone release builds (`.apk` and `.aab`), uncaught Python startup, render, and event errors now display a generic user-friendly restart screen rather than raw developer tracebacks on the mobile screen.

* Full tracebacks remain available via `adb logcat` and `zkite run --logs`.
* Development mode (`zkite dev`) continues to display full interactive error overlays on screen for rapid debugging.

---

## Migrating a 1.0.0 Project to 1.1.0

Upgrading an existing project from 1.0.0 to 1.1.0 is smooth:

1. **Upgrade ZKite**:
   ```bash
   pip install --upgrade zkite==1.1.0
   ```
2. **(Optional) Create `app.json`**:
   Extract your settings from `[tool.zkite.android]` in `pyproject.toml` into a new `app.json` file.
3. **(Optional) Move images to `assets/`**:
   Group your image and media files into the `assets/` folder and update `src` paths in your `Image` widgets.
4. **Test with `zkite doctor` & `zkite run`**:
   Verify everything compiles and runs on your device.
