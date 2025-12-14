import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { createTenantDashboardStyles } from '../../styles/screens/tenantDashboardStyles';

export default function TenantDashboardScreen() {
  const { theme } = useTheme();
  const styles = createTenantDashboardStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Text style={styles.title}>Tenant Dashboard</Text>
      <Text style={styles.text}>Welcome to your tenant dashboard</Text>
    </SafeAreaView>
  );
}
