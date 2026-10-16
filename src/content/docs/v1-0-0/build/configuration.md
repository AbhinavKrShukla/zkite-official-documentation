---
title: Configuration Reference (pyproject.toml)
description: Complete specification of project metadata and Android packaging settings in pyproject.toml.
---

ZKite applications use standard Python `pyproject.toml` for metadata, dependencies, and native Android packaging settings.

## Example `pyproject.toml`

```toml
[project]
name = "mobile-notes"
version = "1.0.0"
description = "A native note-taking app written in Python"
dependencies = [
    "pydantic>=2.0.0"
]

[tool.zkite]
backend = "native"

[tool.zkite.android]
package = "com.company.mobilenotes"
label = "Mobile Notes"
version_code = 100
min_sdk = 26
target_sdk = 36
permissions = [
    "android.permission.INTERNET",
    "android.permission.ACCESS_NETWORK_STATE"
]
icon = "icon.png"
```

## Configuration Specification

### Project Metadata (`[project]`)

| Key | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | Distribution-style package name of your project. |
| `version` | `string` | Semantic application version string (e.g. `"1.0.0"`). Independent of framework version. |
| `dependencies` | `list[str]` | List of third-party pure-Python dependencies to resolve from PyPI. |

### Framework Options (`[tool.zkite]`)

| Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `backend` | `string` | `"native"` | UI rendering engine. Must be `"native"` for native Android views. |

### Android Packaging Options (`[tool.zkite.android]`)

| Key | Type | Default | Guidance & Requirements |
| :--- | :--- | :--- | :--- |
| `package` | `string` | *Required* | Android application ID (e.g. `com.example.app`). Must be stable across releases. |
| `label` | `string` | *Required* | Human-readable app name displayed under the app icon on the home screen. |
| `version_code` | `integer` | `1` | Integer base for Android versioning. **Must increment** on every store update. |
| `min_sdk` | `integer` | `26` | Minimum supported Android API level (API 26 = Android 8.0). |
| `target_sdk` | `integer` | `36` | Target Android API level against which the app is compiled. |
| `permissions` | `list[str]` | `[]` | Android manifest permissions required by application features. |
| `icon` | `string` | `None` | Project-relative path to a square PNG icon file (minimum 192x192 pixels). |

:::important[App Identity & Updates]
Android decides whether an installed APK can be updated based on **`package`** and the **Signing Key**. Changing the `label` does not affect app identity, but changing `package` will install a completely separate app on the device.
:::
