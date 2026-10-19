---
title: System Integrations & Security
description: Android sharing, clipboard, device & battery info, foreground location, notifications, encrypted Keystore secrets, and biometric authentication.
---

ZKite 1.2.0 provides access to essential Android operating-system services and security hardware, enabling real-world production mobile features directly from pure Python.

---

## Android System Sharing (`zkite.share`)

Open Android's native system sharing sheet to share text, links, or files with other installed applications (such as email, messaging apps, or cloud storage):

```python
from zkite import share

# 1. Share plain text or links
await share.send(text="Check out ZKite at https://zkite.cloud")

# 2. Share a picked document or capture
await share.send(
    files=[document_file_ref],
    text="Here is your monthly invoice",
    mime_type="application/pdf"
)
```

:::note[Sharing Lifecycle]
`share.send()` resolves as soon as Android launches the system chooser dialog. The operating system does not report which external app the user picked or whether the recipient app processed the file.
:::

---

## Clipboard Access (`zkite.clipboard`)

Read and write text from the Android system clipboard asynchronously:

```python
from zkite import clipboard

# Copy text to clipboard
await clipboard.write("https://github.com/AbhinavKrShukla/zkite")

# Paste text from clipboard
copied_text = await clipboard.read()
```

---

## Device Information & Hardware State (`zkite.device`)

Query hardware metrics, manage display wake locks, and dispatch system URLs:

```python
from zkite import device

# Synchronous device hardware info (model, manufacturer, Android SDK level)
info = device.info()
print(f"Device: {info.manufacturer} {info.model} (API {info.sdk_int})")

# Battery level and charging state
battery = await device.battery()
print(f"Battery: {battery.level}% | Charging: {battery.is_charging}")

# Network connectivity status
network = await device.network()
print(f"Connected: {network.is_connected} | Type: {network.type}")  # "wifi", "cellular", "none"

# Prevent the screen from sleeping during long operations or reading
await device.keep_awake(True)
# Allow the screen to turn off normally:
await device.keep_awake(False)

# Open web URLs, telephone numbers, emails, or map locations
await device.open_url("https://zkite.cloud")
await device.open_url("mailto:support@example.com?subject=Help")
await device.open_url("tel:+1234567890")
await device.open_url("geo:37.7749,-122.4194")
```

---

## Foreground Location (`zkite.location`)

Retrieve a single, high-accuracy or coarse geographic fix using Android's native platform location providers:

```python
from zkite import location
from zkite.errors import PermissionDenied, DeviceError

try:
    # Request a foreground GPS/Network location fix with a 30-second timeout
    pos = await location.current(high_accuracy=True, timeout=30)
    print(f"Latitude: {pos.latitude}, Longitude: {pos.longitude} (±{pos.accuracy}m)")
except PermissionDenied:
    print("Location permission was denied by the user")
except DeviceError as exc:
    print(f"Unable to retrieve location fix: {exc}")
```

* **Zero Google Play Services Dependency**: Uses Android's native `LocationManager` directly, ensuring compatibility with all AOSP and Play-free devices.
* **Accuracy Tiers**: `high_accuracy=False` requests `ACCESS_COARSE_LOCATION` (cellular/Wi-Fi positioning), while `high_accuracy=True` requests `ACCESS_FINE_LOCATION` (GPS).
* **Single Fix**: Retrieves an immediate position fix without running background battery-draining continuous location services.

---

## Local Notifications (`zkite.notifications`)

Present immediate notifications in the Android notification drawer:

```python
from zkite import notifications

# Post a local notification using a persistent integer ID
await notifications.show(
    title="Export Complete",
    body="Your PDF export is ready to share.",
    id=101
)

# Cancel or dismiss an existing notification
await notifications.cancel(id=101)
```

* **Notification Channels**: Notifications are automatically organized into Android notification channels for user control.
* **Android 13+ Runtime Consent**: Uses `POST_NOTIFICATIONS`. The permission is inferred automatically by the static build scanner.

---

## Encrypted Keystore Secrets (`zkite.secrets`)

Store sensitive credentials, authentication tokens, and API keys securely using the hardware-backed **Android Keystore System**:

```python
from zkite import secrets

# Store an encrypted secret
await secrets.set("auth_token", "jwt_ey7841...")

# Retrieve the decrypted secret
token = await secrets.get("auth_token")

# Delete a secret
await secrets.delete("auth_token")
```

### Security Architecture

* **Hardware Protection**: Encrypted using an app-owned AES-256-GCM cryptographic key generated inside the Android Keystore. On devices with a Secure Element or StrongBox, private key material never leaves hardware isolation.
* **Tamper-Evident Filenames**: Secret identifiers are hashed and stored in Android's `no_backup` directory. They are excluded from automatic cloud backups, preventing leaked tokens on restore.
* **Size Boundary**: Each individual secret value is bounded to **16 KiB**, tailored for tokens, keys, and session cookies.

---

## Biometric Authentication (`zkite.biometrics`)

Prompt the user for fingerprint or face authentication using Android's official `BiometricPrompt`:

```python
from zkite import biometrics

# Launches the system biometric authentication dialog
authenticated = await biometrics.authenticate(
    title="Authenticate to Continue",
    subtitle="Confirm your fingerprint or face"
)

if authenticated:
    print("User authenticated successfully!")
else:
    print("Authentication was cancelled by the user")
```

* **Requirements**: Requires Android 9 (API 28+) and enrolled biometric credentials on the device.
* **Authentication UI**: Presents Android's standard, cryptographically isolated system modal dialog.
