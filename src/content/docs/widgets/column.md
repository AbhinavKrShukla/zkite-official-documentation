---
title: Column Widget
description: Vertical linear layout container for organizing widgets sequentially from top to bottom.
---

`Column` organizes child widgets in a vertical sequence. It is the primary building block for forms, scrollable feeds, and screen layouts in ZKite.

## Code Example

```python
from zkite import Column, Text, Button

def UserCard(username: str, role: str):
    return Column(
        "w-full p-4 bg-slate-900 rounded-xl border border-slate-800 gap-3",
        Text("text-lg font-bold text-white", username),
        Text("text-sm text-emerald-400 font-medium", role),
        Button(
            "w-full py-2 bg-slate-800 rounded-lg",
            Text("text-sm text-slate-200 text-center", "View Profile"),
            on_tap=lambda: print(f"Selected {username}"),
        ),
    )
```

## Constructor & Properties

```python
Column(classes: str, *children, key: str | None = None)
```

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `classes` | `str` | Yes | Positional utility class string defining layout, flex, padding, and spacing. |
| `*children` | `Widget` | No | Variable number of child widgets placed sequentially from top to bottom. |
| `key` | `str` | No | Stable identifier across UI tree reconciliations. |

## Common Layout Utilities

* **Flex sizing**: `flex-1` expands the column to occupy all available vertical space in its parent.
* **Child Spacing**: `gap-2`, `gap-4`, `gap-6` automatically separates children without manual margins.
* **Alignment**:
  * Cross-axis (horizontal): `items-start`, `items-center`, `items-end`, `items-stretch`.
  * Main-axis (vertical): `justify-start`, `justify-center`, `justify-between`, `justify-end`.
