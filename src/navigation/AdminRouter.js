import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminHomeScreen from '../screens/adminScreens/AdminHomeScreen';
import AdminDashboardScreen from '../screens/adminScreens/AdminDashboardScreen';
import AdminUsersScreen from '../screens/adminScreens/AdminUsersScreen';
import ProfileScreen from '../screens/auth/ProfileScreen';
import { SCREEN_NAMES, USER_ROLES } from '../constants/screens';

const Stack = createNativeStackNavigator();

export default function AdminRouter({ onLogout }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name={SCREEN_NAMES.ADMIN_HOME} component={AdminHomeScreen} />
      <Stack.Screen name={SCREEN_NAMES.ADMIN_DASHBOARD} component={AdminDashboardScreen} />
      <Stack.Screen name={SCREEN_NAMES.ADMIN_USERS} component={AdminUsersScreen} />
      <Stack.Screen name={SCREEN_NAMES.PROFILE}>
        {(props) => <ProfileScreen {...props} onLogout={onLogout} userRole={USER_ROLES.ADMIN} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
