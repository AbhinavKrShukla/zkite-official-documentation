---
title: Declarative UI & Widget Tree
description: Understand how ZKite describes user interfaces, widget constructor conventions, and stable identity keys.
---

ZKite applications are built declaratively. You do not manually instantiate Android `View` objects or manipulate DOM elements. Instead, you compose a **Widget Tree** that describes what the screen should look like for a given application state.

## The Widget Tree Hierarchy

Your root application component returns a hierarchy of widgets:

```python
from zkite import Column, Row, Text, Icon, Button

def Screen():
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

## The Class-String-First Convention

Notice how widgets in ZKite are constructed:

:::tip[Core Rule: First Positional Argument is the Class String]
In almost all ZKite widgets, the **first positional argument** is a utility class string that controls styling, sizing, and layout:

```python
# First argument is layout/styling classes, followed by children or content:
Text("text-lg font-bold text-white", "Headline")
Column("flex-1 p-4 gap-2", child1, child2)
```

Omitting the class string or passing visible text as the first argument will treat your text as styling classes, causing rendering issues.
:::

## Widget Identity & Keys

When state changes and your component re-runs, ZKite compares the new widget tree with the existing tree to update native views efficiently.

For dynamic or reordered items (such as items inside a list or fields with user input), assign a stable `key`:

```python
for item in items:
    Row("p-3 border-b border-slate-800",
        Text("text-white", item.name),
        key=f"item-{item.id}"
    )
```

A stable `key` ensures that Android preserves internal state (such as focused text fields, scroll offsets, and active animations) rather than destroying and recreating native views.
