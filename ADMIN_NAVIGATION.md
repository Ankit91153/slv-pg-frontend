# Admin Navigation Structure

## Bottom Tab Navigation (Admin Only)

### 3 Main Tabs:

1. **Dashboard** 📊
   - Icon: stats-chart
   - Shows static data:
     - Total Rooms: 45
     - Total Floors: 5
     - Occupied: 32
     - Available: 13

2. **Services** 🔧
   - Icon: apps
   - Shows 4 service options:
     - Floors (layers icon)
     - Room Types (grid icon)
     - Rooms (bed icon)
     - Beds (business icon)
   - Each option navigates to its respective screen

3. **Settings** ⚙️
   - Icon: settings
   - Simple message: "This is the settings screen"

## Service Sub-Screens

When clicking on any service in the Services tab:

1. **Floors Screen**
   - Message: "This is the Floors screen"

2. **Room Types Screen**
   - Message: "This is the Room Types screen"

3. **Rooms Screen**
   - Message: "This is the Rooms screen"

4. **Beds Screen**
   - Message: "This is the Beds screen"

## Navigation Structure

```
AdminRouter (Stack Navigator)
├── AdminTabs (Bottom Tab Navigator)
│   ├── Dashboard Tab
│   ├── Services Tab
│   └── Settings Tab
└── Service Screens (Stack)
    ├── Floors
    ├── Room Types
    ├── Rooms
    └── Beds
```

## Screen Hierarchy

```
Admin Login
    ↓
Bottom Tabs
    ├── Dashboard (Static stats)
    ├── Services
    │   ├── Click Floors → Floors Screen
    │   ├── Click Room Types → Room Types Screen
    │   ├── Click Rooms → Rooms Screen
    │   └── Click Beds → Beds Screen
    └── Settings (Static message)
```

## Features

✅ Bottom tab navigation with icons
✅ Dashboard with 4 stat cards
✅ Services screen with 4 clickable options
✅ Each service navigates to its own screen
✅ Settings screen with placeholder
✅ Clean, modern UI with shadows and colors
✅ Responsive design
✅ Admin-only access

## Color Scheme

- Dashboard: #007AFF (Blue)
- Floors: #007AFF (Blue)
- Room Types: #34C759 (Green)
- Rooms: #FF9500 (Orange)
- Beds: #5856D6 (Purple)
- Active Tab: #007AFF
- Inactive Tab: #8E8E93

## File Structure

```
src/
├── navigation/
│   ├── AdminRouter.js (Stack with tabs + service screens)
│   └── AdminTabNavigator.js (Bottom tabs)
├── screens/
│   └── adminScreens/
│       ├── AdminDashboardScreen.js
│       ├── AdminServicesScreen.js
│       ├── AdminSettingsScreen.js
│       └── services/
│           ├── FloorsScreen.js
│           ├── RoomTypesScreen.js
│           ├── RoomsScreen.js
│           └── BedsScreen.js
└── constants/
    └── screens.js (All screen names)
```

## Note

This navigation is **ADMIN ONLY**. Tenant users will see different screens (TenantRouter).
