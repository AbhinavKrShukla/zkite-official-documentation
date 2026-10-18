---
title: TextField Widget
description: Controlled single-line or password text input field with software keyboard integration.
---

`TextField` provides native Android text input with support for standard keyboard types, placeholder hints, secure password masking, and robust text selection.

---

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

---

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
| `placeholder` | `str` | `""` | Light hint text shown when `value` is empty. |
| `type` | `str` | `"text"` | Software keyboard hint: `"text"`, `"email"`, `"url"`, `"tel"`, or `"number"`. |
| `secure` | `bool` | `False` | When `True`, obscures text input with password masking. |
| `on_change` | `Callable[[str], None]` | `None` | Callback invoked with the updated text when editing commits. |
| `on_input` | `Callable[[str], None]` | `None` | Callback invoked immediately on every single keystroke. |
| `key` | `str` | `None` | Stable identity key. |

---

## Controlled State & Event Timing

* **`on_input` vs `on_change`**: On the native backend, text-change callbacks follow editing. Use `on_input` for immediate per-keystroke responsiveness (e.g. search filtering); use `on_change` for committed form values.
* **Controlled Value Pattern**: Always write the updated text back to your store. If your callback does not update the store field, a subsequent render can revert the displayed text.

---

## Keyboard Testing & Text Selection Stability

:::tip[Native Selection & Unicode Enhancements in 1.1.1]
ZKite 1.1.1 brings comprehensive refinements to native Android text editing:
* **Native Selection Toolbar**: Long-pressing text opens Android's native contextual action toolbar and selection handles on the very first gesture.
* **Selection Geometry**: Selection bounds use the field's actual padding, bundled typeface, baseline, and rounded borders.
* **Full Unicode & Emoji Handling**: UTF-16 cursor indices and Java modified UTF-8 are converted precisely at the JNI boundary, preventing misaligned cursors or corrupt state with emojis and accented characters.
* **Keyboard Pan Tracking**: Selection overlays dynamically track Android 11+ window insets without double-panning the window.
* **Duplicate Callback Suppression**: Suppresses redundant IME change events; Cut and typing in selection mode update Python immediately.
* **Focus Teardown**: Removing a focused field from the view tree cleanly tears down native Android focus.
:::

When testing text input, verify on physical Android hardware:
1. Deleting all text until empty.
2. Inserting characters in the middle of existing text.
3. Selecting a range of text, copying, and pasting using the native selection toolbar.
4. Inputting multi-byte Unicode characters and emojis.
5. Dismissing the soft keyboard and returning from other apps.
6. **Preserve Field Keys**: Always preserve the field's `key` so ordinary state updates do not recreate the field and dismiss the keyboard unexpectedly.
