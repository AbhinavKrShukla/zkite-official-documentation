---
title: Declarative UI & Widget Tree
description: Understand how ZKite describes user interfaces, widget constructor conventions, and stable identity keys.
---

ZKite applications are built declaratively. You do not manually instantiate Android `View` objects or manipulate browser DOM elements. Instead, your entry module exports a top-level function named `view` that returns a **Widget Tree** describing what the interface should look like for the current state.

---

## The `view` Entry Point & Hierarchy

The framework automatically discovers your top-level `view` function:

```python title="main.py"
from zkite import Column, Row, Text, Icon, Button

def view():
    return Column(
        "flex-1 p-4 bg-slate-950",
        Row(
            "w-full items-center justify-between mb-4",
            Text("text-xl font-bold text-white", "Dashboard"),
            Icon("text-white text-lg", name="settings"),
        ),
        Text("text-slate-400 mb-6", "Welcome back!"),
        Button(
            "w-full py-3 bg-emerald-500 rounded-xl",
            Text("text-white font-semibold text-center", "Start New Task"),
            on_tap=handle_start_task,
        ),
    )
```

:::tip[No Need for App.run()]
An ordinary ZKite app does not need to call `App.run()`. The exported `App` type is provided for specialized test harnesses or integration, but is not needed in scaffolded projects.
:::

---

## Constructor Conventions: Class-String-First

Most widgets follow a strict constructor convention:

:::important[Class String is the First Positional Argument]
Most widgets take their **class string first**, followed by children or visible content:

```python
# First positional argument is styling classes:
Text("text-lg font-bold text-white", "Visible Headline")
Button("px-4 py-2 bg-blue-600 rounded-lg", Text("text-white", "Click Me"), on_tap=action)
Column("flex-1 p-4 gap-2", child1, child2)
```

Passing visible text as the first argument treats that text as styling classes, causing rendering issues or missing labels.

**Exception**: `SystemBars` is a deliberate exception where the first positional argument is the screen widget it wraps:
```python
SystemBars(screen_widget, status_color="#000000")
```
:::

---

## Widget Identity & Keys

When state updates and `view` evaluates again, ZKite compares the new widget tree with the existing tree:

* Use a **stable `key`** when controls move, when list items are reordered, or when animation/input state needs to remain associated with the same item:
  ```python
  for item in items:
      Row(
          "p-3 border-b border-slate-800",
          Text("text-white", item.name),
          key=f"item-{item.id}"
      )
  ```
* **Do not use random keys**: Generating a new key on every render forces Android to recreate the native view, losing cursor focus and animations.
* **Avoid array indices as keys** when items can be inserted, deleted, or reordered.

---

## Public Framework Exports

Always import from the public `zkite` namespace:

```python
from zkite import (
    # Layout & composition
    Column, Row, Grid, Stack, ScrollView, Tabs,
    # Display & controls
    Text, Image, Icon, Button, TextField, Switch, Checkbox, Radio, Slider, Select,
    # Recycler & system
    List, SystemBars, Overlay,
    # State, tasks & navigation
    store, Task, Nav, Navigator, NavigationHost, Entry,
    # Animation & base types
    Anim, AnimEnd, Widget, App
)
```

Internal module paths are private and not part of the supported public API.
