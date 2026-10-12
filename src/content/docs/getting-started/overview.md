---
title: What ZKite Does
description: Understand the architecture and capabilities of the ZKite native Android Python framework.
---

**ZKite** is a developer framework for writing native Android applications in Python. You write Python application code on a development computer, connect a physical Android device or emulator, and view the running interface through native Android rendering.

ZKite is designed to provide rapid mobile application development without sacrificing runtime responsiveness, requiring complex native Android toolchains, or forcing you to use embedded web views.

## Core Capabilities

- **Direct Native Drawing**: Your UI is rendered natively rather than through a browser engine, providing authentic Android touch responsiveness, text rendering, and frame pacing.
- **Instant Development Cycle**: `zkite dev` continuously synchronizes Python source changes to your device with instant hot reload.
- **Pure Python Codebase**: Describe layouts, handle reactive events, call device APIs, and manage state entirely using modern Python.
- **Self-Contained Distribution**: Build production `.apk` or `.aab` bundles ready for distribution. End users install standard Android applications and never need Python installed on their phones.

## Architectural Model

ZKite cleanly separates the development host from the target Android device:

```
┌─────────────────────────────────┐           ┌───────────────────────────────────┐
│     Host Computer (Dev)         │           │        Android Device / Emul      │
│  - Python 3.14 Environment      │   ADB     │  - Native ZKite Android Runtime   │
│  - ZKite CLI (dev, run, build)  │ ────────> │  - Bundled CPython Engine         │
│  - Project Source (main.py)     │           │  - Native Hardware Canvas / View  │
└─────────────────────────────────┘           └───────────────────────────────────┘
```

1. **Host Environment**: Runs the CLI tool (`zkite`) in an isolated Python 3.14 virtual environment on Linux or Windows.
2. **Android Runtime**: A lightweight native runner embedded into the APK that hosts an embedded CPython engine and translates declarative widget instructions to Android platform views.

## Terminology & Concepts

As you work with ZKite, you will encounter the following terminology:

| Term | Meaning & Context |
| :--- | :--- |
| **Widget Tree** | The hierarchical description of your user interface created by composing widgets like `Column`, `Row`, `Text`, and `Button`. |
| **Store** | The observable reactive in-memory state container that drives UI updates when changed via `store.update()`. |
| **Development Preview** | A special app instance installed by `zkite dev` with debugging hooks for live source synchronization and hot reload. |
| **Standalone Run** | A full APK build and install initiated via `zkite run` that works offline without an active host computer connection. |
| **System Bars** | The Android status bar (top clock/battery area) and navigation bar (bottom gesture/button area). |
| **Payload** | Prebuilt native Android runtime components distributed with the ZKite framework wheels. |
