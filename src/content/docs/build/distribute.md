---
title: Build, Sign, and Distribute
description: Generating production APKs and AAB bundles, managing signing keys, and distributing Android applications.
---

Distributing your Android application through app stores is completely separate from how ZKite is installed via pip. Your end users install a native Android package (`.apk` or `.aab`)—they do not need Python or pip on their devices.

---

## 1. Automatic Release Signing Keys (New in 1.1.2)

In ZKite 1.1.2, release builds automatically manage signing identities under the ignored `keystore/` directory:

```bash
# Generate the default release keypair
zkite keygen --cn "My company"
```

This generates:
* `keystore/release.pem` (Combined private key and certificate used by ZKite)
* `keystore/release.p12` (Standard PKCS#12 keystore)

If no release key exists when running a build command, `zkite build apk` or `zkite build aab` creates the PEM/PKCS#12 pair automatically.

### Key Discovery Order
1. Explicit `--keystore PATH` CLI argument
2. `keystore/release.pem` (project default)
3. Legacy root-level `zkite-release.pem`

:::danger[Secure Your Private Key]
Keep `keystore/release.pem` and `keystore/release.p12` safe and backed up in a secure password manager or key vault outside your repository. Git automatically ignores the `keystore/` folder. If you lose this key, Android will permanently prevent you from shipping updates to existing users of that package ID.
:::

---

## 2. Building Release Artifacts

Both `zkite build apk` and `zkite build aab` automatically detect and reuse `keystore/release.pem`.

### Standalone APK (Direct Sideloading / Direct Download)

For direct user installation or testing on physical phones:

```bash
zkite build apk --abi arm64-v8a --out dist/
```

### Android App Bundle (Google Play Store)

Google Play and modern app stores require an **Android App Bundle (.aab)**. Pass all target architectures so the store can generate optimized split APKs:

```bash
zkite build aab --abi arm64-v8a --abi x86_64
```

To sign with a key stored in an alternative location, pass `--keystore`:

```bash
zkite build aab --abi arm64-v8a --abi x86_64 --keystore /secure/keys/my_app.pem
```

---

---

## 3. Shipping Updates

When releasing a new version of an existing application:

1. **Keep `package` identical** in `app.json` (or `pyproject.toml` in legacy projects).
2. **Increment `version_code`** (e.g. from `1` to `2`). Android will reject any install where the version code is lower than or equal to the existing installation.
3. **Update `version`** string (e.g. `"1.2.0"`).
4. **Sign with the exact same key**: Android cryptographically checks that the update signature matches the installed signature.

---

## 4. Compiled Manifest Verification & Google Play (New in 1.2.0)

ZKite 1.2.0 performs automated verification of the compiled binary Android manifest directly inside the final signed APK or AAB:

* **Built-in Rust Manifest Validator**: Analyzes `AndroidManifest.xml` (for APKs) and `base/manifest/AndroidManifest.xml` (for AABs) without requiring external Android SDK or Java command-line tools.
* **Manifest Correctness**: Validates that all `<uses-permission>` tags are direct children of `<manifest>`, verifies proper resource and namespace encoding, and rejects duplicate permission declarations.
* **Optional Hardware Attributes**: Marks camera, autofocus, microphone, and location hardware features with `android:required="false"` to prevent Google Play from filtering out devices lacking specific sensors.

### Google Play Compliance Checklist
* **Review Inferred Permissions**: Inspect `app.json` and `.zkite/permissions.json` to confirm all declared permissions match actual application usage.
* **Test Denial & Recoveries**: Verify that denying camera, location, or microphone permissions displays a graceful in-app recovery rather than crashing.
* **Data Safety & Privacy Policy**: Complete Google Play's Data Safety form and link an active Privacy Policy in the Play Console matching your actual app data collection.
* **Manifest Checks vs Store Approval**: Technical manifest verification prevents invalid APK/AAB packaging errors; store policy compliance remains the developer's responsibility.
