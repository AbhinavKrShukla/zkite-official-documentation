---
title: Deep Links & URL Schemes
description: Configure custom URL schemes and verified HTTPS Android App Links, handle incoming intents, and route deep link parameters in pure Python.
---

ZKite 1.2.1 introduces native Android deep linking and App Links support. You can declare URL patterns in `app.json`, dispatch deep links to other apps, and route incoming link intents to reactive Python state stores.

---

## 1. Configuring `app.json`

Register deep link patterns under the `android.deep_links` key in `app.json`. Because deep links configure Android `intent-filter` entries in the binary manifest, rebuild and reinstall your application after modifying them (`zkite run` or `zkite build`):

```json title="app.json"
{
  "name": "my-app",
  "backend": "native",
  "android": {
    "package": "com.yourcompany.myapp",
    "deep_links": [
      {
        "scheme": "myapp",
        "host": "open",
        "path_prefix": "/item"
      },
      {
        "scheme": "https",
        "host": "app.yourdomain.com",
        "path_prefix": "/item",
        "auto_verify": true
      }
    ]
  }
}
```

### Custom Schemes vs. HTTPS App Links

* **Custom Schemes** (e.g. `myapp://open/...`):
  * **Quick Testing**: Works immediately during development without configuring external servers or domain records.
  * **No Ownership Guarantee**: Other apps can register the same custom scheme; Android may prompt the user with an app chooser dialog. If the app is not installed, clicking the link fails.
* **HTTPS Android App Links** (e.g. `https://app.yourdomain.com/...`):
  * **Verified Domain Ownership**: Requires hosting a Digital Asset Links file at `https://app.yourdomain.com/.well-known/assetlinks.json` associating your package name with your app's **SHA-256 signing-certificate fingerprint**.
  * **Direct Opening & Web Fallback**: Opens your app immediately without an app chooser. If your app is not installed, the link opens your website in the browser.
  * Note: Setting `"auto_verify": true` asks Android to verify domain ownership at install time; it does not bypass the need for `assetlinks.json`. For apps distributed via Google Play, use the SHA-256 fingerprint from Play App Signing.

---

## 2. Handling Incoming Links in Python

Use the `zkite.links` module to listen for links or query them manually.

### Listening for Incoming Links (`links.listen`)

Register a listener **once at module scope** (never inside a view render function). Annotated state stores are automatically injected into the callback:

```python title="main.py"
from zkite import Column, Text, store
from zkite import links

@store
class Screen:
    item: str = "No item selected"

def opened(link, s: Screen):
    # Treat URLs as untrusted input; allow only supported routes
    if link.scheme == "myapp" and link.host == "open" and link.path.startswith("/item/"):
        s.update(item=link.path.removeprefix("/item/"))

# Register listener once at module scope
listener = links.listen(opened)

def view(s: Screen):
    return Column(
        "flex-1 p-6 justify-center items-center gap-4 bg-slate-950",
        Text("text-2xl font-bold text-white", "Deep Link Demo"),
        Text("text-lg text-emerald-400 font-medium", f"Current item: {s.item}"),
    )
```

### Listener Behavior & Lifecycle

* **Sync & Async Callbacks**: `links.listen()` accepts either synchronous or `async def` callback functions. Incoming links are delivered sequentially in arrival order.
* **Cancellable Future**: `links.listen()` returns a future with a `.cancel()` method to stop listening.
* **Hot Reload Safety**: ZKite's development runner automatically cancels existing link listeners during hot reload.
* **Error Handling**: Any unhandled exception in the callback terminates that listener and is forwarded to your application's global async error handler.
* **SingleTask Launch Mode**: Deep-linked ZKite apps run in Android `singleTask` launch mode. The queue handles both cold application launches and runtime `onNewIntent` events when the app is already open.
* **Buffer Capacity**: The incoming link queue retains up to **32 links** (oldest dropped if the buffer overflows) and rejects URLs longer than **8,192 characters**.

---

## 3. The `Link` Object & Manual Consumption

The `Link` instance passed to your callback contains parsed URL components:

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `link.url` | `str` | Complete, raw URL string. |
| `link.scheme` | `str` | URL scheme (e.g. `"myapp"` or `"https"`). |
| `link.host` | `str` | Hostname or authority (e.g. `"open"` or `"app.yourdomain.com"`). |
| `link.path` | `str` | Percent-encoded path (e.g. `"/item/42"`). |
| `link.query` | `dict[str, list[str]]` | Dictionary of query parameters mapping keys to lists of values, preserving repeated or empty parameters. |

### Manual Polling (`links.next_link`)

If you prefer manual consumption instead of an active event listener, call `links.next_link()`:

```python
link = links.next_link()
if link is not None:
    print(f"Consumed pending link: {link.url}")
```

:::warning[Single Consumer Rule]
Use either `links.listen()` or `links.next_link()`, never both concurrently. Each incoming link is consumed once.
:::

---

## 4. Creating & Sharing Deep Links (`links.create`)

Generate properly percent-encoded deep links using `links.create()`, and share them via `zkite.share`:

```python
from zkite import links, share

# Generates: "myapp://open/item/42?ref=shared+message"
url = links.create("myapp", "open", "/item/42", ref="shared message")

# Share to another app via Android's native share sheet
await share.send(text=url)
```

* Pass unescaped path and query values; `links.create()` takes care of standard percent-encoding.
* Creating a link string does not open your app—the user clicking the link in another app or browser triggers Android to open it.

---

## 5. Testing Deep Links via ADB

Test your deep link configuration directly from your computer terminal using ADB. Run each command twice: once with your app closed (cold start) and once while your app is already in the foreground:

```bash
# 1. Test custom scheme
adb shell am start -W \
  -a android.intent.action.VIEW \
  -c android.intent.category.BROWSABLE \
  -d 'myapp://open/item/42?ref=test' \
  com.yourcompany.myapp

# 2. Test HTTPS App Link
adb shell am start -W \
  -a android.intent.action.VIEW \
  -c android.intent.category.BROWSABLE \
  -d 'https://app.yourdomain.com/item/42' \
  com.yourcompany.myapp
```

:::tip[Development Previews & Package IDs]
When using `zkite dev`, the development preview uses a distinct preview package ID. Check the CLI's installation logs for the active package name when dispatching `am start` intents during local hot-reload sessions.
:::
