---
title: Audio Playback, Speech & Haptics
description: Native audio playback, Android text-to-speech, semantic touch feedback, and custom vibration patterns.
---

ZKite 1.2.0 provides native audio output, Android Text-to-Speech (TTS), and granular haptic feedback through `zkite.audio` and `zkite.haptics`.

---

## Audio Playback

Play bundled local sound files, app assets, or downloaded `FileRef` objects:

```python
from zkite import audio

# Start playback (returns a MediaPlayer handle)
player = await audio.play("assets/chime.wav", volume=0.8)

# Control playback
await player.pause()
await player.seek(2.5)          # Seek to 2.5 seconds
await player.resume()

# Check player state (returns "playing", "paused", "stopped", etc.)
current_state = await player.state()

# Stop and release native resources
await player.stop()
```

### Audio Focus & Hardware Routing

* **Hardware Routing**: Automatically routes audio to whichever output device Android is actively using (built-in speaker, wired earphones, or connected Bluetooth A2DP audio devices).
* **Audio Focus Loss**: If another app requests audio focus (such as an incoming phone call or GPS direction prompt), playback pauses automatically.
* **Background Behavior**: Audio players pause when your application leaves the foreground. Resuming after returning to the app is explicit.
* **Concurrency Limit**: Up to **8 concurrent active players** can exist simultaneously. Always call `await player.stop()` when playback is no longer needed.

:::note[Scope of Audio Playback]
The `audio.play()` API is engineered for app sound effects, voice notes, and local media. Continuous background music streaming services and custom lock-screen notification media sessions are not part of this release.
:::

---

## Text-to-Speech (TTS)

Speak text using Android's installed system speech synthesis engine:

```python
from zkite import audio

# Speak text using default system language
await audio.speak("File uploaded successfully!")

# Specify an explicit language tag (e.g. en-US, es-ES, hi-IN, fr-FR)
await audio.speak("Bonjour, bienvenue dans ZKite", language="fr-FR")
```

* **Synthesis Engine**: Uses the user's configured default TTS engine (such as Google Speech Services or Samsung TTS).
* **Language Support**: Requires that the requested language voice pack is installed on the user's device. If the language data is missing, ZKite falls back gracefully to the device default locale.

---

## Haptics & Vibration

Haptics bridge the tactile gap between software and hardware. ZKite offers both semantic UI feedback and timed vibration patterns.

### 1. Semantic Haptic Feedback (`haptics.perform`)

Semantic haptics produce Android-standard micro-vibrations tailored for UI controls:

```python
from zkite import haptics

# Trigger semantic effects on user interactions
haptics.perform("click")       # Standard button or tab tap
haptics.perform("confirm")     # Successful action or completion
haptics.perform("reject")      # Error, validation failure, or cancelled drag
haptics.perform("long_press")  # Contextual menu or card hold
haptics.perform("keyboard")    # Soft virtual keyboard keypress
```

* **Zero Permissions Needed**: Semantic feedback uses Android's View haptic subsystem and does **not** require the `VIBRATE` permission.
* **Honors User Preferences**: If the user has disabled haptic feedback in their Android System Settings, `perform()` quietly respects their choice.

### 2. Timed Vibration Patterns (`haptics.vibrate`)

For alerts, alarms, or game feedback, use explicit vibrations:

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
