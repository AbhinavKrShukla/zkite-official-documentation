---
title: Create Your First Project
description: Scaffold a fresh ZKite mobile application and understand project files, app.json, and asset packaging.
---

Generate a new mobile project by running `zkite new` followed by your desired project name.

```bash
# Create a new directory and scaffold project
zkite new myapp
cd myapp

# Or scaffold inside an existing empty directory
zkite new myapp .
```

The generated app uses an interactive orange-and-white Discover/Playground design, swipeable tabs, and a save interaction instead of a basic counter. Creating or upgrading the framework does not replace existing app source.

---

## Project Structure (1.1.2)

```text
myapp/
├── main.py             # Application entry point containing top-level view()
├── app.json            # App identity, version, backend, and Android settings
├── assets/             # Recursively packaged app resources (images, fonts, JSON)
├── keystore/           # Default release PEM and PKCS#12 keys (ignored by Git)
├── zkite.tailwind.json # Styling and editor class configuration
└── .gitignore          # Excludes build output, caches, and keystore
```

### Project Files Overview

| File / Directory | Purpose | Handling |
| :--- | :--- | :--- |
| `main.py` | Application entry module containing the top-level `view`. | Edit and commit. |
| `app.json` | App identity, version, backend, and Android configuration. | Edit and commit. |
| `requirements.txt` | Dependency declarations for pip (or `pyproject.toml` for uv). | Edit and commit as needed. |
| `assets/` | **Recursively packaged app resources**; created by scaffold. | Commit intended app assets. |
| `keystore/` | Default release PEM and PKCS#12 signing files (New in 1.1.2). | Back up securely; do not commit. |
| `zkite.tailwind.json` | Styling/editor utility class configuration. | Keep with project. |
| `.gitignore` | Excludes generated outputs, local virtual environments, and keys. | Commit. |
| `.zkite/` | Local development state, dependency cache (`.zkite/dev-dependencies`), and debug signing key (`debug.pem`). | Keep locally; do not commit. |
| `dist/` | Built release artifacts (`.apk` and `.aab`). | Build output. |
| Top-level `.py` files | Helper application modules beside `main.py`. | Edit and commit. |
| Top-level images | Top-level PNG/JPG/JPEG files packaged beside `main.py`. | Commit. |

---

## 1. `main.py` (Application Code)

The entry module provides a top-level function named `view`. It returns the widget tree describing the current interface:

```python title="main.py"
from zkite import store, Column, Text, Button, SystemBars

# 1. Observable application state
@store
class CounterStore:
    count: int = 0

state = CounterStore()

def increment():
    state.update(count=state.count + 1)

# 2. Top-level view entry discovered by the framework
def view():
    return SystemBars(
        Column(
            "flex-1 justify-center items-center p-6 bg-slate-950 gap-4",
            Text("text-3xl font-extrabold text-white", "Hello, ZKite!"),
            Text("text-lg text-emerald-400 font-medium", f"Taps: {state.count}"),
            Button(
                "px-6 py-3 bg-emerald-500 rounded-xl font-bold text-white",
                Text("text-white text-base", "Tap Me"),
                on_tap=increment,
            ),
        ),
        status_color="#020617",
        navigation_color="#020617",
        status_icons="light",
        navigation_icons="light",
    )
```

:::note[Constructor Conventions]
Most widgets take a **class string first**, followed by their children or visible content. This includes `Text` and `Button`: their first positional string is styling, not the displayed label. `SystemBars` is a deliberate exception whose first argument is the screen widget it wraps.
:::

---

## 2. `app.json` (Configuration)

All application settings in ZKite 1.1.1 come from `app.json`:

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

:::tip[Legacy pyproject.toml Support]
In ZKite 1.0.0, configuration lived in `pyproject.toml`. If `app.json` is absent, ZKite falls back to legacy TOML settings. When `app.json` exists, it takes precedence and legacy TOML app settings are ignored.
:::

---

## 3. Packaging Boundary & Assets

* **`assets/` Directory**: The entire `assets/` directory is packaged recursively. You can place icons, illustrations, and images in nested folders like `assets/images/logo.png` and reference them directly in `Image` widgets.
* **Symbolic Links**: Symbolic links inside `assets/` are rejected.
* **Top-level files**: Helper `.py` files and root image assets beside `main.py` are also staged.
* **Never commit keys**: Never place private signing keys, API secrets, or server credentials in `assets/`.
