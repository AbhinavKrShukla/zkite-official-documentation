---
title: Row Widget
description: Horizontal linear layout container for placing widgets side-by-side.
---

`Row` places child widgets horizontally from left to right. It is typically used for navigation headers, button bars, stat cards, and horizontal chips.

## Code Example

```python
from zkite import Row, Text, Icon, Button

def ActionBar():
    return Row(
        "w-full items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800",
        Row(
            "items-center gap-2",
            Icon("text-emerald-400 text-xl", name="arrow-back"),
            Text("text-base font-semibold text-white", "Settings"),
        ),
        Button(
            "px-3 py-1.5 bg-emerald-500 rounded-lg",
            Text("text-xs font-bold text-white", "Save Changes"),
            on_tap=handle_save,
        ),
    )
```

## Constructor & Properties

```python
Row(classes: str, *children, key: str | None = None)
```

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `classes` | `str` | Yes | Positional utility classes controlling alignment, width, and gap. |
| `*children` | `Widget` | No | Child widgets placed horizontally. |
| `key` | `str` | No | Stable widget key. |

## Guidance

* Use `w-full` if the row should span the full width of the parent.
* Combine `justify-between` and `items-center` for standard mobile navigation bar layouts.
* If children overflow the screen horizontally, wrap the `Row` in a `ScrollView(..., horizontal=True)`.
