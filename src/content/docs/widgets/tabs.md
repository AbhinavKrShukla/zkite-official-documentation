---
title: Tabs Widget (Swipeable Tabs)
description: Controlled multi-page container supporting tab-button selection and smooth horizontal page swiping.
---

`Tabs` provides a controlled, swipeable tabbed interface. Native pages track horizontal finger gestures with momentum and snap smoothly to page boundaries, while tab button taps trigger an animated transition to the target page.

:::note[New in ZKite 1.1.2]
`Tabs` was introduced in ZKite 1.1.2 to support peer-level horizontal screen navigation alongside the existing stack-based `Nav` component.
:::

## Code Example

```python
from zkite import ScrollView, Tabs, Text, store

@store
class Screen:
    tab: int = 0

def view(s: Screen):
    return Tabs(
        "flex-1",
        ScrollView("flex-1", Text("p-6 text-slate-800", "Chats Screen")),
        ScrollView("flex-1", Text("p-6 text-slate-800", "Status Screen")),
        ScrollView("flex-1", Text("p-6 text-slate-800", "Calls Screen")),
        labels=["Chats", "Status", "Calls"],
        index=s.tab,
        on_change=lambda index: s.update(tab=index),
        key="main-tabs",
    )
```

---

## Constructor & Properties

```python
Tabs(
    classes: str,
    *pages: Widget,
    labels: list[str],
    index: int,
    on_change: Callable[[int], None],
    key: str,
)
```

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `classes` | `str` | Yes | Styling and dimension classes (e.g. `flex-1`, `w-full`). |
| `*pages` | `Widget` | Yes | Child page widgets representing each tab's content. |
| `labels` | `list[str]` | Yes | Text labels displayed on the tab navigation buttons. Count must match the number of pages. |
| `index` | `int` | Yes | Current active tab index (0-indexed), controlled via your reactive store. |
| `on_change` | `Callable[[int], None]` | Yes | Callback invoked when the user selects a tab button or completes a horizontal swipe to a new page. |
| `key` | `str` | Yes | Stable, unique widget key identifying this tab group across renders. |

---

## Key Behaviors & Best Practices

### 1. Controlled Selection
The active page index is strictly controlled by your store. When a user swipes horizontally or taps a tab button, `on_change` fires with the new 0-based index. Update your store field inside `on_change` (e.g., `s.update(tab=index)`).

### 2. State & Scroll Offset Preservation
Pages remain mounted in the view hierarchy as the user switches between them. This means that vertical scroll positions, form inputs, and child widget states inside each tab survive switching without resetting.

### 3. Gesture Isolation & Physics
* **Horizontal Gestures**: Native pages track horizontal finger movement with fluid velocity physics, animating cleanly to the nearest page boundary upon release.
* **Vertical Scrolling**: Vertical scroll events stay isolated to each page's internal `ScrollView`.
* **Cross-Platform Consistency**: On the WebView backend, `Tabs` uses native CSS scroll snapping (`scroll-snap-type: x mandatory`) and smooth programmatic scrolling.

### 4. When to Use `Tabs` vs. `Nav`

| Feature | `Tabs` | `Nav` |
| :--- | :--- | :--- |
| **Relationship** | Peer sections (equal hierarchy) | Hierarchical (parent -> child screens) |
| **Navigation Model** | Horizontal swiping & tab bar taps | Stack-based `push()`, `pop()`, `reset()` |
| **Android Back Button** | Handled at app level | Pops current screen off the stack |
| **Common Use Cases** | Chats / Status / Calls, Discover / Playground | Feed -> Detail view, Settings -> Profile Edit |

:::tip[Performance Tip]
Keep expensive side effects out of page construction. Because all tab pages remain mounted, build individual page layouts declaratively and use the `Task` API for asynchronous background I/O operations.
:::
