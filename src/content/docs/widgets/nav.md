---
title: Nav Widget (Screen Navigation)
description: Stack-based native screen navigation with push, pop, reset, pre-mutation validation, and entrance transitions.
---

`Nav` manages a stack of mobile screens. In ZKite 1.1.1, screen navigation features native entrance transitions, pre-mutation argument validation, screen identity isolation, and stack reset capabilities.

## Code Example

```python
from zkite import Button, Column, Nav, Navigator, Text

def home(nav: Navigator):
    return Column(
        "flex-1 p-6 justify-center items-center gap-4 bg-slate-900",
        Text("text-2xl font-bold text-white", "Home Screen"),
        Button(
            "p-4 bg-emerald-500 rounded-xl",
            Text("text-white font-bold", "Open Item 42"),
            on_tap=lambda: nav.push(detail, item_id=42),
        ),
    )

def detail(nav: Navigator, item_id: int):
    return Column(
        "flex-1 p-6 justify-center items-center gap-4 bg-slate-900",
        Text("text-2xl font-bold text-white", f"Item #{item_id}"),
        Button(
            "p-4 bg-slate-800 rounded-xl",
            Text("text-slate-200", "Back"),
            on_tap=nav.pop,
        ),
    )

def view():
    # Pass classes and registered screens; entrance animations enabled by default
    return Nav("flex-1", home, detail)
```

---

## Navigator Methods

The `nav` instance passed to each screen provides the following methods:

| Method | Behavior |
| :--- | :--- |
| `nav.push(screen, **params)` | Validates parameters and pushes a new screen onto the stack with its own identity. |
| `nav.pop()` | Pops the top screen and returns to the previous entry, restoring its identity. |
| `nav.replace(screen, **params)` | Replaces the current destination without increasing stack depth. |
| `nav.reset(screen, **params)` | **(New in 1.1.1)** Replaces the entire stack with one destination and parameters. |
| `nav.pop_to_root()` | Clears all pushed screens back down to the root screen. |
| `nav.current_entry` | Property inspecting the active `Entry` and its keyword parameters. |

---

## What's New in 1.1.1 Navigation

### 1. Native Entrance Transitions
By default, screens use a 160 ms native slide-and-fade entrance animation. To disable this transition across a navigation host:
```python
Nav("flex-1", home, detail, transition=False)
```
*An explicit animation on a screen's root widget takes precedence over the default transition.*

### 2. Pre-mutation Validation
After a `Nav` registers its screens, attempting to navigate to an unregistered destination or passing missing or unexpected keyword parameters immediately raises a Python exception **before altering the stack**.

### 3. Screen Identity & State Isolation
Each pushed entry has its own unique widget identity and keys. Repeated pushes of the same screen template (e.g., viewing Item 1, tapping a related link to open Item 2) do not cross-contaminate text input focus, caret positions, or scroll offsets. Returning to a previous entry preserves its original scroll and focus state.

### 4. Nested Navigation Hosts
A nested `Nav(host=...)` automatically injects that host into its child screens' `Navigator` parameters, allowing nested tab or sub-stack architectures.

---

## Android Back Button Integration

* Pressing Android's physical or gesture **Back** button triggers `nav.pop()`.
* If an [`Overlay`](/widgets/overlay/) (such as a modal or bottom sheet) is active, Android Back dismisses the overlay first before popping navigation.
* At the root screen, unhandled Back minimizes or leaves the activity.
