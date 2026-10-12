---
title: Build, Sign, and Distribute
description: Generating production APKs and AAB bundles, managing signing keys, and distributing Android applications.
---

Distributing your Android application through app stores is completely separate from how ZKite is installed via pip. Your end users install a native Android package (`.apk` or `.aab`)—they do not need Python or pip on their devices.

---

## 1. Generate a Permanent Signing Key

For apps released to testers or app stores, generate a permanent signing key:

```bash
zkite keygen --out my_release_key --cn "MyCompany Android Release"
```

This generates:
* `my_release_key.pem` (Combined private key and certificate used by ZKite)
* `my_release_key.p12` (Standard PKCS#12 keystore)

:::danger[Secure Your Private Key]
Keep `my_release_key.pem` safe and backed up in a secure password manager or key vault. Never commit signing keys to Git. If you lose this key, Android will permanently prevent you from shipping updates to existing users of that package ID.
:::

---

## 2. Building Release Artifacts

### Standalone APK (Direct Sideloading / Direct Download)

For direct user installation or testing on physical phones:

```bash
zkite build apk \
  --abi arm64-v8a \
  --keystore /path/to/my_release_key.pem \
  --out dist/
```

### Android App Bundle (Google Play Store)

Google Play and modern app stores require an **Android App Bundle (.aab)**. Pass all target architectures so the store can generate optimized split APKs:

```bash
zkite build aab \
  --abi arm64-v8a \
  --abi x86_64 \
  --keystore /path/to/my_release_key.pem \
  --out dist/
```

---

## 3. Shipping Updates

When releasing a new version of an existing application:

1. **Keep `package` identical** in `app.json` (or `pyproject.toml` in legacy projects).
2. **Increment `version_code`** (e.g. from `1` to `2`). Android will reject any install where the version code is lower than or equal to the existing installation.
3. **Update `version`** string (e.g. `"1.1.0"`).
4. **Sign with the exact same key**: Android cryptographically checks that the update signature matches the installed signature.
