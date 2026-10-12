---
title: TextField Widget
description: Controlled single-line or password text input field with software keyboard integration.
---

`TextField` provides native Android text input with support for standard keyboard types, placeholder hints, and secure password masking.

## Code Example

```python
from zkite import Column, TextField, Text

def LoginForm(store):
    return Column(
        "gap-3 w-full",
        Text("text-sm font-medium text-slate-300", "Email Address"),
        TextField(
            "p-3 bg-slate-900 border border-slate-700 rounded-lg text-white",
            value=store.email,
            placeholder="name@example.com",
            type="email",
            on_change=lambda text: store.update(email=text),
        ),
        Text("text-sm font-medium text-slate-300", "Password"),
        TextField(
            "p-3 bg-slate-900 border border-slate-700 rounded-lg text-white",
            value=store.password,
            placeholder="••••••••",
            secure=True,
            on_change=lambda text: store.update(password=text),
        ),
    )
```

## Constructor & Properties

```python
TextField(
    classes: str,
    value: str = "",
    placeholder: str = "",
    type: str = "text",
    secure: bool = False,
    on_change = None,
    on_input = None,
    key: str | None = None
)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `classes` | `str` | *None* | Styling classes for padding, background, borders, and text typography. |
| `value` | `str` | `""` | The current controlled string value displayed in the field. |
| `placeholder` | `str` | `""` | Light gray hint text shown when `value` is empty. |
| `type` | `str` | `"text"` | Software keyboard hint: `"text"`, `"email"`, `"url"`, `"tel"`, or `"number"`. |
| `secure` | `bool` | `False` | When `True`, obscures text input for password fields. |
| `on_change` | `Callable[[str], None]` | `None` | Callback invoked with the updated text when editing finishes or commits. |
| `on_input` | `Callable[[str], None]` | `None` | Callback invoked immediately on every single keystroke. |
| `key` | `str` | `None` | Stable identity key. |

:::caution[Preserving Field Identity]
Always maintain a stable `key` and avoid recreating field instances on every keystroke. Replacing a field's identity while the user is typing can cause the Android soft keyboard to lose cursor position or dismiss unexpectedly.
:::
