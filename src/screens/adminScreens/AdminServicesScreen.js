import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { SCREEN_NAMES } from '../../constants/screens';

export default function AdminServicesScreen({ navigation }) {
  const { theme } = useTheme();

  const services = [
    { name: 'Floors', icon: 'layers-outline', screen: SCREEN_NAMES.FLOORS, color: theme.colors.primary },
    { name: 'Room Types', icon: 'grid-outline', screen: SCREEN_NAMES.ROOM_TYPES, color: theme.colors.success },
    { name: 'Rooms', icon: 'bed-outline', screen: SCREEN_NAMES.ROOMS, color: theme.colors.warning },
    { name: 'Beds', icon: 'business-outline', screen: SCREEN_NAMES.BEDS, color: theme.colors.info },
    { name: 'Bookings', icon: 'calendar-outline', screen: SCREEN_NAMES.BOOKINGS, color: theme.colors.error },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Services</Text>

      <View style={styles.servicesContainer}>
        {services.map((service, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.serviceCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow }]}
            onPress={() => navigation.navigate(service.screen)}
          >
            <View style={[styles.iconContainer, { backgroundColor: service.color + '20' }]}>
              <Ionicons name={service.icon} size={32} color={service.color} />
            </View>
            <Text style={[styles.serviceName, { color: theme.colors.text }]}>{service.name}</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, marginTop: 10 },
  servicesContainer: { marginTop: 10 },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
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
  serviceName: { flex: 1, fontSize: 18, fontWeight: '600' },
});
