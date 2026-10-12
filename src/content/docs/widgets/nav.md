---
title: Nav Widget (Screen Navigation)
description: Stack-based screen navigation with push, pop, replace, and Android Back button handling.
---

`Nav` manages a stack of mobile screens. You register screen functions under distinct route names, and use the `Navigator` controller to move between views.

## Code Example

```python
from zkite import Nav, Navigator, Column, Text, Button

def HomeScreen(nav: Navigator):
    return Column(
        "flex-1 p-6 justify-center items-center gap-4 bg-slate-900",
        Text("text-2xl font-bold text-white", "Home Screen"),
        Button(
            "px-6 py-3 bg-emerald-500 rounded-xl",
            Text("text-white font-bold", "Go to Profile"),
            on_tap=lambda: nav.push("profile", user_id="42"),
        ),
    )

def ProfileScreen(nav: Navigator, user_id: str = "0"):
    return Column(
        "flex-1 p-6 justify-center items-center gap-4 bg-slate-900",
        Text("text-2xl font-bold text-white", f"User Profile #{user_id}"),
        Button(
            "px-6 py-3 bg-slate-800 rounded-xl",
            Text("text-slate-200", "Back to Home"),
            on_tap=nav.pop,
        ),
    )

def App():
    return Nav(
        home=HomeScreen,
        profile=ProfileScreen,
    )
```

## Navigator Methods

The `nav` instance passed into each screen provides the following methods:

| Method | Behavior |
| :--- | :--- |
| `nav.push(name, **params)` | Pushes a new screen onto the stack above the current view. |
| `nav.pop()` | Pops the top screen and returns to the previous view. |
| `nav.replace(name, **params)` | Replaces the current destination without adding to stack depth. |
| `nav.pop_to_root()` | Clears the stack back down to the initial root screen. |
| `nav.current_entry` | Property returning the active route name and passed keyword parameters. |

## Android Back Button Integration

* Pressing Android's physical or gesture **Back** button automatically triggers `nav.pop()`.
* If an [`Overlay`](/widgets/overlay/) is visible, Android Back dismisses the overlay first before popping screen navigation.
* Pressing Back at the root screen minimizes or leaves the application.
