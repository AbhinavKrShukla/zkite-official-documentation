---
title: Create Your First Project
description: Scaffold a fresh ZKite mobile application and understand the project files and architecture.
---

Generate a new mobile project by running `zkite new` followed by your desired project name.

```bash
zkite new hello_zkite
cd hello_zkite
```

This creates a ready-to-run mobile app structure.

## Project Structure

```text
hello_zkite/
├── .gitignore          # Ignores build artifacts and key files
├── pyproject.toml      # Project configuration and Android packaging settings
├── zkite.config.json   # Styling tokens and utility configurations
└── main.py             # Your application entry point and UI tree
```

### 1. `main.py` (Application Code)

Here is a standard starter `main.py`:

```python
from zkite import Store, Column, Text, Button, SystemBars

# Define observable reactive state
class AppState(Store):
    count: int = 0

state = AppState()

def increment():
    state.update(count=state.count + 1)

def App():
    return SystemBars(
        Column(
            "flex-1 justify-center items-center p-6 bg-slate-900 gap-4",
            Text("text-2xl font-bold text-white", "Hello from ZKite!"),
            Text("text-lg text-emerald-400", f"Taps: {state.count}"),
            Button(
                "px-6 py-3 bg-emerald-500 rounded-xl font-semibold text-white",
                Text("text-white font-bold", "Tap Me"),
                on_tap=increment,
            ),
        ),
        status_color="#0f172a",
        navigation_color="#0f172a",
        status_icons="light",
        navigation_icons="light",
    )
```

### 2. `pyproject.toml` (Configuration)

```toml
[project]
name = "hello-zkite"
version = "0.1.0"
dependencies = []

[tool.zkite]
backend = "native"

[tool.zkite.android]
package_id = "com.example.hellozkite"
app_name = "Hello ZKite"
# icon = "icon.png"
```

:::important[Packaging Boundary & Flat File Staging]
In ZKite 1.0.0, application source files and packaged image assets must be placed in the **project root directory** beside `main.py`. Nested subfolders are not automatically bundled into the Android APK staging root during builds.
:::
