---
title: Supported Environments & Matrix
description: Operating system requirements, Android versions, CPU architectures, and Python compatibility for ZKite 1.0.0.
---

Before developing with ZKite, verify that your development computer and Android test hardware meet the requirements listed below.

## Support Matrix

| Category | Supported / Target | Notes & Guidance |
| :--- | :--- | :--- |
| **Host Operating Systems** | Linux x86_64, Windows x86_64 | Use native command shells. On Windows, native PowerShell/CMD is supported without WSL. |
| **Host Python Version** | **CPython 3.14** | ZKite targets the CPython 3.14 ABI. Ensure Python 3.14 is active in your virtual environment. |
| **Target Android OS** | **Android 10+** (API Level 29+) | Tested and supported through current Android releases. |
| **Android Architectures** | `arm64-v8a` (Primary), `x86_64` (Emulators) | Real phones almost universally run `arm64-v8a`. Emulators typically use `x86_64`. |
| **Host Tooling** | `adb` (Android Debug Bridge) | Required for device discovery, APK installation, and live development sessions. |

:::note[32-bit Architecture Status]
Legacy 32-bit architectures (`armeabi-v7a` and `x86`) are not supported targets for modern native payloads. Target 64-bit devices (`arm64-v8a`) or standard 64-bit Android Virtual Devices (AVD).
:::

## Host System Requirements

### Linux
- Any modern distribution (Ubuntu 22.04+, Debian 12+, Fedora 38+, Arch Linux).
- Standard CPython 3.14 installed with development headers.
- `adb` available in `$PATH` (e.g. from `android-tools` package or Android Studio command-line tools).

### Windows
- Windows 10 or Windows 11 (64-bit).
- Official Windows CPython 3.14 installer from [python.org](https://www.python.org). Check the option to **Add python.exe to PATH**.
- Android SDK Platform-Tools (containing `adb.exe`) added to your system `PATH`.
- Manufacturer USB driver for your Android phone model (if device is not recognized over USB).

## Android Device Compatibility

You can run ZKite applications on:
1. **Physical Android Devices**: Recommended for testing real touch responsiveness, keyboard behavior, system bars, and performance.
2. **Android Virtual Devices (AVD)**: Created via Android Studio. Ensure the emulator image uses **x86_64** architecture with Google APIs.
