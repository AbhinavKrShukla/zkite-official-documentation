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

## 1. JSON Configuration & Preferences

```python
import json
import os

DATA_FILE = "user_preferences.json"

def save_preferences(data: dict):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f)

def load_preferences() -> dict:
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"dark_mode": True, "notifications": True}
```

---

## 2. Local Relational Data: SQLite

Python's built-in `sqlite3` module works natively on Android without any external drivers:

```python
import sqlite3

def init_db():
    conn = sqlite3.connect("app_data.db")
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

:::tip[Lifecycle Stabilization Fixes in 1.1.0]
ZKite includes core stabilization logic:
* **Preserves Queued Render Commands**: Prevents lost frames when backgrounding and resuming under heavy load.
* **Rejects Expired Surfaces**: Accurately discards detached Android native surfaces during resume before rendering new frames.
* **Text-Selection Guards**: Text-selection callbacks guard against uninitialized overlay owners, preventing crashes when selecting text during transitions.

These lifecycle fixes ensure solid runtime stability, but they do **not** make in-memory state persistent across process termination.
:::

### Best Practices for Lifecycle Safety
* **Avoid irreversible side-effects on import**: Do not create database records or launch background jobs solely because a module was imported or `view` was evaluated. Development reloads and process restarts can execute those lines repeatedly.
* **Test realistic transitions**: Verify behavior during device rotation, opening/closing the keyboard, switching to another app, and returning after a delay.
