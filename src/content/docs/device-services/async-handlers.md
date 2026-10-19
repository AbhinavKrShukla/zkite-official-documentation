---
title: Async Handlers & Error Model
description: Asynchronous event handling, the typed DeviceError exception hierarchy, concurrency limits, and lifecycle safety during reloads.
---

Because Android device operations (such as camera capture, file pickers, runtime permission dialogs, and audio recording) involve external system activities and I/O, ZKite executes them through **asynchronous event handlers**.

---

## Writing Async Event Handlers

Define UI event handlers with `async def`. ZKite runs them on a managed background async event loop, completely isolating device I/O and system dialogs from Android's 60/120 FPS UI rendering thread:

```python title="main.py"
from zkite import Button, Column, Text, store
from zkite import files
from zkite.errors import DeviceError

@store
class FormStore:
    selected_name: str = "No file selected"
    is_busy: bool = False

def view(state: FormStore):
    async def handle_choose_file():
        state.update(is_busy=True)
        try:
            # Asynchronously prompts the Android document picker
            file = await files.pick(types=["application/pdf", "image/*"])
            if file is not None:
                state.update(selected_name=file.name)
        except DeviceError as exc:
            state.update(selected_name=f"Error: {exc}")
        finally:
            state.update(is_busy=False)

    return Column("flex-1 p-6 gap-4 bg-white",
        Button("p-4 bg-indigo-600 text-white rounded-xl", "Attach Document",
               on_tap=handle_choose_file, disabled=state.is_busy),
        Text("text-slate-700", state.selected_name)
    )
```

### Atomic State Updates

Calls to `state.update(...)` inside async handlers are **thread-safe and atomic with respect to frame rendering**. When `state.update()` is called, ZKite commits the changes under the render lock and schedules a smooth UI frame redraw.

:::tip[Keep Handlers Responsive]
Async handlers run on the event loop. For heavy CPU calculations or blocking Python operations (such as uncompressed image manipulation or synchronous file hashing), offload the work using `asyncio.to_thread` or ZKite's `Task` API.
:::

---

## Cancellation Semantics

ZKite cleanly differentiates between user actions, timeouts, and programmatic cancellations:

| Scenario | Return Value / Raised Exception | Description |
| :--- | :--- | :--- |
| **User Dismissal** | Returns `None` (`[]` for multi-pickers) | The user tapped back or cancelled the system file picker, camera, or chooser dialog. |
| **Programmatic Cancel** | Raises `asyncio.CancelledError` | The calling task was cancelled by your code or discarded during a hot reload. |
| **Operation Timeout** | Raises `TimeoutError` | A bounded request (such as location query or network upload) exceeded its configured timeout. |
| **Platform Failure** | Raises a subclass of `DeviceError` | An error occurred within the native Android service or hardware layer. |

---

## The `DeviceError` Exception Hierarchy

All device service exceptions inherit from `zkite.errors.DeviceError`. Catch specific exceptions to offer graceful recovery in your UI:

```python
from zkite.errors import (
    DeviceError,
    PermissionDenied,
    PermissionNotDeclared,
    UnsupportedFeature,
    ResourceBusy,
    DeviceUnavailable,
    OperationInterrupted,
    DeviceIOError,
    RuntimeMismatch,
)
```

### Exception Reference

* **`PermissionDenied`**: The user refused runtime consent when prompted with Android's permission dialog. Your UI should explain why the permission is needed or provide alternative functionality.
* **`PermissionNotDeclared`**: The requested operation requires a permission that was neither inferred by the static scanner nor declared in `app.json`.
* **`UnsupportedFeature`**: The requested hardware (such as a magnetometer, step counter, camera torch, or biometric scanner) is absent on the physical device.
* **`ResourceBusy`**: An interactive system dialog (e.g., file picker or camera) is already active, or a hardware resource (e.g., microphone) is locked by another process.
* **`DeviceUnavailable`**: The operation was invoked on an unsupported platform (such as desktop during testing or in the experimental WebView backend).
* **`OperationInterrupted`**: The activity was backgrounded, replaced, or interrupted before the device operation finished.
* **`DeviceIOError`**: A low-level streaming or storage error occurred while reading from or writing to an Android ContentProvider.
* **`RuntimeMismatch`**: The bundled mobile runtime version does not match the expected API protocol.

In development builds, uncaught async errors display an informative debug traceback overlay on your phone. In production release builds, uncaught errors display a graceful application recovery screen.

---

## Concurrency & Resource Limits

To protect memory and prevent mobile resource starvation, ZKite enforces strict concurrency bounds:

| Resource Type | Maximum Limit | Behavior on Limit |
| :--- | :--- | :--- |
| **Event Coroutines** | **64** concurrent coroutines | Additional events are dropped or queued |
| **Pending Android Requests** | **32** concurrent requests | Raises `ResourceBusy` |
| **Sensor Subscriptions** | **16** active subscriptions | Additional sensor watches raise `ResourceBusy` |
| **Audio Handles** | **8** active media players | Additional audio plays raise `ResourceBusy` |
| **Concurrent File Uploads** | **4** streaming uploads | Additional uploads queue until a slot is freed |

Only one full-screen interactive system dialog (file picker, camera intent, biometric prompt) can be presented at a time. Attempting to launch a second modal dialog concurrently immediately raises `ResourceBusy`.

---

## Hot Reload & Lifecycle Safety

Mobile environments require strict resource cleanup when code reloads or when users navigate away:

* **Instant Hot Reload Invalidation**: When you edit Python code and trigger a hot reload, ZKite automatically cancels in-flight async device tasks and closes hardware handles (such as audio players and sensor subscriptions).
* **Stale Result Discarding**: Coroutines cancelled by a hot reload are strictly prevented from mutating stores through `state.update()`, avoiding race conditions or corrupted application state.
* **Activity & Process Lifecycle**: When the Android OS stops or replaces the application Activity, active async operations are cooperatively cancelled. Background suspension pauses sensors and audio playback automatically.
