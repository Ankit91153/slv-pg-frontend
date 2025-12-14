import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SCREEN_NAMES } from '../../constants/screens';

export default function AdminServicesScreen({ navigation }) {
  const services = [
    { name: 'Floors', icon: 'layers-outline', screen: SCREEN_NAMES.FLOORS, color: '#007AFF' },
    { name: 'Room Types', icon: 'grid-outline', screen: SCREEN_NAMES.ROOM_TYPES, color: '#34C759' },
    { name: 'Rooms', icon: 'bed-outline', screen: SCREEN_NAMES.ROOMS, color: '#FF9500' },
    { name: 'Beds', icon: 'business-outline', screen: SCREEN_NAMES.BEDS, color: '#5856D6' },
    { name: 'Bookings', icon: 'calendar-outline', screen: SCREEN_NAMES.BOOKINGS, color: '#FF3B30' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Services</Text>
      
      <View style={styles.servicesContainer}>
        {services.map((service, index) => (
          <TouchableOpacity
            key={index}
            style={styles.serviceCard}
            onPress={() => navigation.navigate(service.screen)}
          >
            <View style={[styles.iconContainer, { backgroundColor: service.color + '20' }]}>
              <Ionicons name={service.icon} size={32} color={service.color} />
            </View>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, marginTop: 10 },
  servicesContainer: { marginTop: 10 },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  serviceName: { flex: 1, fontSize: 18, fontWeight: '600', color: '#333' },
});
