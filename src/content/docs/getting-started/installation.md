---
title: Installation
description: Install ZKite 1.0.0 in an isolated Python environment on Linux or Windows.
---

import { Tabs, TabItem } from '@astrojs/starlight/components';

Always install ZKite into a dedicated Python virtual environment. This prevents system package pollution and ensures consistent binary wheels.

:::caution[Python Version Requirement]
ZKite 1.0.0 requires **CPython 3.14**. Verify your interpreter version before creating the virtual environment:
```bash
python3.14 --version
```
:::

## Step-by-Step Setup

<Tabs>
  <TabItem label="Linux (Bash / Zsh)">
    ```bash
    # 1. Create a workspace directory and navigate into it
    mkdir -p ~/zkite-projects && cd ~/zkite-projects

    # 2. Create a virtual environment using Python 3.14
    python3.14 -m venv .venv

    # 3. Activate the virtual environment
    source .venv/bin/activate

    # 4. Upgrade pip and install ZKite 1.0.0
    pip install --upgrade pip
    pip install zkite==1.0.0
    ```
  </TabItem>
  <TabItem label="Windows (PowerShell)">
    ```powershell
    # 1. Create a workspace directory and navigate into it
    mkdir C:\zkite-projects; cd C:\zkite-projects

    # 2. Create a virtual environment with Python 3.14
    py -3.14 -m venv .venv

    # 3. Activate the virtual environment
    .\.venv\Scripts\Activate.ps1

    # 4. Upgrade pip and install ZKite 1.0.0
    python -m pip install --upgrade pip
    pip install zkite==1.0.0
    ```
    
    *If PowerShell script execution is restricted on your machine, you can run commands directly via `.\.venv\Scripts\zkite.exe`.*
  </TabItem>
</Tabs>

## Verifying the Installation

After installing, verify that the CLI and native toolchains are correctly discovered:

```bash
zkite --version
```

Expected output:
```text
zkite 1.0.0
```

Next, run the built-in system diagnostics tool:

```bash
zkite doctor
```

`zkite doctor` checks your host Python version, platform architecture, native payload availability, and `adb` connectivity. Resolve any warnings flagged before running your first project.
