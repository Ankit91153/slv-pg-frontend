import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminSettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.message}>This is the settings screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, marginTop: 10 },
  message: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 50 },
});
