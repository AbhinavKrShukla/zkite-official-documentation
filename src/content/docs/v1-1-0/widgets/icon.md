---
title: Icon Widget
description: Display bundled native vector icons with customizable size and color.
---

`Icon` renders a named vector symbol from ZKite's bundled icon library. It scales cleanly to any resolution and adapts to text styling classes.

## Code Example

```python
from zkite import Row, Icon, Text

def StatusRow():
    return Row(
        "items-center gap-2 p-3 bg-slate-900 rounded-lg",
        Icon("text-emerald-400 text-xl", name="check-circle"),
        Text("text-sm text-white", "Device Connected via ADB"),
    )
```

## Constructor & Properties

```python
Icon(classes: str, name: str, key: str | None = None)
```

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `classes` | `str` | Yes | Positional utility classes controlling icon color (`text-emerald-400`) and size (`text-xl`, `text-2xl`). |
| `name` | `str` | Yes | Named identifier of the bundled vector symbol (e.g. `"settings"`, `"arrow-back"`, `"check-circle"`, `"search"`). |
| `key` | `str` | No | Stable widget key. |

## Guidance

* `Icon` uses the bundled icon set. It does not accept arbitrary raw SVG strings.
* Give icon-only buttons an accessible label or companion text when clarity is important for usability and TalkBack screen readers.
