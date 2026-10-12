---
title: Image Widget
description: Display local packaged PNG/JPEG assets and data URIs with native hardware decoding.
---

`Image` renders raster images on screen. It supports packaged local project PNG/JPEG files and valid data URIs.

## Code Example

```python
from zkite import Column, Image, Text

def AvatarCard():
    return Column(
        "items-center p-4 bg-slate-900 rounded-2xl gap-3",
        Image(
            "w-24 h-24 rounded-full border-2 border-emerald-500",
            src="avatar.png",
            alt="User Profile Photo",
            fit="cover"
        ),
        Text("text-lg font-bold text-white", "Alex Morgan"),
    )
```

## Constructor & Properties

```python
Image(classes: str, src: str, alt: str = "", fit: str = "cover", key: str | None = None)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `classes` | `str` | *None* | Utility classes defining explicit width, height (`w-24 h-24`), border radius, and clips. |
| `src` | `str` | *None* | Relative project asset filename (e.g. `"logo.png"`) or supported data URI. |
| `alt` | `str` | `""` | Accessibility text label for screen readers. |
| `fit` | `str` | `"cover"` | Scaling mode: `"cover"`, `"contain"`, `"fill"`, `"none"`, or `"scale-down"`. |
| `key` | `str` | `None` | Stable widget key. |

## Important Packaging Rules

* **Place beside `main.py`**: Asset files must reside in the root project directory beside `main.py` for automatic packaging in this release.
* **Always set dimensions**: Give the image an explicit width and height (`w-32 h-32`, `w-full h-48`). An image without dimensions may collapse to zero layout space.
* **Remote Images**: ZKite does not include an automatic remote HTTP image loader; download images to local storage first before displaying.
