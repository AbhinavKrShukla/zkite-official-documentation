---
title: Motion & Environmental Sensors
description: Real-time accelerometer, gyroscope, rotation vector, light, proximity, magnetometer, and shake detection.
---

ZKite 1.2.0 connects your Python code directly to Android's hardware sensors through the `zkite.sensors` module. You can build tilt-controlled interactions, compasses, ambient light adjustments, and shake gestures.

---

## Inspecting Available Sensors

Physical devices differ significantly in sensor hardware. Check which sensors are supported by the current device:

```python
from zkite import sensors

available_sensors = await sensors.available()
print(f"Supported on this device: {available_sensors}")
# Example output: ['accelerometer', 'linear_acceleration', 'gyroscope', 'rotation', 'magnetometer', 'light', 'proximity', 'shake']
```

Attempting to watch an absent sensor raises `UnsupportedFeature`.

---

## Subscribing to Sensor Streams

Subscribe to a sensor stream using `.watch()`, specifying an update rate in Hertz (1–100 Hz):

```python
from zkite import Column, Text, store
from zkite import sensors

@store
class SensorStore:
    accel_x: float = 0.0
    accel_y: float = 0.0
    accel_z: float = 0.0

def view(state: SensorStore):
    return Column("flex-1 p-6 justify-center items-center bg-slate-900",
        Text("text-white text-xl font-bold", "Accelerometer Readings"),
        Text("text-emerald-400 font-mono", f"X: {state.accel_x:+.2f} m/s²"),
        Text("text-emerald-400 font-mono", f"Y: {state.accel_y:+.2f} m/s²"),
        Text("text-emerald-400 font-mono", f"Z: {state.accel_z:+.2f} m/s²"),
    )

# Start watching when screen mounts:
async def start_sensors(state: SensorStore):
    def on_sample(sample):
        state.update(accel_x=sample.x, accel_y=sample.y, accel_z=sample.z)

    subscription = await sensors.accelerometer.watch(on_sample, rate_hz=30)
    return subscription
```

---

## Sensor Catalog & Units

| Sensor Name | Coordinate / Units | Sample Attributes | Description |
| :--- | :--- | :--- | :--- |
| **`accelerometer`** | $\text{m/s}^2$ | `sample.x`, `sample.y`, `sample.z` | Total acceleration including gravity |
| **`linear_acceleration`** | $\text{m/s}^2$ | `sample.x`, `sample.y`, `sample.z` | Acceleration with gravity filtered out |
| **`gyroscope`** | $\text{rad/s}$ | `sample.x`, `sample.y`, `sample.z` | Angular rotation rate around device axes |
| **`rotation`** | Unitless quaternion | `sample.values` | Android's 3D device rotation vector |
| **`magnetometer`** | $\mu\text{T}$ (micro-Tesla) | `sample.x`, `sample.y`, `sample.z` | Ambient geomagnetic field strength |
| **`light`** | $\text{lux}$ | `sample.value` | Ambient illuminance level |
| **`proximity`** | $\text{cm}$ | `sample.value` | Distance to nearest object (e.g. ear/screen) |
| **`shake`** | Event notification | `sample.timestamp_ns` | High-level shake gesture with cooldown |

### The `Sample` Object

Each sensor sample provides:
* **Coordinates / Values**: `sample.x`, `sample.y`, `sample.z`, or `sample.value` depending on dimensionality.
* **`timestamp_ns`**: Monotonic Android system timestamp in nanoseconds.
* **`accuracy`**: Sensor accuracy rating (0 to 3).
* **`dropped`**: The count of samples dropped if the Python consumer ran behind the hardware rate.

---

## Performance & Concurrency Model

* **Non-Blocking Execution**: Sensor sampling runs on dedicated native background threads off Android's UI rendering thread.
* **Backpressure Protection**: If a Python callback takes longer than the sampling period, ZKite coalesces or drops intermediate samples rather than accumulating an unbounded memory queue.
* **Sampling Rate Hints**: The `rate_hz` argument (1 to 100 Hz) acts as a hardware hint to Android's `SensorManager`.
* **Subscription Limit**: Up to **16 concurrent sensor subscriptions** can be active across the entire application.
* **Async Callbacks**: Both standard functions (`def`) and coroutine functions (`async def`) are supported as sample callbacks. If an unhandled exception occurs inside a callback, it is captured in `subscription.error` and halts that subscription cleanly.

---

## Lifecycle Management & Battery Safety

Sensors are among the most power-hungry components on mobile devices. ZKite enforces battery-conscious defaults:

* **Automatic Background Pause**: When the user switches to another app or locks their phone, all active sensor subscriptions pause automatically. They resume when the user returns.
* **Automatic Reload Cleanup**: Performing a hot reload automatically closes all existing sensor subscriptions.
* **Manual Cleanup**: When navigating away from a screen or when sensor data is no longer needed, always close the subscription:
  ```python
  subscription.close()
  ```
