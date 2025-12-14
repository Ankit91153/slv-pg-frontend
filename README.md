# 📱 PG Connect – Expo Role-Based Navigation App

A production-ready **React Native application built with Expo** that demonstrates **role-based navigation (ADMIN / TENANT)**, authentication flow, and **Over-The-Air (OTA) updates using Expo EAS**. The backend is powered by **NestJS, Prisma, and PostgreSQL**, deployed on Render.

---

## 🧱 Project Structure

```txt
src/
├── constants/
│   └── screens.js          # Global screen names and role constants
├── navigation/
│   ├── UnauthRouter.js     # Unauthenticated routes (Login, Register)
│   ├── AuthRouter.js       # Main auth router (role-based routing)
│   ├── TenantRouter.js     # Tenant-specific routes
│   └── AdminRouter.js      # Admin-specific routes
└── screens/
    ├── unauth/             # Unauthenticated screens
    │   ├── LoginScreen.js
    │   └── RegisterScreen.js
    ├── auth/               # Common authenticated screens
    │   └── ProfileScreen.js
    ├── tenantScreens/      # Tenant-only screens
    │   ├── TenantHomeScreen.js
    │   └── TenantDashboardScreen.js
    └── adminScreens/       # Admin-only screens
        ├── AdminHomeScreen.js
        ├── AdminDashboardScreen.js
        └── AdminUsersScreen.js
```

---

## ✨ Features

* 🔐 Role-based navigation (**ADMIN / TENANT**)
* 🔑 Token-based authentication
* 🧭 Clean and scalable navigation architecture
* 🗂 Centralized screen name constants
* 🚀 OTA updates using **Expo EAS Update**
* 🌐 Backend integration with **NestJS + Prisma + PostgreSQL**

---

## 🔐 Testing Login

* Use an email containing **"admin"** → logs in as **ADMIN**
* Use any other email → logs in as **TENANT**

---

## 🚀 Running the App Locally (Development)

```bash
npm install
npx expo start
```

Run on:

* 📱 Expo Go (Android / iOS)
* 📱 Android Emulator / iOS Simulator
* 🌐 Web Browser

---

## 🌍 Live App Preview (No Install Required)

You can preview the app instantly using **Expo Go**.

🔗 **Live Preview Link**
👉 [https://expo.dev/@ankitpandey1609/pg-connect](https://expo.dev/@ankitpandey1609/pg-connect)

### How to Open:

1. Install **Expo Go** from Play Store / App Store
2. Open the link above **OR** scan the QR code from the Expo dashboard
3. The app loads instantly on your device

> ℹ️ This link remains the same even after app updates.

---

## 🔁 Updating the App (OTA – Over The Air)

This project uses **Expo EAS Update**, allowing updates without rebuilding the app.

### Publish an Update

```bash
eas update --branch main --message "UI improvements"
```

✔ Users automatically receive the latest version
✔ No new link required
✔ No reinstall needed

---

## 🏗 When a New Build Is Required

A new build is required only if you change:

* App icon or splash screen
* Android / iOS native configuration
* Native permissions
* Native dependencies

```bash
eas build
```

---

## 🛠 Tech Stack

* **Frontend:** React Native, Expo
* **Backend:** NestJS
* **Database:** PostgreSQL (Render)
* **ORM:** Prisma
* **Authentication:** JWT
* **Email Service:** Resend
* **Deployment:** Expo EAS + Render

---

## 📌 Resume-Ready Description

```
PG Connect – Mobile Application
• Built a role-based mobile app using React Native and Expo
• Implemented OTA updates with Expo EAS
• Backend developed with NestJS, Prisma, PostgreSQL
• Deployed backend and database on Render
```

---

## 👤 Author

**Ankit Pandey**
Full-Stack Developer
React Native • NestJS • PostgreSQL  Prisma

---

⭐ If you like this project, feel free to star the repository and explore the code!
