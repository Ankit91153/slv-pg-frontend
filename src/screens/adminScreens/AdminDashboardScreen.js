import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AdminDashboardScreen() {
  const stats = [
    { label: 'Total Rooms', value: '45', color: '#007AFF' },
    { label: 'Total Floors', value: '5', color: '#34C759' },
    { label: 'Occupied', value: '32', color: '#FF9500' },
    { label: 'Available', value: '13', color: '#5856D6' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, marginTop: 10 },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  statLabel: { fontSize: 14, color: '#666' },
});
