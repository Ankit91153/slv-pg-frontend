import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDashboardStats } from '../../hooks/useDashboard';
import { SCREEN_NAMES } from '../../constants/screens';

export default function AdminDashboardScreen() {
  const navigation = useNavigation();
  const { data: statsResponse, isLoading, refetch } = useDashboardStats();
  const stats = statsResponse?.data;

  const statCards = [
    { 
      label: 'Total Floors', 
      value: stats?.totalFloors || 0, 
      color: '#34C759',
      icon: 'layers',
      screen: SCREEN_NAMES.FLOORS,
    },
    { 
      label: 'Total Rooms', 
      value: stats?.totalRooms || 0, 
      color: '#007AFF',
      icon: 'bed',
      screen: SCREEN_NAMES.ROOMS,
    },
    { 
      label: 'Total Beds', 
      value: stats?.totalBeds || 0, 
      color: '#5856D6',
      icon: 'business',
      screen: SCREEN_NAMES.BEDS,
    },
    { 
      label: 'Occupied Beds', 
      value: stats?.occupiedBeds || 0, 
      color: '#FF3B30',
      icon: 'checkmark-circle',
      screen: SCREEN_NAMES.BEDS,
    },
    { 
      label: 'Available Beds', 
      value: stats?.availableBeds || 0, 
      color: '#FF9500',
      icon: 'add-circle',
      screen: SCREEN_NAMES.BEDS,
    },
  ];

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={refetch} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#007AFF" />
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
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  title: { fontSize: 28, fontWeight: 'bold' },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  statLabel: { fontSize: 14, color: '#666' },
});
