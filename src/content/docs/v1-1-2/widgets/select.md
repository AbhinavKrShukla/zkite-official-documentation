---
title: Select Widget
description: Dropdown selection picker combining a tap trigger with a native modal options panel.
---

`Select` presents a trigger button that opens an option selection panel. Options can be plain values or `(value, label)` pairs.

## Code Example

```python
from zkite import Column, Text, Select

def CountryPicker(store):
    countries = [
        ("us", "United States (+1)"),
        ("in", "India (+91)"),
        ("gb", "United Kingdom (+44)"),
        ("de", "Germany (+49)"),
    ]

    return Column(
        "gap-2 w-full",
        Text("text-sm text-slate-300", "Select Country Code"),
        Select(
            "p-3 bg-slate-900 border border-slate-700 rounded-xl text-white",
            options=countries,
            value=store.selected_country,
            placeholder="Choose your region...",
            on_change=lambda val: store.update(selected_country=val),
        ),
    )
```

## Constructor & Properties

```python
Select(
    classes: str,
    options: list,
    value: Any = None,
    placeholder: str = "Select an option",
    open: bool | None = None,
    on_change = None,
    on_open = None,
    on_dismiss = None,
    key: str | None = None
)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `classes` | `str` | *None* | Utility classes styling the trigger container. |
| `options` | `list` | *None* | List of values (e.g. `["Red", "Green"]`) or `(value, label)` tuples. |
| `value` | `Any` | `None` | Currently selected value. |
| `placeholder` | `str` | `"Select..."` | Text shown when no value is selected. |
| `open` | `bool \| None` | `None` | Optional controlled open state. If omitted, `Select` manages open state internally. |
| `on_change` | `Callable[[Any], None]` | `None` | Callback invoked with the chosen option's raw value. |
| `on_open` | `Callable[[], None]` | `None` | Callback invoked when the picker requests to open. |
| `on_dismiss` | `Callable[[], None]` | `None` | Callback invoked when the panel is dismissed. |
| `key` | `str` | `None` | Stable widget key. |

:::tip[Value/Label Separation]
Labels are strictly for display in the UI. When an option is selected, `on_change` receives the original **value** (e.g. `"us"`), allowing your application code to work with exact data types.
:::
