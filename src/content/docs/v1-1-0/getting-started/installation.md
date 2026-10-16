---
title: Installation
description: Install ZKite 1.1.0 (or 1.0.0) in an isolated Python environment on Linux or Windows.
---

import { Tabs, TabItem } from '@astrojs/starlight/components';

Always install ZKite into a dedicated Python virtual environment. This prevents system package pollution and ensures consistent binary wheels.

:::caution[Python Version Requirement]
ZKite requires **CPython 3.14**. Use the same minor version as the supplied Android runtime. Verify your interpreter version before creating the virtual environment:
```bash
python3.14 --version
```
:::

## Step-by-Step Installation

<Tabs>
  <TabItem label="Linux (Bash / Zsh)">
    Run these commands in order in your terminal:

    ```bash
    # 1. Create a virtual environment with Python 3.14
    python3.14 -m venv .venv

    # 2. Activate the virtual environment
    source .venv/bin/activate

    # 3. Install ZKite 1.1.0
    python -m pip install zkite==1.1.0

    # 4. Verify CLI and ADB
    zkite --version
    adb version
    ```

    *The Linux wheel requires glibc 2.28 or newer; musl-only distributions (like Alpine) are not supported.*
  </TabItem>
  <TabItem label="Windows (PowerShell)">
    In PowerShell, run:

    ```powershell
    # 1. Create a virtual environment with Python 3.14
    py -3.14 -m venv .venv

    # 2. Install ZKite 1.1.0 using the environment's python directly
    .\.venv\Scripts\python.exe -m pip install zkite==1.1.0

    # 3. Verify CLI and ADB
    .\.venv\Scripts\zkite.exe --version
    adb version
    ```

    *These commands do not require activating a PowerShell script. If script execution is restricted on your machine, continue using explicit executable paths. When moving into a project directory one level below, the CLI path is `..\.venv\Scripts\zkite.exe`.*
  </TabItem>
</Tabs>

---

## Installing Previous Stable Version (1.0.0)

If your existing project requires the previous stable release, install `zkite==1.0.0`:

```bash
pip install zkite==1.0.0
```

:::note[Differences in 1.0.0]
ZKite 1.0.0 uses `pyproject.toml` configuration, flat root file staging, and does not include the 1.1.0 scaffold and HTTPS image loader. See the [What's New in 1.1.0 & Migration Guide](/v1-1-0/getting-started/migration-1-1/) or read the complete [ZKite 1.0.0 Documentation](/v1-0-0/getting-started/overview/).
:::

---

## Installing from Local Wheels

For locally supplied wheels prior to PyPI indexing:

1. Place the compatible host CLI wheel (`manylinux` or `win_amd64`) and both shared wheels (`zkite-framework` and `zkite-payload`) into a single directory.
2. Run:
   ```bash
   python -m pip install --no-index --find-links PATH_TO_WHEELS zkite==1.1.0
   ```

---

## Verifying the Installation

### 1. Check Package Versions
Install the `zkite` distribution for the complete tool. Always keep all three distributions (`zkite`, `zkite-framework`, and `zkite-payload`) at the exact same release version:

```bash
python -m pip show zkite zkite-framework zkite-payload
```

Check for dependency consistency:
```bash
python -m pip check
```

### 2. Check CLI Version
```bash
zkite --version
```
Expected output:
```text
zkite 1.1.0
```

### 3. Run System Diagnostics
```bash
zkite doctor
```

`zkite doctor` checks your host Python, selected runtime, bundled Android payloads, and device connectivity. When executed inside an app project directory, it also validates project requirements.
