---
title: Layout & Styling
description: Layout containers, utility class styling conventions, spacing scales, and scroll constraints in ZKite.
---

ZKite uses an ergonomic, utility-class-driven layout system. Instead of writing separate XML layout files or web stylesheets, you apply utility names as the first argument to each widget.

While styling resembles a supported subset of Tailwind utilities, ZKite is **not a browser CSS engine**. Utilities are rendered directly by ZKite's native Android graphics pipeline.

---

## Container Selection

Choosing the correct container ensures predictable Android layout and performance:

| Container | Use It For | Main Consideration |
| :--- | :--- | :--- |
| `Column` | Vertical groups of controls or sections. | Give growing content a bounded available space. |
| `Row` | Horizontal groups, action bars, label/value pairs. | Consider wrapping or available width on small screens. |
| `Grid` | Repeated items in explicit columns. | Define a suitable column count and gap. |
| `Stack` | Overlapping elements along the Z-axis. | Later children appear above earlier children. |
| `ScrollView` | A finite collection that can exceed the viewport. | Bound the viewport; otherwise it may simply grow without scrolling. |
| `Tabs` | Multi-page horizontal swipeable screens (New in 1.1.2). | Controlled index, stable keys, peer views with horizontal swipe momentum. |
| `List` | Many fixed-height repeated rows. | Declare an accurate row height and stable identity. |

```python
from zkite import Column, Row, Text, Button

def Header():
    return Row(
        "w-full justify-between items-center px-4 py-3 bg-slate-900 border-b border-slate-800",
        Text("text-lg font-bold text-white", "Inbox"),
        Button("p-2 bg-slate-800 rounded-lg", Text("text-xs text-white", "Filter")),
    )
```

---

## Density-Aware Coordinate System

Spacing and layout use ZKite's **density-aware coordinate system**. Layout values are independent of physical device screen pixel density. Always test your interfaces on both narrow screens and larger devices, and check layout behavior when the Android soft keyboard appears.

---

## Scroll Sizing & Momentum Physics (New in 1.1.2)

A scrolling container needs a constrained viewport:

* In a vertical `Column`, a growing content region commonly uses `flex-1`; combining this with `min-h-0` on intermediate parents allows the region to shrink within the available screen height.
* If a container expands indefinitely to fit every child, there is nothing left to scroll inside its own bounds.
* **Smooth Momentum Physics**: Scrolling in 1.1.2 uses a velocity- and density-aware spline sampled by elapsed time. A held finger stops stale movement vectors from launching unwanted inertia flings.
* For horizontal scrolling, pass `horizontal=True` to `ScrollView`:
  ```python
  ScrollView("flex-1 p-4", child1, child2, horizontal=True)
  ```
* Choose `ScrollView` for ordinary finite screens; choose `List` for large datasets with predictable fixed row heights.

---

## Text Wrapping, Line Limits & Overflow Controls (New in 1.1.2)

In ZKite 1.1.2, text wraps within its available width by default. You have explicit, cross-platform controls for line limits and ellipsis truncation:

```python
from zkite import Text

# Single-line truncation with ellipsis
Text("flex-1", title, multiline=False, overflow="ellipsis")

# Multi-line clamp at 3 lines with ellipsis
Text("w-full", summary, max_lines=3, overflow="ellipsis")

# Hard line-clamp clipping at 2 lines
Text("w-full", description, max_lines=2, overflow="clip")

# Unwrapped marquee or visible overflow
Text("", ticker, wrap=False, overflow="visible")
```

* `overflow` accepts `"clip"` (default), `"ellipsis"`, or `"visible"`.
* `max_lines` must be a positive integer.
* Native truncation respects Unicode grapheme boundaries.
* Ellipsis needs a constrained width, supplied by the parent or a width class like `flex-1` or `w-full`.

---

## Styling Configuration (`zkite.tailwind.json`)

New projects created with `zkite new` include `zkite.tailwind.json`. This configuration assists editors and language servers with autocomplete for supported utility classes. Remember that editor suggestions are assistance—only the native backend supported utilities are rendered.

---

## System Theme Consistency

Styling your app with dark background classes (such as `bg-slate-950`) does not automatically tint Android's system status bar or navigation bar. Always wrap your root screen in [`SystemBars`](/widgets/system-bars/) to ensure high-contrast system icons and matching bar backgrounds.
