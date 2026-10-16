---
title: Button Widget
description: Tap-triggered interactive control with active states, disabled modes, and action callbacks.
---

`Button` provides touch-responsive interactive targets with Android native ripple feedback and tap handling.

## Code Example

```python
from zkite import Button, Text

def SubmitButton(is_submitting: bool, on_submit):
    return Button(
        "w-full py-3.5 px-6 bg-emerald-500 rounded-xl justify-center items-center",
        Text(
            "text-white font-bold text-base text-center",
            "Submitting..." if is_submitting else "Confirm Purchase"
        ),
        disabled=is_submitting,
        on_tap=on_submit,
    )
```

## Constructor & Properties

```python
Button(classes: str, *children, disabled: bool = False, on_tap = None, key: str | None = None)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `classes` | `str` | *None* | Utility classes for padding, background color, borders, and rounding. |
| `*children` | `Widget` | *None* | Visible content inside the button (typically a `Text` or `Row` with an icon). |
| `disabled` | `bool` | `False` | When `True`, the button ignores tap events and applies disabled visual opacity. |
| `on_tap` | `Callable` | `None` | Callback invoked when the user taps the button. Typically a zero-argument function or lambda. |
| `key` | `str` | `None` | Stable widget key. |
