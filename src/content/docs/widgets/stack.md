---
title: Stack Widget
description: Layered composition container where later children are placed on top of earlier children along the Z-axis.
---

`Stack` overlays child widgets on top of each other. Later children in the argument list are drawn in front of earlier children.

## Code Example

```python
from zkite import Stack, Column, Text, Button, Icon

def NotificationBell(unread_count: int):
    return Stack(
        "relative w-12 h-12 justify-center items-center",
        # Base layer: Bell icon
        Icon("text-white text-2xl", name="notifications"),
        # Top layer: Unread badge
        Text(
            "absolute -top-1 -right-1 px-1.5 py-0.5 bg-rose-500 rounded-full text-white text-xs font-bold",
            str(unread_count)
        ) if unread_count > 0 else None,
    )
```

## Constructor & Properties

```python
Stack(classes: str, *children, key: str | None = None)
```

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `classes` | `str` | Yes | Positional classes configuring container dimensions and positioning context (`relative`). |
| `*children` | `Widget` | No | Child widgets stacked from back to front. |
| `key` | `str` | No | Stable widget key. |

## Guidance

* Use `Stack` for floating action buttons (FABs), badges attached to icons, and gradient scrims over background images.
* For full-screen modal overlays and dialogs, prefer the dedicated [`Overlay`](/widgets/overlay/) widget which integrates with Android's system back button.
