---
title: Windows Setup & Guide
description: Developing ZKite applications natively on Windows 10/11 using PowerShell and CPython 3.14.
---

ZKite runs natively on Windows using the official `win_amd64` wheel. You **do not need WSL** (Windows Subsystem for Linux) or Android Studio to develop and build Android apps.

---

## Prerequisites

1. **Python 3.14 (64-bit)**: Download the official installer from [python.org](https://www.python.org). Check **Add python.exe to PATH**.
2. **Android SDK Platform-Tools**: Download platform tools and add the directory containing `adb.exe` to your Windows Environment `Path`.
3. **OEM USB Driver**: Some phones require manufacturer drivers (e.g. Samsung, Google USB Driver) for `adb` over USB.

---

## PowerShell Installation

In PowerShell, run these commands in order:

```powershell
# 1. Create a virtual environment with Python 3.14
py -3.14 -m venv .venv

# 2. Install ZKite 1.1.2 using the environment's python directly
.\.venv\Scripts\python.exe -m pip install zkite==1.1.2

# 3. Verify CLI and ADB
.\.venv\Scripts\zkite.exe --version
adb version
```

:::tip[Restricted Execution Policy]
These commands run the Python and ZKite binaries directly without requiring PowerShell script activation (`Activate.ps1`). If your organization restricts PowerShell script execution, continue using explicit executable paths.
After navigating into a project folder created one level below (`cd myapp`), the CLI path is:
```powershell
..\.venv\Scripts\zkite.exe dev
```
:::

---

## Installing Older Versions

To develop against an earlier stable release on Windows:

```powershell
# For ZKite 1.1.1
.\.venv\Scripts\python.exe -m pip install zkite==1.1.1

# For ZKite 1.1.0
.\.venv\Scripts\python.exe -m pip install zkite==1.1.0

# For ZKite 1.0.0
.\.venv\Scripts\python.exe -m pip install zkite==1.0.0
```

---

## Windows Environment Variables

* **`ZKITE_PYTHON`**: If multiple Python versions are installed and automatic discovery picks the wrong interpreter, point `ZKITE_PYTHON` directly to your CPython 3.14 executable:
  ```powershell
  $env:ZKITE_PYTHON = "C:\zkite-projects\.venv\Scripts\python.exe"
  ```
* **`ANDROID_SERIAL`**: Selects a target device when multiple phones or emulators are connected:
  ```powershell
  $env:ANDROID_SERIAL = "DEVICE_SERIAL_ID"
  ```

---

## Terminal Arrow Keys & CI Selection

Interactive arrow-key device selection requires a real interactive terminal console. For IDE tasks, PowerShell background scripts, redirected output, or CI pipelines, always supply `--serial`:

```powershell
..\.venv\Scripts\zkite.exe run --serial DEVICE_SERIAL
```
