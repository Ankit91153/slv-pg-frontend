import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminUsersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Users</Text>
      <Text style={styles.text}>User management interface</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  text: { fontSize: 16, textAlign: 'center' },
});
