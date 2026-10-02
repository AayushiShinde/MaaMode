# MaaMode Native Android Project (Overlay & Accessibility APK) 🧕
> **Real-time floating spotlight and spoken guidance over the REAL WhatsApp and Uber apps.**

---

## 📱 How This Works on Mom's Real Phone

Unlike a web app, this native Android app has the OS permissions to **float above and inspect third-party apps**:

1. **`SYSTEM_ALERT_WINDOW` ("Display over other apps")**:
   - Spawns a floating golden spotlight ring and MaaMode avatar that stays on screen when WhatsApp or Uber opens.
2. **`AccessibilityService` (`MaaModeAccessibilityService`)**:
   - Inspects the live UI node tree in `com.whatsapp` and `com.ubercab`.
   - Locates target buttons (e.g. Papa's contact, attachment paperclip, gallery, send button, or Uber Auto card).
   - Dynamically calculates the exact screen coordinates (`Rect`) and positions the glowing spotlight directly over the real button!
3. **`VoiceCoach`**:
   - Speaks warm Marathi instructions using Android's native Text-to-Speech (*"आता इथे दाबा आई"*).

---

## 🛠️ Project Structure

```
MaaMode-Android/
├── app/
│   ├── src/main/
│   │   ├── AndroidManifest.xml
│   │   ├── res/
│   │   │   ├── xml/accessibility_service_config.xml
│   │   │   ├── values/strings.xml
│   │   │   └── drawable/app_logo.png
│   │   └── java/com/maamode/app/
│   │       ├── MainActivity.kt                 # Permission onboarding & launcher
│   │       ├── MaaModeOverlayService.kt        # WindowManager floating spotlight overlay
│   │       ├── MaaModeAccessibilityService.kt  # Real-time node detection for WhatsApp & Uber
│   │       └── VoiceCoach.kt                   # Native Marathi TTS coach
│   └── build.gradle.kts
├── build.gradle.kts
└── settings.gradle.kts
```

---

## 🚀 How to Build & Install the APK on Mom's Phone

1. **Open in Android Studio**:
   - Launch Android Studio $\rightarrow$ Open $\rightarrow$ select `C:\Users\Ayushi_Shinde\.gemini\antigravity-ide\scratch\MaaMode-Android`.
2. **Build the APK**:
   - Menu $\rightarrow$ **Build** $\rightarrow$ **Build Bundle(s) / APK(s)** $\rightarrow$ **Build APK(s)**.
   - When finished, click **"locate"** to find `app-debug.apk`.
3. **Install on Phone**:
   - Send `app-debug.apk` to Mom's phone (via USB, Google Drive, or WhatsApp).
   - Tap to install.
4. **First-time Setup on Mom's Phone**:
   - Open **MaaMode**.
   - Tap **"१. स्क्रीनवर दिसण्याची परवानगी"** $\rightarrow$ toggle ON "Allow display over other apps".
   - Tap **"२. स्क्रीन वाचण्याची परवानगी"** $\rightarrow$ find MaaMode under Installed Services and toggle ON.
   - Tap **"💬 व्हॉट्सॲप उघडा व मदत घ्या"** or **"🛺 उबर उघडा व रिक्षा बुक करा"**.
   - The real WhatsApp / Uber opens with the floating glowing spotlight pointing to where Mom needs to tap!
