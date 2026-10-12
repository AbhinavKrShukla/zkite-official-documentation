---
title: Practical Learning Exercises
description: Six step-by-step hands-on exercises to master ZKite development workflows and APIs.
---

Solidify your understanding of ZKite by completing these six progressive exercises.

---

### Exercise 1: Understand the Starter App
* **Goal**: Build and run an app without an active preview session.
* **Steps**:
  1. Create a project: `zkite new exercise_one`.
  2. Inspect `main.py` and modify the displayed greeting text.
  3. Run `zkite run` to install a standalone build on your phone.
  4. Disconnect the USB cable or close the computer terminal.
* **Success Criteria**: The application launches cleanly from your phone's Android app launcher drawer.

---

### Exercise 2: Multi-Field Reactive State
* **Goal**: Manage multiple state fields within a single `Store`.
* **Steps**:
  1. Add a second state variable (e.g. `is_liked: bool = False`) to your `Store`.
  2. Create a heart toggle button that updates `is_liked` while retaining the existing tap counter.
  3. Verify that updating one field does not unintentionally overwrite or reset the other.

---

### Exercise 3: Build a Validated Form
* **Goal**: Implement controlled text input with live validation.
* **Steps**:
  1. Add a `TextField` for an email address and a `Button` for submission.
  2. Validate whether the email contains an `@` symbol as the user types.
  3. Show a red validation warning text when invalid, and enable the submit button only when valid.
  4. Test typing, deleting all text, and dismissing the software keyboard on your device.

---

### Exercise 4: Adaptive Themed Screen
* **Goal**: Coordinate in-app colors with Android status and navigation bars.
* **Steps**:
  1. Wrap your root view in [`SystemBars`](/widgets/system-bars/).
  2. Add a `Switch` that toggles between Dark Mode (`#0b0f19`) and Light Mode (`#ffffff`).
  3. Bind `status_color`, `navigation_color`, and icon contrast (`light`/`dark`) to the active theme state.

---

### Exercise 5: Navigation & Modal Dialogs
* **Goal**: Implement multi-screen navigation and dialog confirmation.
* **Steps**:
  1. Set up [`Nav`](/widgets/nav/) with a `HomeScreen` and a `DetailsScreen`.
  2. Pass an item ID from the home screen into the details screen via `nav.push("details", item_id="101")`.
  3. Add a delete button on the details screen that triggers an [`Overlay`](/widgets/overlay/) confirmation modal.
  4. Verify that Android Back dismisses the overlay first without popping the screen.

---

### Exercise 6: Package a Production App
* **Goal**: Build and sign a distributable APK with custom branding.
* **Steps**:
  1. Generate a permanent release key with `zkite keygen --out release_key`.
  2. Set your custom `package` identifier, `label`, and `icon = "icon.png"` in `pyproject.toml`.
  3. Build the APK: `zkite build apk --abi arm64-v8a --keystore release_key.pem`.
  4. Install and verify the custom launcher icon and app label on your phone.
