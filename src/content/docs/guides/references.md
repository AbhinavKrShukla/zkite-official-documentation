---
title: Official Platform References
description: Android developer documentation and Python packaging specifications behind ZKite's implementation.
---

ZKite owns the pure Python developer contracts documented across this site. The underlying platform behavior—permissions, storage providers, hardware sensors, and application packaging—is governed directly by Android and the Python Packaging Authority (PyPA).

---

## Android Platform Documentation

* **[Access Documents & Files from Shared Storage](https://developer.android.com/training/data-storage/shared/documents-files)**
  Covers the Storage Access Framework (SAF), persistent document URI grants, and user-selected file export destinations.
* **[Android Photo Picker](https://developer.android.com/training/data-storage/shared/photo-picker)**
  Explains the privacy-preserving photo and video selection interface available on Android 13+ (and backported via Google Play system updates).
* **[Take Photos & Videos with Camera Intents](https://developer.android.com/media/camera/camera-intents)**
  Details delegating full-resolution media capture to installed system camera apps without broad camera permissions.
* **[MediaRecorder Overview](https://developer.android.com/media/platform/mediarecorder)**
  Covers Android audio/video recording lifecycles, AAC encoders, and MPEG-4 container handling.
* **[MediaPlayer Overview](https://developer.android.com/media/platform/mediaplayer)**
  Explains Android audio playback states, audio focus loss, and hardware output routing.
* **[Sensors Overview](https://developer.android.com/develop/sensors-and-location/sensors/sensors_overview)**
  Details Android sensor types, 3D device coordinate systems, sampling event rates, and hardware accuracy.
* **[Haptics Design Principles](https://developer.android.com/develop/ui/views/haptics/haptics-principles)**
  Explains semantic feedback effects, device vibrator hardware variance, and user preference enforcement.
* **[Request Runtime Permissions](https://developer.android.com/training/permissions/requesting)**
  Guidance on contextual in-app permission requests, runtime denial handling, and permission UX.
* **[Notification Runtime Permission](https://developer.android.com/develop/ui/views/notifications/notification-permission)**
  Covers the `POST_NOTIFICATIONS` runtime consent requirements introduced in Android 13 (API 33).
* **[Retrieve Current Location](https://developer.android.com/develop/sensors-and-location/location/retrieve-current)**
  Foreground location provider behavior, fine vs. coarse location accuracy, and hardware availability.
* **[Android Keystore System](https://developer.android.com/privacy-and-security/keystore)**
  App-owned cryptographic key isolation, AES-GCM encryption, and hardware-backed security modules.
* **[Show a Biometric Authentication Dialog](https://developer.android.com/identity/sign-in/biometric-auth)**
  System `BiometricPrompt` standards, fingerprint/face sensor enrollment, and prompt lifecycle.
* **[`<uses-permission>` Manifest Element](https://developer.android.com/guide/topics/manifest/uses-permission-element)**
  Technical specification for manifest permission encoding, direct children rules, and XML namespaces.
* **[Google Play Permissions Policy](https://support.google.com/googleplay/android-developer/answer/16558241)**
  Google Play developer distribution standards, restricted permissions declarations, and privacy requirements.
* **[Handling Android App Links](https://developer.android.com/training/app-links/add-applinks)**
  Associate website domains with native Android apps using Digital Asset Links (`assetlinks.json`) and configure deep link verification.

---

## Python Packaging Specifications

* **[Packaging Python Projects Tutorial](https://packaging.python.org/en/latest/tutorials/packaging-projects/)**
  Building wheels, checking distributions, and publishing releases to package repositories.
* **[The Packaging Flow](https://packaging.python.org/en/latest/flow/)**
  How source trees, pure-Python wheels, binary wheels, indexes, and pip installations fit together.
