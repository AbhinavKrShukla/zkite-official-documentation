---
title: Windows Setup & Guide
description: Developing ZKite applications natively on Windows 10/11 using PowerShell and CPython 3.14.
---

ZKite runs natively on Windows. You **do not need WSL** (Windows Subsystem for Linux) to run the CLI or build Android apps.

## Prerequisites

1. **Python 3.14 (64-bit)**: Download and install the official Windows installer from [python.org](https://www.python.org). Check the box: **Add python.exe to PATH**.
2. **Android SDK Platform-Tools**: Download platform tools from Google and add the folder containing `adb.exe` to your Windows Environment System `Path`.
3. **OEM USB Driver**: Some Windows PCs require your phone manufacturer's driver (e.g. Samsung USB Driver, Google USB Driver) for `adb` to detect the phone.

---

## PowerShell Execution

When working in PowerShell:

```powershell
# Create environment
py -3.14 -m venv .venv

# Activate environment
.\.venv\Scripts\Activate.ps1

# Install ZKite
pip install zkite==1.0.0
```

### Dealing with PowerShell Script Execution Policy

If PowerShell warns that script execution is disabled (`PSSecurityException`):

```powershell
# Option A: Enable signed/remote scripts for CurrentUser
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Option B: Run commands directly without activating
.\.venv\Scripts\python.exe -m pip install zkite==1.0.0
.\.venv\Scripts\zkite.exe dev
```

---

## Windows Specific Environment Variables

* **`ZKITE_PYTHON`**: If you have multiple Python versions installed and the CLI picks an unintended interpreter, point `ZKITE_PYTHON` directly to your CPython 3.14 executable:
  ```powershell
  $env:ZKITE_PYTHON = "C:\zkite-projects\.venv\Scripts\python.exe"
  ```
* **`ANDROID_SERIAL`**: Set the default device serial in multi-device setups:
  ```powershell
  $env:ANDROID_SERIAL = "35291FDJ2000AB"
  ```
