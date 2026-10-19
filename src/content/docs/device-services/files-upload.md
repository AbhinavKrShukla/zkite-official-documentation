---
title: Files, Storage & Uploads
description: Document and photo picking, app-private storage, atomic exports, and streaming multipart HTTPS uploads.
---

ZKite 1.2.0 introduces comprehensive file operations via the `zkite.files` and `zkite.network` modules. You can select documents, pick photos with Android's privacy-first Photo Picker, manage app-private storage, export files, and stream uploads over HTTPS with progress tracking.

---

## Selecting Files & Photos

Use `files.pick`, `files.pick_many`, or `files.pick_photo` to prompt Android's system pickers:

```python
from zkite import files

# Pick a single file (returns FileRef or None if cancelled)
pdf_doc = await files.pick(types=["application/pdf"])

# Pick multiple files with a maximum selection limit
selected_images = await files.pick_many(types=["image/*"], limit=5)

# Use Android Photo Picker (API 33+, with document picker fallback on older devices)
profile_photo = await files.pick_photo()
```

### Privacy-Preserving Access

ZKite uses Android's official Storage Access Framework (SAF) and modern Photo Picker:
* **Zero Broad Storage Permissions**: Your app does **not** need `READ_EXTERNAL_STORAGE` or `MANAGE_EXTERNAL_STORAGE`.
* **Scoped Grants**: Android grants temporary read access exclusively to the specific files selected by the user.
* **Safe Provider Sharing**: App-private sharing uses a non-exported ContentProvider with per-URI permissions.

---

## The `FileRef` Object

File pickers and camera/audio capture tools return a `FileRef` instance representing the selected content:

### Properties

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `name` | `str` | Display filename (e.g., `"document.pdf"`, `"photo_2026.jpg"`) |
| `mime_type` | `str` | Detected MIME type (e.g., `"application/pdf"`, `"image/jpeg"`) |
| `size` | `int \| None` | File size in bytes, if reported by the underlying provider |
| `uri` | `str` | Android ContentProvider URI (e.g., `content://com.android.providers...`) |
| `path` | `pathlib.Path \| None` | Direct POSIX filesystem path (available only for local app captures) |

:::note[ContentProvider URIs vs Filesystem Paths]
A provider URI is an Android virtual identifier, not a standard Linux filesystem path. It may reference remote cloud files (such as Google Drive or Nextcloud). Never pass `uri` to standard Python `open()`. Use `copy_to()` or `local_copy()` to materialize the file locally.
:::

---

## Reading & Materializing Files

To inspect or process the contents of a `FileRef`, copy it to your application's internal storage or use a temporary local copy:

### 1. Copying to App Storage (`copy_to`)

Streams content directly into a local target path with a 256 MiB default safeguard limit. The destination file is replaced atomically only upon a successful and complete stream:

```python
from pathlib import Path
from zkite import files

file = await files.pick(types=["application/pdf"])
if file:
    target_path = files.data_dir() / "downloads" / file.name
    target_path.parent.mkdir(parents=True, exist_ok=True)
    await file.copy_to(target_path)
```

### 2. Ephemeral Temporary Copy (`local_copy`)

For operations that require a genuine `pathlib.Path` (such as calling a Python library that only accepts file paths), use `local_copy()`. It provides an async context manager that deletes the temporary working directory immediately upon exit:

```python
file = await files.pick(types=["image/png"])
if file:
    with await file.local_copy() as local:
        print(f"Temporary POSIX path: {local.path}")
        # Process local.path in a worker thread...
    # local.path is automatically deleted here
```

### 3. Persistent URI Permissions

If your app needs to reopen a user-selected document across app restarts without re-prompting the user:

```python
await file.persist()  # Requests persistent Android URI read access
# Later when no longer needed:
await file.release()
```

---

## Application Storage: `data_dir` vs. `cache_dir`

ZKite provides two helper methods returning standard `pathlib.Path` directories:

* **`files.data_dir()`**: Points to the application's durable private storage (`/data/user/0/<app_id>/files`). Files stored here persist across restarts and are included in standard Android app backups.
* **`files.cache_dir()`**: Points to the application's disposable cache directory (`/data/user/0/<app_id>/cache`). Camera captures and audio recordings initially reside here. Android may reclaim this storage if device disk space runs critically low. Copy essential user data to `data_dir()`.

---

## Exporting & Saving Files

To let the user save or export a file to an external location (Downloads folder, SD card, or cloud storage):

```python
from zkite import files

await files.save(
    file_ref_or_path,
    suggested_name="Monthly_Report.pdf",
    mime_type="application/pdf"
)
```

This launches Android's system document creation dialog, letting the user choose their preferred destination folder and filename.

---

## Streaming Multipart Uploads (`network.upload`)

ZKite includes a high-performance streaming HTTP/HTTPS upload client built directly into the engine:

```python
from zkite import files, network

async def upload_document(file: files.FileRef):
    def on_progress(sent_bytes: int, total_bytes: int):
        percent = (sent_bytes / total_bytes) * 100
        print(f"Uploaded: {percent:.1f}% ({sent_bytes}/{total_bytes})")

    try:
        response = await network.upload(
            url="https://api.example.com/v1/documents",
            file=file,
            fields={"user_id": "1042", "category": "tax"},
            headers={"Authorization": "Bearer YOUR_SECRET_TOKEN"},
            on_progress=on_progress,
            timeout=60,
        )
        print(f"Upload complete. Status code: {response.status}")
    except network.HTTPError as exc:
        print(f"Upload failed with HTTP {exc.response.status}")
```

### Upload Features & Limits

* **Bounded Memory Streaming**: Streams files directly using fixed-size buffers without loading entire multi-megabyte files into Python memory.
* **TLS Security**: Verifies server certificates by default. Plain HTTP requests are rejected unless `allow_http=True` is explicitly specified for local development.
* **Concurrency**: Up to **4 concurrent uploads** can run simultaneously.
* **No Unsolicited Redirects**: Redirects are not followed automatically, protecting against credential leakage.
* **Cooperative Cancellation**: Cancelling an upload terminates the socket stream immediately.
