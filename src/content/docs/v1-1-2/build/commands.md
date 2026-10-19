---
title: CLI Command Reference
description: Complete reference for all zkite command-line interface tools and development flags in ZKite 1.1.1.
---

The `zkite` CLI is your single tool for project creation, live development, standalone execution, diagnostics, key generation, and production builds.

`zkite --version` and `zkite --help` work globally without requiring an existing project or connected phone.

---

## `zkite new`

Scaffolds a new project with `main.py`, `app.json`, `assets/`, `zkite.tailwind.json`, and `.gitignore`. New projects generated in ZKite 1.1.2 feature an interactive orange-and-white Discover/Playground interface with swipeable tabs instead of a basic counter.

```bash
# Create a new directory and scaffold files
zkite new myapp

# Or scaffold into the current working directory
zkite new myapp .
```

* Existing scaffold paths are never overwritten.
* Unrelated files in the target directory are preserved.
* Creating or upgrading the framework does not overwrite existing application source code.

---

## `zkite dev`

Prepares and installs a project preview, connects to the selected device, and watches supported source changes and dependency declarations for instant hot reload. In ZKite 1.1.2, editing dependencies in `requirements.txt` or `pyproject.toml` automatically synchronizes packages live without restarting dev.

```bash
zkite dev [OPTIONS]
```

| Option | Argument | Description |
| :--- | :--- | :--- |
| `--serial` | `SERIAL` | Explicitly choose target device by serial number. |
| `--adb` | `PATH` | Custom path to the `adb` executable. |
| `--port` | `NUMBER` | Local host development bridge port (default: `8765`). |
| `--backend` | `native` | Explicitly select native rendering backend. |
| `--devshell-apk` | `PATH` | Advanced custom-shell APK override (usually unnecessary). |

---

## `zkite run`

Builds a standalone APK for the selected device architecture, installs it, and launches it. Uses the project's `.zkite/debug.pem` development signing identity.

```bash
zkite run [OPTIONS]
```

| Option | Argument | Description |
| :--- | :--- | :--- |
| `--serial` | `SERIAL` | Target device serial number. |
| `--adb` | `PATH` | Custom path to `adb`. |
| `--backend` | `native` | Select native rendering backend. |
| `--keystore` | `PATH` | Override automatic signing identity with an existing combined PEM file. |
| `--no-prune-stdlib` | *(None)* | Include the full Python standard library without pruning. |
| `--logs` | *(None)* | Continue streaming Android logcat output in terminal following launch. |

---

## `zkite build apk` & `zkite build aab`

Compiles installable APKs or distribution AAB bundles without requiring a connected physical device. APK output is per-architecture; an AAB bundles selected architectures together.

Both commands automatically discover and reuse `keystore/release.pem`. If no default key exists, the build creates the PEM/PKCS#12 pair under `keystore/`.

```bash
# Build per-architecture APK with automatic keystore discovery
zkite build apk --abi arm64-v8a --out dist/

# Build multi-architecture Android App Bundle for Google Play
zkite build aab --abi arm64-v8a --abi x86_64
```

| Option | Argument | Description |
| :--- | :--- | :--- |
| `--abi` | `arm64-v8a \| x86_64` | Include specified architecture. Repeat `--abi` to select both. Defaults to all supported prebuilt ABIs if omitted. |
| `--keystore` | `PATH` | Override automatic release-key discovery with an explicit combined PEM file. |
| `--out` | `DIRECTORY` | Output directory (default: `dist/`). |
| `--no-prune-stdlib` | *(None)* | Disable Python standard library pruning. |
| `--backend` | `native` | Select native rendering backend. |

---

## `zkite doctor`

Checks local toolchains, selected Python interpreter, bundled native runtime payloads, and device connections.

```bash
zkite doctor [--adb PATH]
```

---

## `zkite keygen`

Generates release signing keys. In ZKite 1.1.2, it creates `keystore/release.pem` and `keystore/release.p12` by default, automatically generating the `keystore/` directory and its Git ignore rule. Existing key files are never overwritten.

```bash
# Default key generation under keystore/
zkite keygen --cn "My company"

# Explicit output basename and password
zkite keygen --out keystore/custom_key --cn "My company" --password secret
```

| Option | Argument | Description |
| :--- | :--- | :--- |
| `--out` | `BASENAME` | Output file base name (default: `keystore/release`). |
| `--cn` | `NAME` | Certificate common name / organization identifier. |
| `--password` | `PASSWORD` | Password for the PKCS#12 keystore. |
