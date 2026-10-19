---
title: Dependencies & Networking
description: Resolving third-party Python packages with requirements.txt, managing permissions in app.json, and HTTPS networking.
---

ZKite applications can integrate pure-Python packages from PyPI and perform verified HTTPS network communication.

---

## Declaring Dependencies

In ZKite 1.1.2, declare dependencies in `requirements.txt` or `pyproject.toml`:

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

### 3. Legacy `app.json` Dependencies
No dependency list is needed in `app.json`. Its legacy `dependencies` array is merged with a deprecation notice; it does not override `pyproject.toml` dependencies. Requirements from `requirements.txt` are also merged; avoid conflicting constraints. ZKite does not currently consume uv lockfiles, so use pinned requirements when exact versions matter.

---

## Android-Aware Dependency Markers & Extras (New in 1.1.2)

When evaluating environment markers and package extras, ZKite's dependency resolver targets the **Android mobile environment**, not your development host OS:

* **Target Architectures**: ARM64 evaluates to `aarch64`; x86_64 evaluates to `x86_64`.
* **Runtime Version**: Python marker versions match the bundled mobile CPython engine (**3.14.6** in this release).
* **Package Extras**: Tracked separately for each dependency. A false marker skips that dependency; a true marker resolves and validates it normally.
* **Release Baseline**: Android release markers use the minimum SDK baseline; device-specific kernel/build values are unavailable.
* **Fail-Fast Safety**: Applicable dependencies requiring unsupported native C-extensions still fail clearly at build time rather than failing on device at runtime.

---

## Running a Pure-Python ASGI Server (New in 1.1.2)

With ZKite 1.1.2, you can bundle lightweight embedded servers such as **Starlette** and **Uvicorn** directly inside your Android app:

```toml title="pyproject.toml"
[project]
name = "my-zkite-app"
version = "0.1.0"
dependencies = [
    "starlette==1.8.0",
    "uvicorn==0.54.0",
    "zkite>=1.1.1",
]
```

Configure Uvicorn to run on its pure-Python networking stack with `asyncio` and `h11`:

```python
import uvicorn

config = uvicorn.Config(
    app,  # Your ASGI Starlette application
    host="0.0.0.0",
    port=8767,
    loop="asyncio",
    http="h11",
    lifespan="off",
)
```

:::caution[Pure-Python Server Guidelines]
* **Never Run on UI Thread**: Do not start a long-running server inside `view()` or a synchronous UI callback. Manage server startup and shutdown outside the UI thread.
* **Avoid `uvicorn[standard]`**: Do not specify `uvicorn[standard]`, as that pulls in `uvloop` and `httptools` which require compiled C extensions without Android wheels. Stick to pure-Python `uvicorn` with `h11`.
:::

---

## Live Dependency Sync in `zkite dev`

Both `zkite dev` and production builds share the unified dependency resolver:

* **Live Updates**: Editing `requirements.txt` or `pyproject.toml` while `zkite dev` is running refreshes the package set, resolves transitive requirements, transfers new packages to the connected Android device, and reloads the preview live.
* **Automatic Removal**: Uninstalled packages are cleanly deleted from managed device files.
* **Resilient Failure Handling**: Invalid dependency constraints report an error to your terminal while keeping the existing app state running on device.
* **Dependency Caching (`.zkite/dev-dependencies`)**: Resolved package sets are cached locally under `.zkite/dev-dependencies`. Ordinary source edits reuse the installed package set in milliseconds.
* **Refreshing Unpinned Packages**: To force a re-resolution, stop `zkite dev`, remove `.zkite/dev-dependencies`, and restart.

---

## Pure-Python Compatibility Boundary

:::caution[Pure-Python Wheels Only]
The supported dependency path is **compatible pure-Python wheels**.
* **Supported**: Pure-Python packages (e.g. `requests`, `urllib3`, `idna`, `certifi`, `jinja2`, `markdown`, `starlette`, `uvicorn`). Transitive metadata and resource files (such as `certifi` CA bundles) are fully preserved.
* **Unsupported**: Desktop C-extensions with uncompiled native binaries (e.g. desktop `numpy`, `scipy`, or `psutil` wheels). Desktop wheels for Windows or Linux cannot be copied into an Android APK.
* An unavailable or incompatible dependency will fail the build rather than silently disappearing.
:::

---

## Network Permissions in `app.json` (Updated in 1.2.0)

In ZKite 1.2.0, `zkite run` and `zkite build` statically inspect your Python code and **automatically infer the `INTERNET` permission** whenever they detect common network libraries (`requests`, `urllib`, `httpx`, `aiohttp`) or remote `Image(src="https://...")` sources:

* **Automatic Declaration**: The scanner adds `"INTERNET"` to `android.permissions` and `android.inferred_permissions` in `app.json`.
* **Explicit Declaration**: For dynamic network calls or third-party dependencies whose usage cannot be inferred statically, declare the permission explicitly:
  ```json title="app.json"
  {
    "android": {
      "permissions": ["INTERNET"]
    }
  }
  ```
* **Offline Apps**: If your app is strictly offline and you want to ensure no network permission is granted, remove `"INTERNET"` from `permissions` and avoid importing network clients.

---

## Streaming Multipart File Uploads (`network.upload`) (New in 1.2.0)

For uploading user-selected files, audio recordings, or photos to a remote REST API, ZKite 1.2.0 provides the built-in `network.upload` streaming client:

```python
from zkite import files, network

async def upload_file(selected_file: files.FileRef):
    def progress_callback(sent: int, total: int):
        print(f"Uploaded: {sent}/{total} bytes ({sent/total*100:.1f}%)")

    try:
        response = await network.upload(
            url="https://api.example.com/v1/upload",
            file=selected_file,
            fields={"category": "invoices", "user_id": "842"},
            headers={"Authorization": "Bearer TOKEN"},
            on_progress=progress_callback,
            timeout=60,
        )
        print(f"Server response code: {response.status}")
    except network.HTTPError as exc:
        print(f"HTTP error: {exc.response.status}")
```

* **Fixed Memory Footprint**: Uses a bounded memory buffer to stream large files without loading entire files into Python RAM.
* **TLS Security**: Verifies server certificates by default. Plain HTTP requires `allow_http=True`.
* **Concurrency**: Supports up to **4 concurrent uploads**.
* **Cooperative Cancellation**: Cancelling the coroutine terminates socket streaming immediately.

---

## Making Nonblocking HTTPS Requests with `Task` (New in 1.1.2)

Use the module-level `Task` API to run blocking HTTP requests outside the UI thread with built-in loading and error states:

```python
import json
from urllib.request import urlopen
from zkite import Button, Column, Task, Text

fetch_weather = Task()

def query_api(city: str):
    with urlopen(f"https://api.example.com/weather?city={city}", timeout=10) as resp:
        return json.loads(resp.read())

def view():
    return Column(
        "flex-1 p-6 gap-4 bg-slate-900",
        Button(
            "p-4 bg-orange-600 rounded-xl",
            "Fetch Weather",
            on_tap=lambda: fetch_weather.start(query_api, "Tokyo"),
            disabled=fetch_weather.loading,
        ),
        Text("text-white text-xl", f"Result: {fetch_weather.data}" if fetch_weather.data else "No data"),
        Text("text-red-400", str(fetch_weather.error) if fetch_weather.error else ""),
    )
```

---

## Standard Library Pruning (`--no-prune-stdlib`)

ZKite analyzes your code and prunes unused modules from the Python standard library to keep mobile APK sizes minimal.

If your code or a dependency relies on dynamic runtime imports via `importlib` that static analysis cannot discover, pass `--no-prune-stdlib`:

```bash
zkite run --no-prune-stdlib
zkite build apk --no-prune-stdlib
```
