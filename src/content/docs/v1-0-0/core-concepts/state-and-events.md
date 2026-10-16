---
title: State Management & Events
description: Manage application state using reactive Stores, controlled inputs, and off-thread execution in ZKite.
---

In ZKite, the user interface is a pure function of your application state. When state changes, widgets reading that state automatically re-render.

## Using `Store`

A `Store` is an observable data model. Subclass `Store` and declare your typed fields:

```python
from zkite import Store

class ProfileStore(Store):
    username: str = "Alice"
    email: str = ""
    is_notifications_enabled: bool = True
    tap_count: int = 0

store = ProfileStore()
```

### Updating State with `store.update()`

To mutate state and trigger reactive UI updates, always call `store.update()`:

```python
# Update one or multiple fields simultaneously
store.update(
    tap_count=store.tap_count + 1,
    is_notifications_enabled=False
)
```

Direct mutations (e.g. `store.tap_count = 5`) do not notify observers; always use `store.update()`.

---

## Controlled Values

Interactive controls like `TextField`, `Checkbox`, `Switch`, and `Slider` are **controlled widgets**. Their visible values are derived from your store, and their event callbacks update the store:

```python
from zkite import Column, TextField, Text

def NameInput():
    return Column(
        "gap-2",
        Text("text-sm text-slate-300", "Your Username"),
        TextField(
            "p-3 bg-slate-800 rounded-lg text-white border border-slate-700",
            value=store.username,
            on_change=lambda text: store.update(username=text),
            placeholder="Enter username...",
        ),
    )
```

---

## Slow Work and Thread Boundaries

Mobile users expect fluid 60/120 FPS animations and interactions. Never perform heavy CPU calculations, disk I/O, or blocking network calls directly inside event callbacks or component build functions.

### Offloading Slow Work to Threads

Use standard Python threading or background tasks for slow operations:

```python
import threading
import time

def fetch_data_in_background():
    # Set loading indicator
    store.update(is_loading=True)

    def worker():
        try:
            # Simulate network request or database query
            time.sleep(2)
            result = "Fetched 42 records"
            # Safely push result back into the reactive store
            store.update(data=result, is_loading=False)
        except Exception as e:
            store.update(error=str(e), is_loading=False)

    threading.Thread(target=worker, daemon=True).start()
```
