---
title: List Widget (Virtual List)
description: High-performance virtualized recycler for smoothly scrolling through large collections of fixed-height rows.
---

`List` provides high-performance row virtualization on Android. It builds only the visible rows plus a small buffer, enabling 60 FPS scrolling through thousands of items without exhausting mobile device memory.

## Code Example

```python
from zkite import List, Row, Column, Text, Icon

def ContactList(contacts: list[dict]):
    ROW_HEIGHT = 64  # Fixed pixel/dp height for each row

    def build_row(index: int):
        contact = contacts[index]
        return Row(
            "h-16 items-center px-4 border-b border-slate-800 gap-3 bg-slate-900",
            Icon("text-slate-400 text-xl", name="person"),
            Column(
                "flex-1 justify-center",
                Text("text-base font-medium text-white", contact["name"]),
                Text("text-xs text-slate-400", contact["phone"]),
            ),
            key=f"contact-{contact['id']}"
        )

    return List(
        "flex-1 w-full bg-slate-950",
        count=len(contacts),
        item_height=ROW_HEIGHT,
        builder=build_row,
        overscan=4,
    )
```

## Constructor & Properties

```python
List(
    classes: str,
    count: int,
    item_height: int,
    builder: Callable[[int], Widget],
    overscan: int = 4,
    key: str | None = None
)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `classes` | `str` | *None* | Utility classes defining list container bounds (e.g. `flex-1 w-full`). |
| `count` | `int` | *None* | Total number of items in the list. |
| `item_height` | `int` | *None* | Exact fixed height (in density-independent units) of each individual row. |
| `builder` | `Callable[[int], Widget]` | *None* | Function that receives the zero-based index `i` and returns the row widget. |
| `overscan` | `int` | `4` | Number of buffer rows instantiated above and below the visible viewport to prevent flicker during fast scrolling. |
| `key` | `str` | `None` | Stable widget key. |

## Important Rules for Virtual Lists

:::caution[Fixed Row Heights Required]
`List` requires a **strict, uniform `item_height`**. If your row heights vary unpredictably based on dynamic text lengths, use a [`ScrollView`](/widgets/scrollview/) instead. Providing an incorrect `item_height` will result in visual clipping or jittery scroll positions.
:::

* **Keep `builder` Fast**: Do not perform file I/O, heavy calculations, or network requests inside the `builder` function. The builder is called repeatedly during scroll gestures.
* **Bounded Viewport**: Always ensure the `List` container has bounded dimensions (`flex-1` or an explicit height utility).
* **Viewport Hit-Test Isolation (1.1.1)**: Clipped list items outside the viewport respect boundary clipping and cannot intercept tap gestures meant for other views.
* **Scroll Offset Clamping (1.1.1)**: If the item count decreases while scrolled down, ZKite automatically clamps the scroll offset after layout, preventing empty viewports.
