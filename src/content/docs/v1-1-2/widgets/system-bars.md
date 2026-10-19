---
title: SystemBars Widget
description: Style Android status bar and navigation bar background colors and icon contrast.
---

`SystemBars` is a root wrapper widget that controls the background color and icon contrast of Android's top **Status Bar** (clock/battery/notifications) and bottom **Navigation Bar** (gesture bar or 3-button navigation).

## Code Example

```python
from zkite import SystemBars, Column, Text

def ThemedRoot(is_dark_mode: bool):
    bg_color = "#0b0f19" if is_dark_mode else "#ffffff"
    bar_icons = "light" if is_dark_mode else "dark"

    return SystemBars(
        Column(
            "flex-1 p-6 justify-center items-center",
            Text("text-xl font-bold", "Adaptive Themed App"),
        ),
        status_color=bg_color,
        navigation_color=bg_color,
        status_icons=bar_icons,
        navigation_icons=bar_icons,
    )
```

## Constructor & Properties

```python
SystemBars(
    child: Widget,
    status_color: str = "#ffffff",
    navigation_color: str | None = None,
    status_icons: str = "auto",
    navigation_icons: str = "auto"
)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `child` | `Widget` | *None* | Required. The root screen widget being wrapped. Adds zero layout padding. |
| `status_color` | `str` | `"#ffffff"` | Hex color string (`"#RGB"` or `"#RRGGBB"`) for the top Android status bar. |
| `navigation_color` | `str \| None` | `None` | Hex color string for bottom navigation bar. Inherits `status_color` if omitted. |
| `status_icons` | `str` | `"auto"` | Icon contrast: `"auto"`, `"light"` (for dark bars), or `"dark"` (for light bars). |
| `navigation_icons` | `str` | `"auto"` | Contrast mode for bottom navigation buttons/gestures. |

## Crucial Clarification: What `light` and `dark` Mean

:::important[Icon Contrast vs Background Color]
`status_icons="light"` means the **icons themselves are light-colored (white)**, which is suitable for a **dark background**.
`status_icons="dark"` means the **icons are dark-colored (black)**, which is suitable for a **light background**.
`"auto"` dynamically calculates the contrasting icon tone based on your hex background color.
:::
