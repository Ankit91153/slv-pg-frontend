import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TenantHomeScreen from '../screens/tenantScreens/TenantHomeScreen';
import TenantDashboardScreen from '../screens/tenantScreens/TenantDashboardScreen';
import ProfileScreen from '../screens/auth/ProfileScreen';
import { SCREEN_NAMES, USER_ROLES } from '../constants/screens';

const Stack = createNativeStackNavigator();

export default function TenantRouter({ onLogout }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name={SCREEN_NAMES.TENANT_HOME} component={TenantHomeScreen} />
      <Stack.Screen name={SCREEN_NAMES.TENANT_DASHBOARD} component={TenantDashboardScreen} />
      <Stack.Screen name={SCREEN_NAMES.PROFILE}>
        {(props) => <ProfileScreen {...props} onLogout={onLogout} userRole={USER_ROLES.TENANT} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
