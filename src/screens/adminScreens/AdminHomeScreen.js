import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SCREEN_NAMES } from '../../constants/screens';

export default function AdminHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Home</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate(SCREEN_NAMES.ADMIN_DASHBOARD)}
      >
        <Text style={styles.buttonText}>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate(SCREEN_NAMES.ADMIN_USERS)}
      >
        <Text style={styles.buttonText}>Manage Users</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate(SCREEN_NAMES.PROFILE)}
      >
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginBottom: 10 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});
