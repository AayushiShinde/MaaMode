# MaaMode (माझं Mode / MaaMate) ❤️
> **"Don't make Mom learn the phone. Make the phone learn Mom."**  
> *Built for Mom for DEV Hacktoberfest Weekend 2026: "Build for a Friend"*

---

## 📁 Project Directory Overview

This master folder (C:\Users\Ayushi_Shinde\MaaMode) contains both parts of the solution:

### 1. MaaMode-Web/ (Full PWA Web App + Cloud Backend)
- **What it is**: Mobile Progressive Web App with offline service worker, interactive smartphone sandbox, and bilingual voice engine.
- **Includes**:
  - ender.yaml: 1-click Render blueprint deployment (**Best Use of Render - **).
  - server.js: Node.js/Express server with secure ElevenLabs TTS proxy.
  - oice-engine.js: Integrated with **ElevenLabs Multilingual v2** maternal voice (**Best Use of ElevenLabs - **).
  - i-engine.js: **Google Gemma 2** local intent classifier & message simplifier (**Best Use of Gemma - **).
  - 	utorial-sandbox.js: Complete interactive guided tutorials (WhatsApp Photo, Document/Aadhaar PDF, Live GPS Location, UPI Payment, WhatsApp Status with Caption, Uber Auto Booking).
  - sw.js & manifest.json: Offline PWA installation on any mobile phone.

### 2. MaaMode-Android/ (Native Kotlin Android Studio Project)
- **What it is**: Production-ready Android Studio project with Android OS permissions to float live over other apps.
- **Includes**:
  - MaaModeOverlayService.kt: Uses SYSTEM_ALERT_WINDOW to render a glowing gold spotlight ring directly over real apps.
  - MaaModeAccessibilityService.kt: Uses Android's AccessibilityService to inspect the live screen tree inside the real WhatsApp (com.whatsapp) and Uber (com.ubercab), positioning the spotlight right on the real buttons.
  - MainActivity.kt: Jetpack Compose onboarding screen with Marathi permission toggles.

---

## 🚀 Quick Start Guide

### To run the Web PWA on your phone:
1. Open PowerShell and run:
   `powershell
   cd C:\Users\Ayushi_Shinde\MaaMode\MaaMode-Web
   python -m http.server 3000
   `
2. On Mom's phone browser, navigate to http://10.212.56.1:3000 (or scan the in-app QR code).
3. Tap **"इन्स्टॉल करा"** to add it to her home screen.

### To build the Native Android APK:
1. Open Android Studio.
2. Select **Open** and choose C:\Users\Ayushi_Shinde\MaaMode\MaaMode-Android.
3. Click **Build -> Build APK(s)** and install pp-debug.apk on Mom's phone.
