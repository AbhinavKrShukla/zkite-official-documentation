---
title: Supported Environments & Matrix
description: Operating system requirements, Android versions, CPU architectures, and Python compatibility for ZKite 1.1.1 (and earlier 1.1.0/1.0.0).
---

Before developing with ZKite, verify that your development computer and Android test hardware meet the requirements listed below.

## Support Matrix

| Item | ZKite 1.1.1 Specification | Notes & Guidance |
| :--- | :--- | :--- |
| **Host Python** | **CPython 3.14** | Must use the same minor version as the supplied Android runtime. |
| **Linux Host** | **x86_64**, glibc 2.28 or newer | Uses the `manylinux` wheel. A musl-only environment is incompatible. |
| **Windows Host** | **x86_64 Windows** | Uses the `win_amd64` wheel. Native PowerShell/CMD without WSL. |
| **Android Minimum SDK** | **Android 8.0 / API 26** (default) | Installation floor across physical devices and emulators. |
| **Android Target SDK** | **API 36** (default) | Target API level for compiled Android manifests and runtime services. |
| **Android Architectures** | `arm64-v8a` and `x86_64` | Real phones almost universally run `arm64-v8a`. Emulators run `x86_64`. |
| **Device Connection** | `adb` (Platform-Tools) | USB debugging authorized on target physical device or emulator. |
| **Rendering Backend** | **Native** (default) | Hardware-accelerated native Android views without WebViews. |
| **App Dependencies** | Pure-Python wheels | Dependency graph and transitive requirements resolved for Android. |

:::caution[Platform Scope & Exclusions]
* **macOS**: A macOS wheel is **not included** in this release set. Do not attempt macOS installation.
* **Out of Scope**: Windows ARM, Linux ARM, 32-bit Android (`armeabi-v7a`, `x86`), iOS, and web deployment are outside this distribution's support scope.
* **No Heavy Toolchains**: You do **not** need Rust, Gradle, a JDK, the Android NDK, or Android Studio to build an ordinary app from the complete pip installation.
:::

## Host System Requirements

### Linux
- Any modern distribution with glibc 2.28+ (Ubuntu 20.04+, Debian 10+, Fedora 30+, Arch Linux).
- Standard CPython 3.14 installed with development headers.
- `adb` available in `$PATH` (from `android-tools` package or Android platform-tools).

### Windows
- Windows 10 or Windows 11 (64-bit x86_64).
- Official Windows CPython 3.14 installer from [python.org](https://www.python.org). Check **Add python.exe to PATH**.
- Android SDK Platform-Tools (containing `adb.exe`) added to your system `PATH`.
- Manufacturer USB driver for your Android phone model (if device is not recognized over USB).

## Android Device Compatibility

You can run ZKite applications on:
1. **Physical Android Devices (arm64-v8a)**: Recommended for testing real touch responsiveness, keyboard behavior, system bars, and performance.
2. **Android Virtual Devices (AVD / x86_64)**: Created via Android Studio or command-line emulator tools. Ensure the emulator ABI is `x86_64`.
