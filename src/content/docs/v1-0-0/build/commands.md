---
title: CLI Command Reference
description: Complete reference for all zkite command-line interface tools and development flags.
---

The `zkite` CLI is your single tool for project creation, live development, standalone execution, diagnostics, key generation, and production builds.

---

## `zkite new`

Creates a fresh project directory with a runnable sample, default settings, styling configuration, and `.gitignore`.

```bash
zkite new <PROJECT_NAME>
```

---

## `zkite dev`

Installs a live development preview on the connected device and watches source files for changes.

```bash
zkite dev [OPTIONS]
```

| Flag | Argument | Description |
| :--- | :--- | :--- |
| `--serial` | `SERIAL` | Explicitly choose target device by adb serial identifier. |
| `--adb` | `PATH` | Custom path to the `adb` executable. |
| `--port` | `PORT` | Local host development bridge port (default: `8765`). |
| `--backend` | `native` | Force native rendering backend. |

---

## `zkite run`

Compiles a standalone APK, installs it onto the target device, and launches it.

```bash
zkite run [OPTIONS]
```

| Flag | Argument | Description |
| :--- | :--- | :--- |
| `--serial` | `SERIAL` | Target device serial number. |
| `--keystore` | `PATH` | Path to private signing key PEM file. |
| `--no-prune-stdlib` | *(None)* | Include the entire standard library without pruning. |
| `--logs` | *(None)* | Stream Android logcat output in terminal following launch. |

---

## `zkite build apk` & `zkite build aab`

Compiles installable APKs or distribution AAB bundles without requiring a connected physical device.

```bash
# Build per-architecture APK
zkite build apk --abi arm64-v8a --out dist/

# Build multi-architecture Android App Bundle for Google Play
zkite build aab --abi arm64-v8a --abi x86_64 --keystore release.pem
```

| Flag | Argument | Description |
| :--- | :--- | :--- |
| `--abi` | `arm64-v8a \| x86_64` | Target Android ABI architecture. Repeat `--abi` to bundle multiple architectures. |
| `--keystore` | `PATH` | Production signing PEM file. |
| `--out` | `DIRECTORY` | Destination directory for output artifacts (default: `dist/`). |
| `--no-prune-stdlib` | *(None)* | Retain full Python standard library. |

---

## `zkite doctor`

Runs an automated diagnostic check verifying host Python 3.14, platform architectures, native runtime payloads, and `adb` connectivity.

```bash
zkite doctor
```

---

## `zkite keygen`

Generates an Android release signing key pair.

```bash
zkite keygen --out release_key --cn "My App Release Key"
```

| Flag | Argument | Description |
| :--- | :--- | :--- |
| `--out` | `BASENAME` | Output file base name (creates `<BASENAME>.pem` and `<BASENAME>.p12`). |
| `--cn` | `NAME` | Certificate common name / organization identifier. |
| `--password` | `PASSWORD` | Password for the PKCS#12 keystore. |
