---
title: Lifecycle & Application Data
description: Understand Android process lifecycles, surface stabilization, in-memory state versus local persistent storage.
---

When developing mobile apps, you must distinguish between **in-memory application state** and **durable local storage**.

---

## In-Memory State vs. Durable Storage

* **`Store` State is In-Memory**: Data inside an in-memory `@store` exists only as long as your Python process runs in Android RAM. If Android reclaims process memory in the background or the user swipes away the task, in-memory state resets on the next launch.
* **Durable Storage**: For records that must survive app termination and updates (e.g. user authentication tokens, downloaded records, preferences), write them to local files or a local database.

:::important[Keep User Data Outside Managed Application Directories]
Keep user data outside the managed application source directory, whose contents can be overwritten during app updates. Always test save/load behavior after a normal restart and after installing an update signed with the same key.
:::

---

## 1. App Storage Directories: `data_dir` vs. `cache_dir` (New in 1.2.0)

ZKite 1.2.0 introduces dedicated path helpers in `zkite.files` pointing to isolated, sandbox-safe storage:

```python
from zkite import files

# Durable, permanent internal application storage
app_data = files.data_dir()
db_path = app_data / "app_records.db"

# Disposable temporary cache directory (cleaned by Android if disk is low)
cache = files.cache_dir()
temp_download = cache / "temp.dat"
```

* **`files.data_dir()`**: Resides in internal private storage (`/data/user/0/<app_id>/files`). Files survive app updates and restarts and participate in Android backups.
* **`files.cache_dir()`**: Suitable for disposable temp files, camera frames, and download buffers. Important captures should be moved into `data_dir()`.

---

## 2. Hardware-Backed Encrypted Secrets (`zkite.secrets`)

For sensitive authentication tokens, API keys, or credentials, ZKite provides the `secrets` module, backed by an app-owned key in the **Android Keystore**:

```python
from zkite import secrets

# Save an encrypted token (up to 16 KiB)
await secrets.set("session_token", "secure_jwt_token_here")

# Retrieve the secret
token = await secrets.get("session_token")
```

Secrets are encrypted using AES-256-GCM and stored in Android's `no_backup` directory, ensuring they are excluded from cloud backups.

---

## 3. Local Relational Data: SQLite

Python's built-in `sqlite3` module works natively on Android without any external drivers:

```python
import sqlite3
from zkite import files

def init_db():
    db_path = files.data_dir() / "app_data.db"
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            content TEXT
        )
    """)
    conn.commit()
    conn.close()
```

---

## Android Lifecycle & Surface Stabilization

When the user navigates away from your app:
1. Android pauses and backgrounds the activity.
2. In-memory state remains in RAM unless low memory forces process termination.
3. Upon returning, Android resumes the activity.

:::tip[Lifecycle Stabilization Fixes in 1.2.0]
ZKite includes core stabilization logic preserved and enhanced in 1.2.0:
* **Preserves Queued Render Commands**: Prevents lost frames when backgrounding and resuming under heavy load.
* **Rejects Expired Surfaces**: Accurately discards detached Android native surfaces during resume before rendering new frames.
* **Hardware Resource Safety (New in 1.2.0)**: Backgrounding automatically pauses sensor streams, pauses media audio players, turns off the camera flashlight torch, and halts microphone recordings.
* **Async Task Invalidation**: Reloads and activity replacements cooperatively cancel outdated coroutines and reject late callbacks from modifying store state.
* **Text-Selection Guards**: Text-selection callbacks guard against uninitialized overlay owners, preventing crashes when selecting text during transitions.
* **Paced Startup & Splash Dismissal**: Startup asset extraction runs off the UI thread to prevent ANRs. The splash view is dismissed only after the first frame is presented to the screen, and skipped presentations are automatically retried.
* **Accessibility Refresh**: Android accessibility services are automatically refreshed if enabled after application startup.

These lifecycle fixes ensure solid runtime stability, but they do **not** make in-memory state persistent across process termination.
:::

### Best Practices for Lifecycle Safety
* **Avoid irreversible side-effects on import**: Do not create database records or launch background jobs solely because a module was imported or `view` was evaluated. Development reloads and process restarts can execute those lines repeatedly.
* **Explicitly close resources**: Close open sensor subscriptions (`subscription.close()`) and audio handles (`await player.stop()`) when exiting view screens.
* **Test realistic transitions**: Verify behavior during device rotation, opening/closing the keyboard, switching to another app, and returning after a delay.
