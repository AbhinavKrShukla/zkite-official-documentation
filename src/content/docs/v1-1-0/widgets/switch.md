---
title: Switch Widget
description: Binary toggle switch control for turning settings and features on or off.
---

`Switch` provides an Android-native slide toggle for boolean preferences and settings.

## Code Example

```python
from zkite import Row, Text, Switch

def SettingToggle(label: str, is_active: bool, on_toggle):
    return Row(
        "w-full items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800",
        Text("text-base font-medium text-white", label),
        Switch(
            "scale-100",
            checked=is_active,
            on_change=on_toggle,
        ),
    )
```

## Constructor & Properties

```python
Switch(classes: str, checked: bool = False, on_change = None, key: str | None = None)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `classes` | `str` | *None* | Utility classes controlling sizing and positioning. |
| `checked` | `bool` | `False` | Current boolean state of the switch. |
| `on_change` | `Callable[[bool], None]` | `None` | Callback invoked with the new boolean state when toggled. |
| `key` | `str` | `None` | Stable widget key. |
