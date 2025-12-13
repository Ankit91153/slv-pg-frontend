# Expo Role-Based Navigation App

## Project Structure

```
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

## Features

- Role-based navigation (TENANT/ADMIN)
- Token-based authentication
- Centralized screen name constants
- Clean folder structure

## Testing Login

- Use email with "admin" to login as ADMIN
- Use any other email to login as TENANT

## Run the App

```bash
npm start
# or
npm run ios
npm run android
npm run web
```
