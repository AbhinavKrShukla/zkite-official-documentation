---
title: Overlay Widget
description: Present modals, bottom sheets, alert dialogs, and scrimmed popups above the screen.
---

`Overlay` renders content above the active screen with a semi-transparent scrim backdrop. It handles outside-tap dismissal and Android Back button intercepts.

## Code Example

```python
from zkite import Overlay, Column, Row, Text, Button

def ConfirmationDialog(is_visible: bool, on_confirm, on_cancel):
    if not is_visible:
        return None

    return Overlay(
        Column(
            "w-80 p-6 bg-slate-900 border border-slate-700 rounded-2xl gap-4",
            Text("text-lg font-bold text-white", "Delete Item?"),
            Text("text-sm text-slate-300", "This action cannot be undone."),
            Row(
                "justify-end gap-3",
                Button("px-4 py-2 bg-slate-800 rounded-lg", Text("text-slate-300", "Cancel"), on_tap=on_cancel),
                Button("px-4 py-2 bg-rose-600 rounded-lg", Text("text-white font-bold", "Delete"), on_tap=on_confirm),
            ),
        ),
        placement="center",
        scrim="bg-black/60",
        on_dismiss=on_cancel,
    )
```

## Constructor & Properties

```python
Overlay(
    child: Widget,
    placement: str = "center",
    scrim: str = "bg-black/50",
    on_dismiss = None,
    key: str | None = None
)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `child` | `Widget` | *None* | The modal panel widget rendered within the overlay. |
| `placement` | `str` | `"center"` | Alignment of the modal panel: `"center"`, `"bottom"` (for bottom sheets), `"top"`, etc. |
| `scrim` | `str` | `"bg-black/50"` | Utility classes styling the backdrop overlay behind the dialog. |
| `on_dismiss` | `Callable[[], None]` | `None` | Callback invoked when the user taps the outside backdrop or presses Android's Back button. |
| `key` | `str` | `None` | Stable widget key. |

:::tip[State-Driven Visibility]
Render an `Overlay` conditionally using standard Python `if` statements in your component tree. Connecting `on_dismiss` to `store.update(show_modal=False)` ensures Android Back cleanly dismisses the modal without leaving the current screen.
:::
