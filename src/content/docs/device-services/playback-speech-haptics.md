---
title: Audio & Video Playback, Speech & Haptics
description: Native audio and video playback, customizable player controls, fullscreen mode, Android text-to-speech, semantic feedback, and custom vibration patterns.
---

ZKite 1.2.1 provides high-performance native audio and hardware-accelerated video playback, customizable on-screen player controls, Android Text-to-Speech (TTS), and granular haptic feedback through `zkite.audio`, `zkite.video`, `zkite.media`, and `zkite.haptics`.

---

## 1. Audio Playback (`zkite.audio`)

Play local audio assets, application documents, downloaded `FileRef` objects, or remote HTTP(S) streams:

```python
from zkite import audio

# Start playback (returns a player handle)
player = await audio.play("assets/song.mp3", volume=0.8, loop=False)

# Control playback
await player.pause()
await player.seek(15.0)          # Seek to 15 seconds
await player.resume()

# Configure dynamic properties (volume: 0.0–1.0, speed: 0.25–4.0, loop: bool)
await player.configure(volume=0.5, speed=1.25, loop=True)

# Query current player snapshot
snapshot = await player.state()
print(f"State: {snapshot.state} | Position: {snapshot.position}s / {snapshot.duration}s")

# Stop and release native resources
await player.stop()
```

### Unbounded Playback & Interruption Handling

* **Continuous Playback**: Playback continues until the track ends, you stop it, or Android interrupts it. There is no artificial timer or cutoff (the sample 2-second timer from earlier demos has been removed).
* **Audio Focus & Routes**:
  * If another app requests audio focus (e.g. an incoming phone call or GPS direction prompt), playback pauses automatically.
  * Transient focus loss pauses and resumes automatically once focus returns while foregrounded; audio ducking lowers volume without pausing.
  * Disconnecting an audio route (such as unplugging headphones or disconnecting Bluetooth earphones) pauses playback.
  * Resuming after permanent focus loss or route disconnection requires an explicit `.resume()` call.
* **Interruption Reasons**: The `snapshot.reason` property reports `user`, `background`, `route_disconnected`, `focus_transient`, `focus_lost`, or `surface_lost`.
* **Resource Limits**: Up to **8 concurrent active media and recording handles** can exist simultaneously. Always call `await player.stop()` when finished. A player cannot be reused after `stop()` or after a hot reload.

---

## 2. Video Playback (`zkite.video`)

ZKite 1.2.1 adds native Android video playback with hardware-accelerated rendering, configurable bounding boxes, and rich control overlays:

```python
from zkite import video

# Play a bounded video with customized native controls
player = await video.play(
    "assets/clip.mp4",
    bounds=(0, 80, 360, 203),    # Content-relative (x, y, width, height) in Android dp
    fit="contain",               # "contain" (letterbox), "cover" (crop), or "fill" (stretch)
    control_style={
        "accent": "#22C55E",
        "foreground": "#FFFFFF",
        "background": "#CC111827",
        "text_size": 16,
        "padding": 12,
        "placement": "bottom",
        "auto_hide_ms": 3000,
        "skip_seconds": 10,
        "show_time": True,
        "show_seek": True,
        "show_skip": True,
        "show_mute": True,
        "show_speed": True,
        "show_close": True,
        "show_fullscreen": True,
    }
)
```

### Supported Media Sources

Sources can be local filesystem paths, `FileRef` objects from file pickers, `file://` URIs, Android `content://` URIs, or HTTP/HTTPS URLs. The permission scanner automatically infers the `INTERNET` permission for HTTP(S) and dynamic media sources.

---

## 3. Fullscreen Video & Control Overlays

### Native Fullscreen Mode

* **Launch in Fullscreen**: Pass `bounds=None` to `video.play()` to start directly in immersive fullscreen.
* **Fullscreen Button**: The native video overlay includes a dedicated **Fullscreen** button. Tapping it enters immersive Android fullscreen mode, hiding system bars.
* **Exiting Fullscreen**: Tap **Exit fullscreen** on the overlay or press the Android system **Back** button/gesture to restore previous bounds and system bars.
* **Programmatic Fullscreen**: Call `await player.fullscreen(True)` or `await player.fullscreen(False)` from Python.
* To omit the button, set `"show_fullscreen": False` in `control_style`.

### Customizing the Native Overlay (`control_style`)

The native video controls overlay intentionally contains **no video title** for a clean, unobtrusive viewer. Tapping the video surface toggles overlay visibility:

| Setting | Type / Range | Description |
| :--- | :--- | :--- |
| `accent` | `#RRGGBB` / `#AARRGGBB` | Color of slider scrubber and active control accents. |
| `foreground` | `#RRGGBB` / `#AARRGGBB` | Icon and text color (defaults to white). |
| `background` | `#RRGGBB` / `#AARRGGBB` | Backdrop color of the controls bar (supports transparency). |
| `text_size` | `8` to `72` sp | Text label font size in scalable pixels. |
| `padding` | `0` to `100` dp | Internal bar padding. |
| `placement` | `"top"` or `"bottom"` | Position of the controls bar across the video rectangle. |
| `auto_hide_ms` | `0` to `60000` ms | Inactivity duration before controls auto-hide. Set `0` to keep visible. |
| `skip_seconds` | `1` to `3600` s | Jump duration for skip-forward and skip-backward buttons. |
| `show_*` | `bool` | Toggle individual elements: `show_time`, `show_seek`, `show_skip`, `show_mute`, `show_speed`, `show_close`, `show_fullscreen`. |
| `controls` | `bool` | Set `controls=False` in `video.play()` to completely disable native controls. |

---

## 4. Video Surface Layering & Python UI Controls

:::important[Video Layering Rule]
The Android native video surface is rendered **above** the Python declarative view tree. Standard Python widgets cannot paint directly on top of that video rectangle.

* **On-Video Controls**: Use `control_style` to customize native controls rendered on the video surface.
* **Custom Python Controls**: Render bounded video with `controls=False` and place your Python widgets (Buttons, Sliders, Text) outside the video rectangle, or layer them using `Overlay`.
* **Geometry**: Video bounds are absolute content coordinates in Android dp and do not automatically follow layout reflows or scrolling. Call `await player.bounds(x, y, width, height)` after changing layout.
:::

### Pure Python UI with `zkite.media.Controls`

For full UI customization, ZKite provides the `media.Controls` helper widget. Because it is an ordinary `Column`, it works anywhere—including floating `Overlay` sheets:

```python title="player_view.py"
from zkite import Button, Column, Overlay, Text, store
from zkite import audio, media

@store
class PlayerState:
    player: object = None
    snapshot: object = None

async def start(s: PlayerState):
    if s.player is not None:
        await s.player.stop()
    player = await audio.play("assets/song.mp3")
    s.update(player=player, snapshot=await player.state())
    
    # Watch player progress snapshots (polls every 250ms)
    player.watch(lambda snap: s.update(snapshot=snap), interval=0.25)

def view(s: PlayerState):
    return Column(
        "flex-1 justify-center items-center p-6 bg-slate-950",
        Button(
            "p-4 bg-emerald-600 rounded-xl",
            Text("text-white font-bold", "Play Audio"),
            on_tap=lambda: start(s),
        ),
        # Render custom player controls inside an Overlay sheet
        Overlay(
            "w-full rounded-2xl bg-slate-900 p-5 shadow-2xl",
            media.Controls(
                "gap-4",
                player=s.player,
                state=s.snapshot,
                parts=("status", "time", "seek", "buttons", "volume", "speed", "loop"),
                button_class="rounded-full bg-emerald-600 p-3 text-white",
                text_class="text-white",
                slider_class="w-full",
                row_class="gap-3",
                labels={"play": "▶", "pause": "⏸", "close": "Done"},
                leading=Text("text-xl text-white font-bold", "Now Playing"),
                trailing=Text("text-slate-400 text-sm", "ZKite Pure Python Media"),
                on_close=lambda: s.update(player=None, snapshot=None),
            ),
            placement="items-end justify-center p-4",
        ) if s.player and s.snapshot else None,
    )
```

* For video players, add `"fullscreen"` to `parts` to provide a Python fullscreen toggle button.
* `player.watch(callback, interval=0.25)` polls player progress and returns a cancellable future. It automatically ends on completion, error, or hot reload.

---

## 5. Player Operations Reference

| Operation | Purpose |
| :--- | :--- |
| `await player.pause()` | Pauses playback. |
| `await player.resume()` | Resumes playback. |
| `await player.seek(seconds)` | Seeks to a specific timestamp in seconds (finite and non-negative). |
| `await player.configure(volume=..., speed=..., loop=...)` | Dynamically updates volume (`0.0`–`1.0`), speed (`0.25`–`4.0`), or loop (`bool`). |
| `await player.state()` | Returns snapshot: `state`, `reason`, `position`, `duration`, `volume`, `muted`, `loop`, `speed`, `fullscreen`. |
| `player.watch(callback, interval=0.25)` | Periodically invokes sync or async callback with updated snapshots. Returns a cancellable future. |
| `await player.fullscreen(enabled)` | *(Video only)* Programmatically enter or exit fullscreen mode. |
| `await player.bounds(x, y, w, h)` | *(Video only)* Moves and resizes the native video surface in content-relative Android dp. |
| `await player.stop()` | Releases native player and surface resources. Safe to repeat. |

---

## 6. Text-to-Speech (TTS)

Speak text using Android's installed system speech synthesis engine:

```python
from zkite import audio

# Speak text using default system language
await audio.speak("File uploaded successfully!")

# Specify an explicit language tag (e.g. en-US, es-ES, hi-IN, fr-FR)
await audio.speak("Bonjour, bienvenue dans ZKite", language="fr-FR")
```

* **Synthesis Engine**: Uses the user's configured default TTS engine (such as Google Speech Services or Samsung TTS).
* **Language Support**: Requires that the requested language voice pack is installed on the user's device. If missing, ZKite falls back gracefully to the device default locale.

---

## 7. Haptics & Vibration

### Semantic Haptic Feedback (`haptics.perform`)

Semantic haptics produce Android-standard micro-vibrations tailored for UI controls:

```python
from zkite import haptics

haptics.perform("click")       # Standard button or tab tap
haptics.perform("confirm")     # Successful action or completion
haptics.perform("reject")      # Error, validation failure, or cancelled drag
haptics.perform("long_press")  # Contextual menu or card hold
haptics.perform("keyboard")    # Soft virtual keyboard keypress
```

* **Zero Permissions Needed**: Uses Android's View haptic subsystem and does **not** require the `VIBRATE` permission.
* **Honors User Preferences**: If the user has disabled haptic feedback in Android System Settings, `perform()` quietly respects their choice.

### Timed Vibration Patterns (`haptics.vibrate`)

For alerts, alarms, or game feedback:

```python
from zkite import haptics

# Single vibration pulse in milliseconds
await haptics.vibrate(duration_ms=120)

# Custom pattern: [delay_ms, vibrate_ms, delay_ms, vibrate_ms, ...]
await haptics.vibrate(pattern=[0, 80, 50, 80])

# Stop vibration immediately
await haptics.stop()
```

* **Permission**: Triggering custom vibration patterns automatically causes the scanner to infer the `VIBRATE` manifest permission.
* **Safety Limits**: Patterns are bounded to a maximum duration of **10 seconds** to avoid runaway battery drain; infinite repeating vibration loops are prohibited.
