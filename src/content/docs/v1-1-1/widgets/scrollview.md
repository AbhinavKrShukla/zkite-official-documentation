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

:::caution[Important: Bounded Dimensions]
A `ScrollView` must have bounded dimensions in the direction of scrolling. Inside a `Column`, give the `ScrollView` `flex-1` or an explicit height utility like `h-80`. Unbounded dimensions can cause layout calculation issues.
:::
