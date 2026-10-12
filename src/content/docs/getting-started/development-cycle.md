---
title: Development Cycle & Hot Reload
description: Master the difference between development previews and standalone runs, hot reload boundaries, and debugging logs.
---

ZKite offers two complementary execution modes: **Development Preview** (`zkite dev`) and **Standalone Run** (`zkite run`).

## Preview vs. Standalone Run

| Command | Purpose | Hot Reload? | Works Offline / Detached? |
| :--- | :--- | :--- | :--- |
| `zkite dev` | Fast development iteration with live code watching | **Yes** (Instant) | No (Requires host connection) |
| `zkite run` | Full standalone production-like build on phone | No | **Yes** (Independent APK) |

### 1. `zkite dev` (The Fast Lane)

When you run `zkite dev`:
1. ZKite installs a dedicated **Development Preview** APK on your authorized device.
2. It sets up an encrypted communication bridge over `adb`.
3. It watches your project directory for Python source file updates.
4. As soon as you save a `.py` file, ZKite transmits the changed code module and re-renders the active widget tree on the device.

```bash
# Start development preview
zkite dev
```

### 2. `zkite run` (Standalone Testing)

When you run `zkite run`:
1. ZKite bundles your code and standard library into a self-contained APK signed with your local development keystore.
2. It installs and launches the app directly on the phone.
3. You can disconnect your phone and take it with you—the app runs completely autonomously.

```bash
zkite run
```

---

## What Hot Reload Does and Does Not Reload

Understanding the boundaries of hot reload will save you time:

* **Instantly Hot-Reloaded**:
  * Changes to UI layout, styling classes, and widget hierarchies.
  * Logic inside event callbacks and helper functions in top-level `.py` files.
  * State store definitions.
* **Requires Restarting `zkite dev`**:
  * Adding or removing dependencies in `pyproject.toml`.
  * Replacing app icon files (`icon.png`).
  * Changes to native configuration or backend settings.

## Viewing Device Logs

To view Python print statements, tracebacks, and Android runtime logs directly in your terminal:

```bash
# Follow logs during a standalone run
zkite run --logs
```
