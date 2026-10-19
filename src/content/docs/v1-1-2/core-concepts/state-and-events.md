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

---

## Background I/O with the `Task` API (New in 1.1.2)

`view()` and ordinary event callbacks run synchronously on the UI thread. Any blocking operation—such as `urllib.request`, an HTTP client call, or reading a large local file—freezes user input and skips frames until it finishes.

ZKite 1.1.2 introduces the **`Task` API** for nonblocking background I/O. Create tasks at module scope, launch them from event handlers, and read their reactive states (`loading`, `data`, `error`) directly inside `view()`:

```python
import json
from urllib.request import urlopen
from zkite import Button, Column, Task, Text

# 1. Define task at module scope
request = Task()

def fetch_items():
    with urlopen("https://api.example.com/items", timeout=15) as response:
        return json.loads(response.read())

def view():
    return Column(
        "flex-1 p-6 gap-4 bg-white",
        Button(
            "bg-orange-600 text-white p-4 rounded-xl",
            "Refresh Data",
            on_tap=lambda: request.start(fetch_items),
            disabled=request.loading,
        ),
        # Read reactive task state directly
        Text("text-slate-700", "Loading…" if request.loading else str(request.data)),
        Text("text-red-700", str(request.error) if request.error else ""),
    )
```

### Task Lifecycle & Mechanics
* **Nonblocking Dispatch**: `Task.start(fn, *args, **kwargs)` returns immediately. Work executes across 4 managed background workers with a bounded admission queue of 32 jobs.
* **Reactive Frame Push**: When the worker returns a value, the framework automatically updates `request.loading`, `request.data`, and `request.error` under the render lock and pushes a fresh UI frame.
* **Data Retention**: During re-fetches or failures, the previous successful `data` remains available so the UI doesn't abruptly collapse to blank.
* **Automatic Invalidation & Cancellation**: Starting the same task again invalidates earlier in-flight results. Calling `request.cancel()` or triggering a hot reload immediately discards stale results.
* **Return Values vs. Direct Mutation**: Workers must return data rather than directly updating widgets or stores from thread code.
* **Async Event Callbacks**: Async event callbacks are also supported, but synchronous work inside them still blocks their event loop; use `Task` for blocking network or file I/O.

---

## Error Handling & Public Diagnostics

### 1. Cleaner Public Errors (New in 1.1.2)
Framework errors no longer expose internal planning-document references or internal module paths. They provide clear, actionable guidance pointing directly to application entry points (such as `main.py`'s `view()` function or misconfigured widget properties).

### 2. Standalone vs. Development Error Behavior
* **Standalone APK / AAB**: Uncaught Python startup, render, and event exceptions display a clean generic restart message rather than rendering raw traceback text on user screens.
* **Diagnostics**: Full tracebacks are preserved in device logcat (`zkite run --logs`).
* **Development Mode (`zkite dev`)**: Retains interactive error overlays with detailed code frames. Invalid dependency changes are reported in the dev console without crashing the running app on device.
