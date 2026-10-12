<div align="center">

# ZKite

### Build Native Android Apps in Pure Python with Instant Hot Reload

[![Python](https://img.shields.io/badge/Python-3.14-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Android Target](https://img.shields.io/badge/Android-API%2029%2B%20(10%2B)-3DDC84?logo=android&logoColor=white)](https://developer.android.com/)
[![Google Play](https://img.shields.io/badge/Google%20Play-.aab%20Ready-34A853?logo=googleplay&logoColor=white)](https://play.google.com/console)
[![Documentation](https://img.shields.io/badge/Docs-zkite.cloud-0284C7)](https://zkite.cloud)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#)

<p align="center">
  <b>No Android NDK &bull; No Java/Kotlin toolchains &bull; No WebViews</b><br/>
  Pure Python code, sub-second hot reload over ADB, and authentic native Android views.
</p>

</div>

> [!NOTE]
> **Status: Version 1.0.0 in Final Preparation**  
> Official developer documentation is live at **[zkite.cloud](https://zkite.cloud)**. PyPI release wheels and pre-built native runtime payloads will be published shortly.

---

## Why ZKite?

Building Android apps traditionally requires gigabytes of SDKs, Android Studio, Gradle daemons, and C++ toolchains. Alternative cross-platform solutions often stuff your app into an embedded WebView or demand complex compiler toolchains.

| Capability | Typical Mobile Toolchains | **The ZKite Approach** |
| :--- | :--- | :--- |
| **Language & Syntax** | Multi-language setups or non-Python stacks | **Pure Python 3.14** end-to-end |
| **Native Compilation** | Demands Android NDK, C++ compilers, & CMake | **Zero C++ / NDK required** on your machine |
| **Build Infrastructure** | 10+ GB Android Studio, Java SDK, & Gradle daemons | **Pre-built native runtime** (No Gradle setup needed) |
| **UI Subsystem** | Sluggish WebViews or canvas-drawn imitations | **Real Android Native Views** with hardware canvas |
| **Development Feedback** | Multi-minute rebuilds or app restarts | **Sub-100ms Hot Reload** directly over ADB |
| **Host Prerequisites** | Complex toolchain recipes & native dependencies | **Just Python 3.14 + ADB** |

### How It Works

```mermaid
flowchart LR
    subgraph Host["💻 Developer Host (Linux / Windows)"]
        py["Pure Python 3.14 App"]
        cli["ZKite CLI (`zkite dev`)"]
        py --> cli
    end

    subgraph Device["📱 Android Device / Emulator"]
        runtime["Pre-built Native Engine"]
        views["Android Native Graphics & View Tree"]
        runtime --> views
    end

    cli -- "Sub-100ms ADB State Sync" --> runtime
```

* **No Android NDK or C++ Compilation**: Never configure CMake, Ninja, Clang, or native cross-compilers.
* **No Java/Gradle Overhead**: You do not need to install the JDK, manage Gradle daemons, or write XML layout files.
* **Zero WebViews**: Your UI is rendered directly through Android's native view system—not inside an embedded browser engine.
* **Pure Python Simplicity**: All you need is standard **Python 3.14** and standard `adb` (Android Debug Bridge).

---

## Getting Started in 60 Seconds

### 1. Install ZKite
Install ZKite into an isolated Python 3.14 virtual environment:

```bash
# Linux / macOS
python3.14 -m venv .venv
source .venv/bin/activate
pip install zkite==1.0.0

# Windows (PowerShell)
py -3.14 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install zkite==1.0.0
```

### 2. Verify Your Environment
Run the built-in diagnostic tool to ensure Python 3.14 and `adb` are ready:

```bash
zkite doctor
```

### 3. Create a New Project
Scaffold a fresh project with standard layout and styling configurations:

```bash
zkite new my_mobile_app
cd my_mobile_app
```

### 4. Connect Device & Start Hot Reload
Plug in your Android phone (with USB debugging enabled) or start an emulator:

```bash
zkite dev
```

> [!TIP]
> Save any `.py` file—changes reflect on your device or emulator in under 100ms without restarting the app or resetting state.

---

## Essential CLI Commands

| Command | What It Does |
| :--- | :--- |
| `zkite new <NAME>` | Scaffolds a new project with starter templates and settings. |
| `zkite dev` | Launches development preview with instant source hot reload. |
| `zkite run` | Builds, installs, and launches a standalone APK directly on device. |
| `zkite doctor` | Checks host environment, Python version, payloads, and ADB connectivity. |
| `zkite build apk` | Compiles a standalone `.apk` for testing or direct download. |
| `zkite build aab` | Generates a signed `.aab` (Android App Bundle) for Google Play Store. |
| `zkite keygen` | Generates permanent cryptographic release signing keystores. |

---

## Key Features

* **Instant Hot Reload (`zkite dev`)**: Save your Python files on your computer and see UI updates reflect immediately on your connected physical phone or emulator.
* **100% Native Drawing**: Authentic Android touch responsiveness, hardware canvas rendering, and 60/120 FPS frame pacing.
* **Rich Declarative Widgets**: Layout containers (`Column`, `Row`, `Grid`, `Stack`, `ScrollView`), interactive controls (`Button`, `TextField`, `Switch`, `Slider`, `Select`), and a high-performance virtualized `List` recycler.
* **Reactive State Management**: Built-in observable `Store` pattern that automatically drives UI re-renders without boilerplate.
* **System Bar Integration**: Control Android's system status bar and bottom gesture/navigation bars with adaptive light/dark contrast (`SystemBars`).
* **Google Play & Standalone Distribution**: Built-in release signing (`zkite keygen`), standalone `.apk` packaging, and multi-architecture `.aab` bundles ready for Google Play. End users install standard Android apps—they never need Python or pip.

---

## Google Play Store Distribution

ZKite is fully equipped for shipping commercial apps to Google Play:

### 1. One-Command Keystore Generation
Generate production cryptographic keys without Java `keytool` or OpenSSL:
```bash
zkite keygen --out release_key --cn "My App Release Key"
```

### 2. Multi-Architecture Android App Bundle (`.aab`)
Build the bundle Google Play requires:
```bash
zkite build aab \
  --abi arm64-v8a \
  --abi x86_64 \
  --keystore release_key.pem \
  --out dist/
```
The resulting `.aab` in `dist/` can be uploaded directly to the **Google Play Console**.

---

## Code Preview

Here is how simple a reactive native mobile screen is with ZKite:

```python
from zkite import Store, Column, Row, Text, Button, SystemBars

# 1. Define observable application state
class CounterStore(Store):
    count: int = 0

state = CounterStore()

def increment():
    state.update(count=state.count + 1)

# 2. Compose your declarative native UI
def App():
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

---

## Compatibility Matrix

| Component | Target / Requirement |
| :--- | :--- |
| **Host OS** | Linux (x86_64), Windows 10/11 (x86_64) |
| **Host Python** | CPython 3.14 |
| **Target Android** | Android 10+ (API Level 29+) |
| **Target Architectures** | `arm64-v8a` (Physical devices), `x86_64` (Emulators) |
| **Google Play Target** | Android API 36 |
| **Host Tooling** | Android Debug Bridge (`adb`) |

---

## Official Documentation

Comprehensive guides, API reference for all 19 widgets, troubleshooting matrices, and packaging guides are available on the official documentation site:

👉 **[Read the ZKite Documentation](https://zkite.cloud)**

---

## License

ZKite is open-source software licensed under the MIT License.
