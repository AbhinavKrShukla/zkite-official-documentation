---
title: Lifecycle & Application Data
description: Understand Android process lifecycles, backgrounding, in-memory state versus local persistent storage.
---

When developing mobile apps, you must distinguish between **in-memory application state** and **durable local storage**.

## In-Memory vs. Durable Storage

* **`Store` State is In-Memory**: Data inside an in-memory `Store` exists as long as your Python process runs in Android RAM. If the user swipes your app away in the Android App Switcher or the OS reclaims memory in the background, this state resets on next launch.
* **Durable Storage**: For data that must survive app restarts (e.g. user authentication tokens, downloaded records, preferences), store it in local files or a local database.

## Saving Durable Data Locally

ZKite provides an isolated writable sandbox directory for your application on the Android filesystem. You can use standard Python libraries:

### 1. JSON Configuration / Preferences

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

### 2. SQLite Database

For relational or offline-first datasets, Python's built-in `sqlite3` module works seamlessly on Android:

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

## Android Background & Resume

When the user leaves your app (pressing Home or switching apps):
1. Android places the activity in the background.
2. When the user returns, Android resumes the activity and re-renders the current screen.
3. If the system terminated the background process due to low memory, the app restarts fresh from `main.py`'s initial entry point.
