---
title: Image Widget
description: Display local packaged PNG/JPEG assets, nested assets folder images, and async HTTPS remote URLs.
---

`Image` renders raster graphics on screen with native hardware decoding. It supports packaged project assets, images in `assets/`, data URIs, and **asynchronous remote HTTPS URLs** (new in 1.1.0).

---

## Code Example

```python
from zkite import Column, Image, Text

def MediaCards():
    return Column(
        "items-center p-4 bg-slate-900 rounded-2xl gap-3",
        # 1. Local packaged asset from recursive assets/ folder
        Image(
            "w-24 h-24 rounded-full border-2 border-emerald-500",
            src="assets/images/avatar.png",
            alt="User Profile Photo",
            fit="cover"
        ),
        # 2. Asynchronous remote HTTPS URL (new in 1.1.0)
        Image(
            "w-full h-48 rounded-xl",
            src="https://images.example.com/banners/hero.jpg",
            alt="Hero Banner",
            fit="cover"
        ),
        Text("text-lg font-bold text-white", "Alex Morgan"),
    )
```

---

## Constructor & Properties

```python
Image(
    classes: str,
    src: str,
    alt: str = "",
    fit: str = "cover",
    key: str | None = None
)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `classes` | `str` | *None* | Utility classes defining explicit width, height (`w-24 h-24`), border radius, and clips. |
| `src` | `str` | *None* | Asset path (`assets/photo.png`, `icon.png`), data URI, or HTTPS URL (`https://...`). |
| `alt` | `str` | `""` | Accessibility text description for screen readers. |
| `fit` | `str` | `"cover"` | Scaling mode: `"cover"`, `"contain"`, `"fill"`, `"none"`, or `"scale-down"`. |
| `key` | `str` | `None` | Stable widget key across tree re-renders. |

---

## Remote HTTPS Image Loading (New in 1.1.0)

ZKite 1.1.0 includes a native asynchronous HTTPS image loader:

* **Formats**: PNG and JPEG-family formats over HTTPS with verified TLS certificates.
* **Network & Workers**: Uses 4 background worker threads and a 15-second network timeout.
* **Limits**: 2 MiB maximum size per image.
* **Caching & Retries**: Images are cached in a bounded memory cache. If a download fails, an empty placeholder is shown with a diagnostic in device logs; a subsequent render can retry after 30 seconds.
* **Security**: HTTPS redirects cannot downgrade to unencrypted HTTP.
* **Permission**: Requires `"permissions": ["INTERNET"]` under `android` in `app.json`.

:::caution[Image Loader Limitations]
* **HTTP Cleartext**: Unencrypted plain `http://` URLs are blocked.
* **Unsupported Formats**: WebP, GIF, AVIF, and full browser `object-position` properties are not supported by the native image loader.
* **Memory Caution**: Images consume decoded memory proportional to pixel dimensions. Downscale large images before hosting.
:::

---

## Packaged Local Assets (`assets/`)

* **Recursive Staging**: The entire `assets/` directory is packaged recursively. Use project-relative paths like `"assets/images/logo.png"`.
* **Top-Level Files**: PNG/JPG/JPEG files directly beside `main.py` are also staged (retained from 1.0.0 for backwards compatibility).
* **Always Provide Layout Sizing**: Always assign an explicit width and height (`w-24 h-24`, `w-full h-48`) in the class string. Without layout constraints, the widget may collapse to zero height.

---

## App Launcher Icon

The launcher icon is configured separately in `app.json`:

```json
{
  "android": {
    "icon": "assets/icon.png"
  }
}
```

* Use a real square PNG (recommended 192x192 pixels or larger).
* **Full-Bleed Adaptive Icons (New in 1.1.2)**: Builds and previews wrap the PNG as a full-bleed adaptive icon. Supply opaque artwork without baked-in padding. Android applies its launcher mask (circle, squircle, or rounded rect); outer edges may be cropped, and transparent source margins remain transparent.
* After changing the icon, rerun `zkite run` or restart `zkite dev` so the APK resource is re-packaged. Source hot reload alone does not replace launcher resources in an already installed APK.
