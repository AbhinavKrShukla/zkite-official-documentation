---
title: Configuration Reference (app.json & TOML)
description: Complete specification of project settings in app.json for ZKite 1.1.1/1.1.0 and legacy pyproject.toml for 1.0.0.
---

ZKite 1.1.1 uses a declarative **`app.json`** file for project identity, Android packaging, permissions, and build configuration. Legacy **`pyproject.toml`** configuration remains fully supported for backward compatibility.

---

## 1. `app.json` Specification (ZKite 1.1.1 & 1.1.0)

Run project commands in the directory beside `app.json`.

```json title="app.json"
{
  "name": "myapp",
  "version": "0.1.0",
  "backend": "native",
  "android": {
    "package": "com.yourcompany.myapp",
    "label": "My App",
    "version_code": 1,
    "min_sdk": 26,
    "target_sdk": 36,
    "permissions": ["INTERNET"],
    "icon": "assets/icon.png"
  }
}
```

### Project Metadata Keys

| Key | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | Project/distribution-style name used by the application project. |
| `version` | `string` | Application version text. Independent of the framework release. |
| `backend` | `string` | Rendering backend. `"native"` is the default and supported path. |
| `dependencies` | `list[str]` | *(Legacy only)* Merged with deprecation warning; prefer `requirements.txt` or `[project].dependencies` in `pyproject.toml`. |

### Android Settings (`android`)

| Key | Type | Default | Purpose & Guidance |
| :--- | :--- | :--- | :--- |
| `package` | `string` | *Required* | Android application ID (reverse-domain style, e.g. `com.company.app`). Must remain stable across store updates. |
| `label` | `string` | *Required* | Human-readable app display name shown by the Android launcher. |
| `version_code` | `integer` | `1` | Integer base used in generated Android versioning. Must increase for updates. |
| `min_sdk` | `integer` | `26` | Minimum Android API level floor (API 26 = Android 8.0). |
| `target_sdk` | `integer` | `36` | Target Android API level against which the app behavior is verified. |
| `permissions` | `list[str]` | `["INTERNET"]` | Manifest permission declarations required by application features. |
| `icon` | `string` | *(ZKite logo)* | Project-relative path to launcher icon PNG (e.g. `"assets/icon.png"`). In 1.1.2, builds wrap this as a full-bleed adaptive icon without baked-in padding. |

:::important[App Identity & Keystore Management]
* **Update Identity**: Android determines whether an installation is an update to an existing app based on **`package`** and the **Signing Identity**. Never decrease `version_code` on an intended update.
* **Automatic Signing Keys (1.1.2)**: Release keys are stored under `keystore/` (e.g. `keystore/release.pem` and `keystore/release.p12`). The folder is automatically added to `.gitignore`. Keep secure backups of your release signing identity.
:::

---

## 2. Legacy `pyproject.toml` Specification (ZKite 1.0.0)

If your project does not have an `app.json`, ZKite automatically reads legacy settings from `pyproject.toml`:

```toml title="pyproject.toml (Legacy 1.0.0)"
[project]
name = "myapp"
version = "0.1.0"
dependencies = [
    "requests==2.32.5",
]

[tool.zkite]
backend = "native"

[tool.zkite.android]
package = "com.yourcompany.myapp"
label = "My App"
version_code = 1
min_sdk = 26
target_sdk = 36
permissions = ["INTERNET"]
icon = "icon.png"
```

### Precedence Rule
* When `app.json` exists in the project root, **all application and Android settings are read exclusively from `app.json`**.
* Legacy `[tool.zkite]` sections in `pyproject.toml` are ignored when `app.json` is present.
* `pyproject.toml` remains valid and useful for package managers (like uv) to track Python dependencies via `[project].dependencies`.
