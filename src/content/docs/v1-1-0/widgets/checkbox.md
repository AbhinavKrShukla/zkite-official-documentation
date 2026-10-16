---
title: Checkbox Widget
description: Checkbox control for selecting one or more independent options.
---

`Checkbox` allows users to select one or multiple choices from a set.

## Code Example

```python
from zkite import Row, Text, Checkbox

def TodoItem(task: str, done: bool, on_toggle):
    return Row(
        "items-center gap-3 p-2.5",
        Checkbox(
            "",
            checked=done,
            on_change=on_toggle,
        ),
        Text(
            "text-sm text-slate-400 line-through" if done else "text-sm text-white",
            task
        ),
    )
```

## Constructor & Properties

```python
Checkbox(classes: str, checked: bool = False, on_change = None, key: str | None = None)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `classes` | `str` | *None* | Utility classes for styling. |
| `checked` | `bool` | `False` | Boolean checked state. |
| `on_change` | `Callable[[bool], None]` | `None` | Callback invoked with the updated boolean state. |
| `key` | `str` | `None` | Stable widget key. |
