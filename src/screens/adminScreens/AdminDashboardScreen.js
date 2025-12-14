import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDashboardStats } from '../../hooks/useDashboard';
import { SCREEN_NAMES } from '../../constants/screens';
import { useTheme } from '../../context/ThemeContext';
import { createAdminDashboardStyles } from '../../styles/screens/adminDashboardStyles';

export default function AdminDashboardScreen() {
  const navigation = useNavigation();
  const { data: statsResponse, isLoading, refetch } = useDashboardStats();
  const stats = statsResponse?.data;
  const { theme } = useTheme();
  const styles = createAdminDashboardStyles(theme);

  const statCards = [
    {
      label: 'Total Floors',
      value: stats?.totalFloors || 0,
      color: theme.colors.success,
      icon: 'layers',
      screen: SCREEN_NAMES.FLOORS,
    },
    {
      label: 'Total Rooms',
      value: stats?.totalRooms || 0,
      color: theme.colors.primary,
      icon: 'bed',
      screen: SCREEN_NAMES.ROOMS,
    },
    {
      label: 'Total Beds',
      value: stats?.totalBeds || 0,
      color: theme.colors.secondary,
      icon: 'business',
      screen: SCREEN_NAMES.BEDS,
    },
    {
      label: 'Occupied Beds',
      value: stats?.occupiedBeds || 0,
      color: theme.colors.error,
      icon: 'checkmark-circle',
      screen: SCREEN_NAMES.BEDS,
    },
    {
      label: 'Available Beds',
      value: stats?.availableBeds || 0,
      color: theme.colors.warning,
      icon: 'add-circle',
      screen: SCREEN_NAMES.BEDS,
    },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <TouchableOpacity onPress={refetch} style={styles.refreshButton} activeOpacity={0.7}>
            <Ionicons name="refresh" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          {statCards.map((stat, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.statCard, { borderLeftColor: stat.color }]}
              onPress={() => navigation.navigate(stat.screen)}
              activeOpacity={0.7}
            >
              <View style={styles.statHeader}>
                <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
                  <Ionicons name={stat.icon} size={24} color={stat.color} />
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
