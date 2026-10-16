---
title: Native Motion & Animation
description: Declarative animations with opacity, translation, spring physics, and completion callbacks in ZKite.
---

ZKite provides native hardware-accelerated animations for **opacity** and **translation** (along the X and Y axes).

## Animation Triggers

ZKite defines three primary animation triggers:

* `Anim.enter`: Animated transitions when a widget mounts to the tree.
* `Anim.change`: Transitions triggered when a bound value or property changes.
* `Anim.exit_`: Exit transitions before a widget is unmounted.

## Code Example

```python
from zkite import Column, Text, Anim

def FadeInBanner(message: str):
    return Column(
        "p-4 bg-emerald-950 border border-emerald-800 rounded-xl",
        Text("text-white text-base", message),
        # Animate entrance: Slide up from 20dp below and fade in
        anim=Anim.enter(
            opacity=(0.0, 1.0),
            translate_y=(20, 0),
            duration=350,
            easing="ease-out",
        ),
    )
```

## Physics vs. Timed Duration

You can specify either **duration-based** or **spring-physics-based** transitions:

### 1. Duration & Easing
```python
Anim.enter(
    opacity=(0.0, 1.0),
    duration=300,  # Milliseconds
    easing="ease-out",  # "linear", "ease-in", "ease-out", "ease-in-out"
    delay=100,  # Milliseconds delay before starting
)
```

### 2. Spring Physics
```python
Anim.change(
    translate_y=(10, 0),
    stiffness=180,  # Spring stiffness
    damping=12,     # Spring damping factor
)
```

## Completion Callbacks & Exit Animations

When coordinating sequential transitions, listen to `on_animend`:

```python
def handle_completion(event):
    print(f"Animation complete on channel: {event.channel}")

Column(
    "p-4 bg-slate-900 rounded-xl",
    Text("text-white", "Sliding Panel"),
    anim=Anim.exit_(opacity=(1.0, 0.0), duration=250),
    on_animend=handle_completion,
)
```

:::caution[Handling Exit Animations]
For exit animations (`Anim.exit_`), keep the widget in your application state until `on_animend` fires. Immediately removing the widget from your tree eliminates the view before Android can play the exit frames.
:::
