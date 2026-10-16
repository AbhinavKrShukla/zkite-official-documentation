---
title: Dependencies & Networking
description: Resolving third-party Python packages with requirements.txt, managing permissions in app.json, and HTTPS networking.
---

ZKite applications can integrate pure-Python packages from PyPI and perform verified HTTPS network communication.

---

## Declaring Dependencies

In ZKite 1.1.1, you can declare dependencies using `requirements.txt`, `pyproject.toml`, or directly in `app.json`:

### 1. Using `requirements.txt` (Standard pip Projects)
For standard pip projects, create a `requirements.txt` in your project root with one package per line:

```text title="requirements.txt"
# Pinned third-party dependencies
requests==2.32.5
pydantic==2.8.2
```

* Blank lines and `#` comments are supported.
* Pip options (such as `--index-url`), recursive `-r` includes, and line continuations are not supported.
* **No `pyproject.toml` is required** for pip projects.

### 2. Using `pyproject.toml` (uv or Package Managers)
For uv or other package managers, declare dependencies under `[project].dependencies`:

```toml title="pyproject.toml"
[project]
name = "my-zkite-app"
version = "0.1.0"
dependencies = [
    "requests==2.32.5",
]
```

### 3. Using `app.json`
An explicit `dependencies` array in `app.json` overrides the list in `pyproject.toml`:

```json title="app.json"
{
  "name": "my-zkite-app",
  "dependencies": [
    "requests==2.32.5"
  ]
}
```

Requirements from `requirements.txt` are combined with either list. Pin your versions to ensure exact reproducibility across builds.

---

## Live Dependency Sync in `zkite dev` (1.1.1)

In ZKite 1.1.1, both `zkite dev` and production builds use the unified dependency resolver:

* **Live Updates**: Editing `requirements.txt`, `[project].dependencies`, or `app.json` while `zkite dev` is running refreshes the package set, resolves transitive requirements, transfers new packages and metadata to the phone, and reloads the preview live.
* **Automatic Removal**: Uninstalled or removed packages are cleanly deleted from managed device files.
* **Resilient Failure Handling**: Invalid dependency changes or conflicting constraints report an error to your terminal while keeping the previous app state running on device.
* **Dependency Caching (`.zkite/dev-dependencies`)**: Resolved package sets are cached under `.zkite/dev-dependencies`. Ordinary source code edits reuse the installed package set in milliseconds.
* **Refreshing Unpinned Packages**: To force a re-resolution of an unpinned requirement, stop `zkite dev`, remove `.zkite/dev-dependencies`, and restart dev.

---

## Pure-Python Compatibility Boundary

The build resolves the complete dependency graph, including transitive requirements, for the requested Android architectures (`arm64-v8a` and `x86_64`).

:::caution[Pure-Python Wheels Only]
The supported dependency path is **compatible pure-Python wheels**.
* **Supported**: Pure-Python packages (e.g. `requests`, `urllib3`, `idna`, `certifi`, `jinja2`, `markdown`). Transitive metadata and resource files (such as `certifi` CA bundles) are fully preserved.
* **Unsupported**: Desktop C-extensions with uncompiled native binaries (e.g. desktop `numpy`, `scipy`, or `psutil` wheels). Desktop wheels for Windows or Linux cannot be copied into an Android APK.
* An unavailable or incompatible dependency will fail the build rather than silently disappearing.
:::

---

## Network Permissions in `app.json`

To enable network access on Android, declare the `INTERNET` permission under `android` in `app.json`:

```json title="app.json"
{
  "android": {
    "permissions": ["INTERNET"]
  }
}
```

* New projects scaffolded with `zkite new` include this permission by default.
* If your application is completely offline, remove `"INTERNET"` from `permissions`.

---

## Making HTTPS Requests

`requests` and its pure-Python dependencies have been verified on Android hardware (such as Motorola Moto G54) with verified TLS certificates.

Always perform network calls on a background worker thread:

```python
import threading
import requests
from zkite import store

@store
class WeatherStore:
    temperature: str = "--"
    status: str = "Ready"

state = WeatherStore()

def fetch_weather(city: str):
    state.update(status="Loading...")

    def worker():
        try:
            # Verified HTTPS request using requests
            resp = requests.get(
                f"https://api.example.com/weather?city={city}",
                timeout=10
            )
            resp.raise_for_status()
            data = resp.json()
            state.update(
                temperature=f"{data['temp']}°C",
                status="Success"
            )
        except Exception as err:
            state.update(status=f"Error: {err}")

    threading.Thread(target=worker, daemon=True).start()
```

---

## Standard Library Pruning (`--no-prune-stdlib`)

ZKite analyzes your code and prunes unused modules from the Python standard library to keep mobile APK sizes minimal.

If your code or a dependency relies on dynamic runtime imports via `importlib` that static analysis cannot discover, pass `--no-prune-stdlib`:

```bash
zkite run --no-prune-stdlib
zkite build apk --no-prune-stdlib
```
