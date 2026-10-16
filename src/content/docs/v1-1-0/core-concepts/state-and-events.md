---
title: State Management & Events
description: Declare application state using @store, mutate with update(), manage controlled values, and handle errors.
---

In ZKite, the user interface is a pure function of application state. When state changes, the framework re-evaluates the view and updates native views.

---

## Declaring State with `@store`

Application state is declared using the `@store` decorator. Annotated fields define the state values with default fallbacks:

```python
from zkite import store

@store
class ProfileStore:
    username: str = "Alice"
    email: str = ""
    is_notifications_enabled: bool = True
    tap_count: int = 0

profile = ProfileStore()
```

Annotated store parameters in a view are automatically supplied by the framework when requested.

---

## Mutating State with `store.update()`

To change values and request an updated interface, always call the store's `update` method:

```python
# Update one or multiple fields
profile.update(
    tap_count=profile.tap_count + 1,
    is_notifications_enabled=False
)
```

:::caution[Direct Assignment Does Not Trigger Updates]
Directly assigning a field (`profile.tap_count = 5`) or mutating a list in-place does not trigger framework notifications. For collection changes, prepare the new list/dict and pass it to `update()`:
```python
new_items = [*profile.items, "New Item"]
profile.update(items=new_items)
```
:::

---

## Controlled Values

Interactive widgets (`TextField`, `Switch`, `Checkbox`, `Radio`, `Slider`, `Select`) are **controlled widgets**:

* The displayed value comes from a store field.
* User actions invoke event callbacks that call `store.update()`.
* If a callback does not update the store, a subsequent render restores the previous value.

```python
from zkite import TextField

TextField(
    "p-3 bg-slate-900 rounded-lg text-white",
    value=profile.username,
    on_change=lambda text: profile.update(username=text),
    placeholder="Enter username...",
)
```

:::tip[Transient vs. Durable State]
Separate transient UI state (e.g. `dialog_open: bool`) from durable data (e.g. user records or notes). Hot reload preserving values in memory does not mean Android process termination will preserve them.
:::

---

## Slow Work and Error Boundaries

### 1. Offload Slow Operations
Keep callbacks short for responsive 60/120 FPS interaction. Move blocking work (network requests, slow SQLite queries, large file reads) away from the rendering path using Python worker threads:

```python
import threading

def fetch_data():
    profile.update(is_loading=True)

    def worker():
        try:
            # Perform blocking I/O off the main thread
            data = do_network_call()
            profile.update(data=data, is_loading=False)
        except Exception as err:
            profile.update(error=str(err), is_loading=False)

    threading.Thread(target=worker, daemon=True).start()
```

### 2. Standalone Error Masking (1.1.0)
* **Standalone APK / AAB**: Uncaught Python startup, render, and event exceptions display a generic restart message rather than rendering raw traceback text on user screens.
* **Diagnostics**: Full tracebacks are preserved in device logcat (`zkite run --logs`).
* **Development Mode**: `zkite dev` continues to display full interactive error overlays with detailed code frames.
