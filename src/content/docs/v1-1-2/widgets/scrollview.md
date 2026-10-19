---
title: ScrollView Widget
description: Bounded viewport container enabling vertical or horizontal scrolling for dynamic content.
---

`ScrollView` allows content that exceeds the screen dimensions to be scrolled smoothly using native Android touch physics and scroll velocity.

## Code Example

```python
from zkite import ScrollView, Column, Text

def TermsOfService(paragraphs: list[str]):
    return ScrollView(
        "flex-1 w-full p-4 bg-slate-900 rounded-xl",
        Column(
            "gap-4",
            Text("text-xl font-bold text-white", "Terms & Conditions"),
            *[
                Text("text-sm text-slate-300 leading-relaxed", p, key=f"p-{i}")
                for i, p in enumerate(paragraphs)
            ]
        ),
        horizontal=False,
    )
```

## Constructor & Properties

```python
ScrollView(classes: str, *children, horizontal: bool = False, key: str | None = None)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `classes` | `str` | *None* | Utility classes defining the bounded viewport dimensions (e.g. `flex-1`, `h-64`). |
| `*children` | `Widget` | *None* | Content placed within the scrollable view. |
| `horizontal` | `bool` | `False` | When `True`, scrolling occurs along the X-axis rather than the default vertical axis. |
| `key` | `str` | `None` | Stable widget key. |

:::caution[Important: Bounded Dimensions & Flex Sizing]
A `ScrollView` must have bounded dimensions in the direction of scrolling. Inside a `Column`, give the `ScrollView` `flex-1` or an explicit height utility like `h-80`. Use `min-h-0` on intermediate parents to allow the container to shrink within the available screen space. If a view expands to fit every child without constraint, there may be nothing left to scroll inside its own bounds.
:::

---

## Smooth Momentum Scrolling (New in 1.1.2)

In ZKite 1.1.2, scroll momentum uses an adaptive, velocity- and density-aware spline curve sampled by elapsed time:
* **Velocity Tracking**: Natural deceleration curves calibrated to Android physical display densities.
* **Held-Finger Gesture Cancellation**: Holding a finger still before lifting cancels stale movement vectors, preventing unexpected inertia fling launches.
* **Fast Rendering Integrity**: Momentum calculation is frame-paced; keep view rendering and event handlers nonblocking (using `Task` for I/O) to sustain smooth 60/120 FPS scrolling.
