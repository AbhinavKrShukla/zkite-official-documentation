---
title: Layout & Styling
description: Layout containers, utility class styling conventions, spacing scales, and screen sizing in ZKite.
---

ZKite uses an ergonomic, utility-class-driven layout system. Instead of writing separate XML layout files or CSS style sheets, you apply standard utility names as the first argument to each widget.

## Container Selection

Choosing the correct container is essential for predictable Android layouts:

| Container | Behavior | Typical Use Case |
| :--- | :--- | :--- |
| `Column` | Vertically stacks child widgets. | Forms, vertical content, settings lists. |
| `Row` | Horizontally arranges child widgets. | Header bars, stat counters, buttons side-by-side. |
| `Grid` | Two-dimensional matrix of cells. | Photo galleries, dashboard cards, calculators. |
| `Stack` | Layers children on top of each other along the Z-axis. | Floating action buttons, badges over icons, card overlays. |
| `ScrollView` | Adds scrolling to content exceeding the screen height or width. | Long articles, scrolling feeds, tall forms. |

```python
from zkite import Column, Row, Text, Button

def Header():
    return Row(
        "w-full justify-between items-center px-4 py-3 bg-slate-900 border-b border-slate-800",
        Text("text-lg font-bold text-white", "Inbox"),
        Button("p-2 bg-slate-800 rounded-lg", Text("text-xs text-white", "Filter")),
    )
```

## Common Utility Classes

ZKite supports familiar utility abbreviations for layout, flexbox, spacing, and typography:

* **Flexbox & Sizing**:
  * `flex-1` (expand to fill available space)
  * `w-full`, `h-full`, `w-auto`, `h-auto`
  * `items-center`, `items-start`, `items-end`
  * `justify-between`, `justify-center`, `justify-start`, `justify-end`
* **Spacing**:
  * Padding: `p-2`, `p-4`, `p-6`, `px-4`, `py-2`
  * Margin: `m-2`, `m-4`, `mb-6`, `mt-4`
  * Gap between children: `gap-2`, `gap-4`, `gap-6`
* **Colors & Borders**:
  * Backgrounds: `bg-slate-900`, `bg-emerald-500`, `bg-white`, `bg-transparent`
  * Borders: `border`, `border-slate-800`, `rounded-md`, `rounded-xl`, `rounded-full`
* **Typography**:
  * Sizes: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`
  * Weights: `font-normal`, `font-medium`, `font-semibold`, `font-bold`
  * Colors: `text-white`, `text-slate-400`, `text-emerald-400`, `text-rose-500`

## Scroll Sizing & Constraints

:::caution[Bounding Scroll Views]
When nesting a `ScrollView` inside a `Column`, make sure the `ScrollView` has bounded dimensions (e.g., `flex-1` or explicit height like `h-64`). An unbounded scroll container inside an unconstrained flex layout can cause scroll calculation anomalies.
:::
