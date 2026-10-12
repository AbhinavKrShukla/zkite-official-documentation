---
title: Dependencies & Networking
description: Resolving third-party Python packages, making HTTP network calls, and managing Android thread boundaries.
---

ZKite applications can integrate pure-Python packages from PyPI and perform network communication using standard libraries.

## Declaring Dependencies

Declare third-party packages in `pyproject.toml` under `[project].dependencies`:

```toml
[project]
name = "my-zkite-app"
version = "1.0.0"
dependencies = [
    "requests>=2.31.0",
    "pydantic>=2.0.0"
]
```

When you run `zkite run` or `zkite build`, ZKite automatically resolves and bundles these dependencies into the application's native runtime environment.

:::caution[Pure Python vs Compiled C Extensions]
ZKite bundles a pre-compiled Android CPython 3.14 runtime.
* **Supported**: Pure-Python packages (e.g. `requests`, `urllib3`, `pydantic-core` wheels for Android if pure, `jinja2`, `markdown`).
* **Unsupported**: Desktop C-extensions with uncompiled native binaries (e.g. standard desktop `numpy` or `scipy` wheels without Android arm64 cross-compilation).
:::

## Making Network Requests

Always perform HTTP requests on a background worker thread to prevent freezing the Android UI thread:

```python
import threading
import urllib.request
import json
from zkite import Store

class ApiStore(Store):
    status: str = "Idle"
    weather: str = ""

store = ApiStore()

def fetch_weather_data(city: str):
    store.update(status="Loading...")

    def worker():
        try:
            url = f"https://api.example.com/weather?city={city}"
            req = urllib.request.Request(url, headers={"User-Agent": "ZKiteApp/1.0"})
            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode("utf-8"))
                store.update(weather=data.get("temp", "N/A"), status="Ready")
        except Exception as err:
            store.update(status=f"Error: {err}")

    threading.Thread(target=worker, daemon=True).start()
```

## Standard Library Pruning (`--no-prune-stdlib`)

To keep mobile APK sizes minimal, ZKite automatically analyzes your project and prunes unused parts of the Python standard library.

If your project utilizes heavy dynamic reflection or `importlib` for runtime module loading, use the `--no-prune-stdlib` flag during builds:

```bash
zkite run --no-prune-stdlib
zkite build apk --no-prune-stdlib
```
