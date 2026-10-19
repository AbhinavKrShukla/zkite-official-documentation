---
title: What ZKite Does
description: Understand the architecture, distributions, and capabilities of the ZKite native Android Python framework.
---

**ZKite** lets you build native Android applications using Python. You describe a screen using widgets, keep changing values in stores, and connect user actions to state updates. ZKite lays out and draws the resulting interface with its native renderer. Android provides the application window, keyboard, system bars, and lifecycle.

The standard experience uses native rendering. It does **not** require a browser, HTML document, JavaScript application, or web server in the finished app. Its controls are framework-rendered controls integrated with Android platform services; do not assume each widget is a stock Android View with every stock property. Styling resembles a supported subset of Tailwind utilities, but ZKite is not a browser CSS engine.

A development preview can reload Python changes while you work. A standalone application includes what it needs to run without that development connection. You can start with `zkite run`; running a development preview first is unnecessary.

---

## What ZKite Is and Is Not

ZKite suits native Android interfaces built from the documented layout, text, image, input, navigation, and state features.

:::caution[Documented Scope Boundary]
Version 1.2.0 adds native files/uploads, system-camera capture, torch control, microphone and playback, haptics, sensors, sharing, clipboard, device info, location, notifications, secure storage, and biometric prompts. Embedded camera preview, arbitrary compiled Python packages, and iOS deployment remain outside this release. Historical plans describe ambitions and experiments; they are not promises of available features.
:::

---

## Architectural Model

ZKite cleanly separates the development host from the target Android device:

```
┌─────────────────────────────────┐           ┌───────────────────────────────────┐
│     Host Computer (Dev)         │           │        Android Device / Emulator  │
│  - CPython 3.14 Environment     │   ADB     │  - Native ZKite Android Runtime   │
│  - ZKite CLI (dev, run, build)  │ ────────> │  - Bundled CPython Engine         │
│  - Static Permission Scanner    │           │  - Native Device Service Bridge   │
│  - Project Source & app.json    │           │  - Native Hardware Canvas / View  │
└─────────────────────────────────┘           └───────────────────────────────────┘
```

1. **Host Environment**: Runs the CLI tool (`zkite`) in an isolated Python 3.14 virtual environment on Linux (x86_64) or Windows (x86_64).
2. **Android Runtime**: A native engine embedded into the APK that hosts an embedded CPython engine and translates declarative widget instructions and device calls to Android hardware-accelerated graphics and platform services.

---

## Distribution Packages & Names You Will Encounter

| Name | Meaning & Context |
| :--- | :--- |
| **ZKite** | The framework and product name. |
| **`zkite` command** | The terminal CLI application used to create, preview, run, and build projects. |
| **`zkite` Python import** | The public namespace for widgets, state decorators, navigation, and device APIs. |
| **`zkite` distribution** | The host-specific command-line package installed through pip. |
| **`zkite-framework`** | The Python API distribution, installed as a matching dependency. |
| **`zkite-payload`** | The bundled Android runtime distribution, also installed as a matching dependency. |

:::important[Keep Package Versions Synchronized]
Install the `zkite` distribution for the complete tool. Installing only the framework API does not install the complete build environment. Keep all three distributions (`zkite`, `zkite-framework`, `zkite-payload`) at the same release version (e.g. `1.2.0`). The older names `kite` and `kitecli` are not the installation command for this product.
:::
