---
title: Glossary
description: Core technical terms, definitions, and acronyms used throughout the ZKite framework.
---

| Term | Meaning & Context |
| :--- | :--- |
| **ABI** | Application Binary Interface; the CPU target architecture an Android native library compiles for (e.g., `arm64-v8a` for 64-bit phones, `x86_64` for emulators). |
| **adb** | Android Debug Bridge; the host command-line utility used to communicate with and control authorized Android devices. |
| **APK** | Android Application Package; the file format used to install apps directly onto Android devices. |
| **AAB** | Android App Bundle; the format required by modern app stores (such as Google Play) to generate architecture-optimized split APKs. |
| **Callback** | A Python function or callable invoked in response to a user action (such as `on_tap` or `on_change`). |
| **Class String** | The utility string (e.g. `"flex-1 p-4 bg-slate-900"`) passed as the first positional argument to describe layout and styling. |
| **Controlled Input** | A form control whose displayed value and selection are bound to observable application state. |
| **Development Preview** | The temporary testing app instance deployed by `zkite dev` for live source syncing and hot reload. |
| **Hot Reload** | The instantaneous update of the running interface on device upon saving Python source files. |
| **Key** | A unique, stable identity passed to a widget to maintain its internal state across UI tree reconciliations. |
| **Native Rendering** | Drawing interfaces directly using native Android UI views and canvas, rather than inside a web browser viewport. |
| **Package ID** | Android's unique reverse-domain identifier for an application (e.g. `com.company.app`). |
| **Payload** | Prebuilt native Android runtime components distributed with ZKite. |
| **Signing Identity** | The private cryptographic key and certificate used to sign Android APKs and AABs. |
| **Store** | An observable in-memory class managing reactive application state. |
| **System Bars** | Android's status bar (top clock/battery) and navigation bar (bottom gestures/buttons). |
| **Virtual List** | A list container that instantiates only the currently visible rows to maintain optimal memory and frame rates. |
| **Widget Tree** | The hierarchical composition of widgets that declares the current screen interface. |
