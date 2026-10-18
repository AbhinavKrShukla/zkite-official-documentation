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
Text(
    classes: str,
    content: str,
    wrap: bool = True,
    multiline: bool = True,
    max_lines: int | None = None,
    overflow: str = "clip",
    key: str | None = None,
)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `classes` | `str` | *Required* | Positional utility classes controlling font size, weight, color, alignment, and width constraints. |
| `content` | `str` | *Required* | The textual string to render on screen. Unicode characters and emojis are fully supported. |
| `wrap` | `bool` | `True` | **(New in 1.1.2)** When `False`, text does not wrap to subsequent lines. |
| `multiline` | `bool` | `True` | **(New in 1.1.2)** When `False`, restricts text to a single unwrapped line. |
| `max_lines` | `int \| None` | `None` | **(New in 1.1.2)** Positive integer limiting the maximum number of rendered lines. |
| `overflow` | `str` | `"clip"` | **(New in 1.1.2)** Truncation strategy: `"clip"` (default), `"ellipsis"`, or `"visible"`. |
| `key` | `str` | `None` | Stable widget key. |

---

## Text Wrapping, Line Limits & Overflow Controls

In ZKite 1.1.2, text wraps within its available width by default. You can configure exact line clamping, ellipsis truncation, or visible overflow:

```python
from zkite import Text

# Single-line truncation with ellipsis
Text("flex-1", title, multiline=False, overflow="ellipsis")

# Multi-line clamp at 3 lines with ellipsis
Text("w-full", summary, max_lines=3, overflow="ellipsis")

# Hard line-clamp clipping at 2 lines
Text("w-full", description, max_lines=2, overflow="clip")

# Unwrapped marquee or overflowing text
Text("", ticker, wrap=False, overflow="visible")
```

### Truncation Guidelines
* **Parent Constraints**: Ellipsis requires a constrained width, supplied by a parent widget or an explicit width class (e.g. `flex-1`, `w-full`, `w-64`).
* **Unicode & Grapheme Clusters**: Native truncation respects Unicode grapheme boundaries, preventing split surrogate pairs or corrupted emoji sequences.
* **Paragraph Scoping**: Avoid multiple independently styled child widgets inside one truncated Text; apply line limits to each paragraph separately.

---

## Emoji & Color Flag Fonts

Use Unicode emoji directly in any `Text` widget string:

```python
Text("text-lg", "🚀 Launching to production! 🇿🇼 🥑 🎯")
```

* **Native Noto Fonts**: Native rendering uses Android's installed Noto emoji fonts, including full-color bitmaps and regional flag sequences.
* **No Corruption**: Multi-byte emojis and UTF-16 surrogates are correctly preserved across the JNI bridge.

:::tip[Remember the First Argument]
Always pass the class string first!
* **Correct**: `Text("text-xl text-white", "Welcome")`
* **Incorrect**: `Text("Welcome")` *(Treats "Welcome" as a styling class, leaving content empty)*
:::
