---
title: Grid Widget
description: Two-dimensional matrix layout container for dashboard tiles, photo galleries, and structured grids.
---

`Grid` arranges children in a two-dimensional grid of rows and columns using supported grid utility classes.

## Code Example

```python
from zkite import Grid, Column, Text, Icon

def FeatureMatrix():
    features = [
        ("analytics", "Analytics", "Track usage metrics"),
        ("shield", "Security", "Hardware-backed keys"),
        ("zap", "Performance", "Direct native rendering"),
        ("cloud", "Sync", "Cloud storage sync"),
    ]

    return Grid(
        "grid-cols-2 gap-3 w-full p-4",
        *[
            Column(
                "p-4 bg-slate-900 border border-slate-800 rounded-xl gap-2",
                Icon("text-emerald-400 text-2xl", name=icon),
                Text("text-base font-bold text-white", title),
                Text("text-xs text-slate-400", desc),
                key=f"feat-{title}"
            )
            for icon, title, desc in features
        ]
    )
```

## Constructor & Properties

```python
Grid(classes: str, *children, key: str | None = None)
```

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `classes` | `str` | Yes | Positional utility classes defining column divisions (`grid-cols-2`, `grid-cols-3`) and gaps (`gap-3`). |
| `*children` | `Widget` | No | Child items placed in the grid cells. |
| `key` | `str` | No | Stable widget key. |
