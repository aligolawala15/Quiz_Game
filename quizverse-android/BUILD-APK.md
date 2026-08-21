# Build the QUIZVERSE APK

This is a ready-to-build **Capacitor** Android project. Your quiz app (all HTML/CSS/JS)
is bundled inside `www/`, so the final APK runs fully offline — it is NOT just a
shortcut to a website.

- **App name:** QUIZVERSE
- **Package / App ID:** `com.quizverse.app`
- **Output:** a real `.apk` you install and manage yourself

---

## Option A — Build locally (full control of the APK)

### 1. Install the prerequisites (one time)
- **Node.js 18+** — https://nodejs.org
- **Java JDK 17** — https://adoptium.net
- **Android Studio** — https://developer.android.com/studio
  (during setup, let it install the Android SDK + build tools)

### 2. Generate the native Android project
Open a terminal **in this folder** (`quizverse-android`) and run:

```bash
npm install
npx cap add android
npx cap sync
```

### 3. Build the APK
```bash
cd android
# macOS / Linux:
./gradlew assembleDebug
# Windows:
gradlew.bat assembleDebug
```

Your installable APK appears at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

Copy that file to your phone and tap it to install (enable
"Install unknown apps" for your file manager when prompted).

### 4. (Optional) Edit in Android Studio instead
```bash
npx cap open android
```
Then press **Run ▶** to install on a connected phone/emulator, or
**Build → Build Bundle(s)/APK(s) → Build APK(s)**.

---

## Option B — Build in the browser, no tools installed (easiest)

Your app is already live and installable, which lets **PWABuilder** package it:

1. Go to **https://www.pwabuilder.com**
2. Paste your URL: **https://qsgnau39.mule.page/**
3. Click **Package for stores → Android → Download**
4. You get a signed `.apk` / `.aab` plus a signing key. Install the `.apk`
   directly, or upload the `.aab` to the Google Play Console.

This uses the manifest and icons already configured in this project.

---

## Publishing to the Google Play Store (optional)
1. Create a **Google Play Developer** account (one-time $25 fee).
2. Build a **release AAB**: `./gradlew bundleRelease` (or use the PWABuilder `.aab`).
3. In **Play Console**: create an app → upload the AAB → fill store listing →
   submit for review.

## Signing a release APK (for sideloading a permanent build)
```bash
keytool -genkey -v -keystore quizverse.keystore -alias quizverse \
  -keyalg RSA -keysize 2048 -validity 10000
cd android && ./gradlew assembleRelease
```
Configure the keystore in `android/app/build.gradle` (signingConfigs) before the release build.

---

## Notes
- **iOS (.ipa):** run `npx cap add ios` — but building an iPhone app **requires a Mac with Xcode**
  and an Apple Developer account ($99/yr). Android has no such restriction.
- The icons in `www/assets/` are reused automatically. To set the launcher icon,
  in Android Studio: right-click `res` → **New → Image Asset** and pick
  `www/assets/icon-512.png`.
