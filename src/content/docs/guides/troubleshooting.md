---
title: Troubleshooting & Diagnostics
description: Comprehensive stage-by-stage troubleshooting tables for installation, build, device, and UI issues.
---

When encountering issues, first identify which stage failed: **installation**, **build & packaging**, **device connection**, **runtime startup**, or **interaction**.

---

## 1. Installation & Command Problems

| Symptom | Checks and Next Action |
| :--- | :--- |
| `zkite` is not found | Use the environment's explicit executable path (`.venv/bin/zkite` or `.\.venv\Scripts\zkite.exe`); verify installation with that environment's pip. |
| No matching distribution | Verify CPython 3.14, 64-bit architecture (x86_64), and that your wheel matches your host OS. |
| Wrong release runs | Compare `zkite --version` with `python -m pip show zkite zkite-framework zkite-payload`. Inspect which executable your shell resolves. |
| Payload missing | Install the complete `zkite` distribution; do not copy only the CLI executable elsewhere without its payload dependencies. |
| Python version mismatch | Ensure CPython 3.14 is active. Recreate the virtual environment if necessary and verify with `zkite doctor`. |
| PowerShell activation blocked | Run `.venv\Scripts\python.exe` and `.\.venv\Scripts\zkite.exe` directly without calling `Activate.ps1`. |

---

## 2. Build & Packaging Problems

| Symptom | Checks and Next Action |
| :--- | :--- |
| No project or no `main.py` | Run commands from the project directory containing `app.json` and `main.py`. |
| Dependency cannot be resolved | Inspect the named dependency in `requirements.txt` or `pyproject.toml`; verify pure-Python Android compatibility. |
| Module missing only in the app | Check declared dependencies and top-level helper `.py` files; try `--no-prune-stdlib` for dynamic imports. |
| Local image missing | Verify format (PNG/JPEG), relative path (`assets/images/logo.png` or root), and explicit layout dimensions (`w-24 h-24`). |
| Remote HTTPS image missing | Ensure `"permissions": ["INTERNET"]` in `app.json`, valid HTTPS URL with TLS, and file size under 2 MiB. |
| Nested Python module missing | Automatic staging packages top-level `.py` files and `assets/`. Other nested application packages are not automatically staged. |
| App icon did not change | Check `android.icon` in `app.json`, verify real square PNG, and restart `zkite dev` or rerun `zkite run`. |
| AAB will not install with `adb` | An AAB is for Google Play distribution. Build an APK (`zkite build apk`) for direct `adb install`. |

---

## 3. Device & Connection Problems

| Symptom | Checks and Next Action |
| :--- | :--- |
| Unauthorized device | Unlock the phone screen and accept the USB debugging authorization prompt. |
| Multiple devices, no selection | In an interactive terminal, use arrow keys; in scripts or CI, pass `--serial <SERIAL>`. |
| Wrong device chosen | Inspect explicit `--serial` and `ANDROID_SERIAL`; an explicit `--serial` takes precedence. |
| Update rejected by Android | Compare package ID, signing key, SDK, architecture, and version code. Never decrease `version_code`. |
| Signature mismatch | Locate the original signing key; a new random key cannot update an app signed with another identity. |
| App appears twice in launcher | Distinguish the development preview (with dev label) from the standalone app. |

:::warning[Do Not Blindly Uninstall]
Do not automatically uninstall an existing app to hide an update failure. Uninstalling erases local user data and SQLite databases. Decide whether the installation is disposable before choosing that recovery path.
:::

---

## 4. UI & Rendering Problems

| Symptom | Checks and Next Action |
| :--- | :--- |
| Text label is missing | Check the class-string-first constructor convention: `Text("text-white text-base", "Label")`. |
| State changes but screen does not | Always use `store.update(field=value)` to trigger observer notifications. |
| Text input resets while typing | Ensure the field's `value` is connected to a store and maintain a stable `key`. |
| Screen does not scroll | Bound the scrolling region using `flex-1` / `min-h-0` or explicit height. |
| List rows overlap or clip | Verify fixed `item_height` against actual row content. |
| Select will not open or close | If `open` is explicit, update it in the corresponding callbacks. |
| Exit animation is invisible | Keep the widget present until its animation completion handler executes. |
| Top or bottom bar stays white | Wrap root screen in `SystemBars` and provide supported hex colors. |
| Icon contrast is poor | `light` and `dark` refer to icons, not backgrounds. Use `status_icons="auto"` or test explicit choices. |
| Blank screen after resume | Verify lifecycle handlers; inspect device logs with `zkite run --logs`. |

---

## Submitting a Useful Bug Report

When reporting an issue:
1. Include exact ZKite distribution versions (`python -m pip show zkite zkite-framework zkite-payload`).
2. Host OS, Python version, target device model, and Android OS version.
3. State whether the issue occurs in preview (`zkite dev`), standalone (`zkite run`), or both.
4. Provide the minimal reproducible code sample along with sanitized terminal logs.
