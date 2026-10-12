---
title: Text Widget
description: Render text strings with typography scales, colors, alignment, and native Android font rendering.
---

`Text` displays typography on screen. The first positional argument is the utility class string, followed by the text string to display.

## Code Example

```python
from zkite import Column, Text

def TypographyDemo():
    return Column(
        "gap-3 p-4 bg-slate-900 rounded-xl",
        Text("text-2xl font-bold text-white", "App Title"),
        Text("text-base font-semibold text-emerald-400", "Section Header"),
        Text("text-sm text-slate-300 leading-normal", "This is readable body copy rendered via native Android text APIs."),
        Text("text-xs text-slate-500 uppercase tracking-wider", "Metadata Footer"),
    )
```

## Constructor & Properties

```python
Text(classes: str, content: str, key: str | None = None)
```

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `classes` | `str` | Yes | Positional utility classes controlling font size, weight, color, alignment, and spacing. |
| `content` | `str` | Yes | The textual string to render on screen. |
| `key` | `str` | No | Stable widget key. |

:::tip[Remember the First Argument]
Always pass the class string first!
* **Correct**: `Text("text-xl text-white", "Welcome")`
* **Incorrect**: `Text("Welcome")` *(Treats "Welcome" as a styling class, leaving content empty)*
:::
