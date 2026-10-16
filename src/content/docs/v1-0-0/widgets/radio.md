---
title: Radio Widget
description: Single-choice selection control driven by application state.
---

`Radio` allows selecting one option from a list. In ZKite, radio groups are managed through your application state rather than implicit DOM or form groups.

## Code Example

```python
from zkite import Column, Row, Text, Radio

def ThemeSelector(store):
    options = [("dark", "Dark Mode"), ("light", "Light Mode"), ("system", "System Default")]

    return Column(
        "gap-2 p-3 bg-slate-900 rounded-xl",
        Text("text-sm font-semibold text-slate-300 mb-1", "Interface Theme"),
        *[
            Row(
                "items-center gap-3 p-2",
                Radio(
                    "",
                    checked=(store.theme == value),
                    on_change=lambda is_checked, v=value: store.update(theme=v) if is_checked else None,
                ),
                Text("text-sm text-white", label),
                key=f"radio-{value}"
            )
            for value, label in options
        ]
    )
```

## Constructor & Properties

```python
Radio(classes: str, checked: bool = False, on_change = None, key: str | None = None)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `classes` | `str` | *None* | Utility classes for styling. |
| `checked` | `bool` | `False` | Boolean state indicating if this specific radio is currently chosen. |
| `on_change` | `Callable[[bool], None]` | `None` | Callback invoked when the radio is selected. |
| `key` | `str` | `None` | Stable widget key. |

:::tip[State-Driven Radio Groups]
Radio buttons do not form an automatic group solely because they are placed next to each other. Store the selected value in your `Store`, and derive `checked=(store.selected == value)` for each individual radio button.
:::
