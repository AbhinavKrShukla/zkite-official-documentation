---
title: Slider Widget
description: Continuous or stepped numeric range selection control.
---

`Slider` allows users to select a numeric value within a defined range by dragging a slider thumb across a track.

## Code Example

```python
from zkite import Column, Row, Text, Slider

def VolumeControl(store):
    return Column(
        "gap-2 p-4 bg-slate-900 rounded-xl",
        Row(
            "justify-between items-center",
            Text("text-sm text-slate-300", "Volume Level"),
            Text("text-sm font-bold text-emerald-400", f"{int(store.volume)}%"),
        ),
        Slider(
            "w-full",
            value=store.volume,
            min=0.0,
            max=100.0,
            step=1.0,
            on_change=lambda val: store.update(volume=val),
        ),
    )
```

## Constructor & Properties

```python
Slider(
    classes: str,
    value: float = 0.0,
    min: float = 0.0,
    max: float = 100.0,
    step: float = 1.0,
    disabled: bool = False,
    on_change = None,
    key: str | None = None
)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `classes` | `str` | *None* | Utility classes defining slider width and container spacing. |
| `value` | `float` | `0.0` | Current controlled numeric position of the slider thumb. |
| `min` | `float` | `0.0` | Minimum allowable value at the left of the track. |
| `max` | `float` | `100.0` | Maximum allowable value at the right of the track. |
| `step` | `float` | `1.0` | Discrete increment step between valid values. |
| `disabled` | `bool` | `False` | **(1.1.1)** When `True`, dims the slider visually and ignores touch interactions. |
| `on_change` | `Callable[[float], None]` | `None` | Callback invoked with the updated numeric value as the thumb moves. In 1.1.1, the exact final position commits reliably on pointer up. |
| `key` | `str` | `None` | Stable widget key. |
