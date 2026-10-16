---
title: Troubleshooting & Diagnostics
description: Comprehensive stage-by-stage troubleshooting tables for installation, build, device, and UI issues.
---

When encountering issues, first identify which stage failed: **installation**, **build**, **device connection**, **runtime startup**, or **interaction**.

---

## 1. Installation & Command Issues

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| `zkite: command not found` | Virtual environment not active or scripts folder not in PATH | Activate your virtual environment (`source .venv/bin/activate` or `.\.venv\Scripts\Activate.ps1`) or call `.venv/bin/zkite` directly. |
| `No matching distribution found` | Unsupported Python minor version | Verify `python --version` outputs CPython 3.14. Recreate the virtual environment with Python 3.14. |
| `PowerShell activation script disabled` | Windows ExecutionPolicy restriction | Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`. |
| Wrong CLI release runs | Global pip path takes precedence | Verify with `which zkite` or `Get-Command zkite` to ensure you are executing the local `.venv` binary. |

---

## 2. Build & Packaging Issues

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| `No project or no main.py found` | Executed command outside the project directory | `cd` into the directory containing `pyproject.toml` and `main.py`. |
| Dependency cannot be resolved | Incompatible C-extension wheel | Ensure third-party packages in `[project].dependencies` are pure-Python wheels compatible with Android. |
| Module missing only on Android | Dynamic standard library import | Build or run with `--no-prune-stdlib` to retain the complete standard library. |
| Images fail to display | Subfolder staging limitation | Keep image assets directly in the project root beside `main.py` and specify explicit dimensions (`w-24 h-24`). |
| Launcher icon did not update | Launcher resource caching | Restart `zkite dev` or rerun `zkite run`. Launchers often cache icons—check the Android App Info settings screen. |

---

## 3. Device & Connection Issues

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| Device shows `unauthorized` in `adb devices` | Computer RSA key not accepted | Unlock your phone and tap **"Always allow from this computer"** on the USB prompt. |
| Multiple devices detected | Ambiguous target | Pass `--serial <SERIAL_ID>` or export `ANDROID_SERIAL=<SERIAL_ID>`. |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | Signing key mismatch with existing installation | Either build with the original signing key or uninstall the previous version if testing locally. |

---

## 4. UI & Rendering Issues

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| Text is invisible or missing | Passing text as first argument | Remember the **class-string-first** convention: `Text("text-white", "Hello")`, not `Text("Hello")`. |
| State changes but UI does not update | Mutating fields directly | Always mutate state using `store.update(field=new_val)` to trigger observer notifications. |
| ScrollView does not scroll | Unbounded viewport | Give the `ScrollView` bounded dimensions (e.g., `flex-1` or an explicit height `h-64`). |
| Status bar stays white in dark mode | Missing `SystemBars` wrapper | Wrap your root screen widget in `SystemBars(..., status_color="#0b0f19", status_icons="light")`. |
| Virtual list rows overlap or clip | Mismatched `item_height` | Ensure `item_height` matches the exact pixel/dp height of rows produced by your builder. |
