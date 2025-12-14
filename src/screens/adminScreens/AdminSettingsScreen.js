import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import { Spacing, Typography } from '../../styles/responsive';

export default function AdminSettingsScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>

      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Appearance</Text>
        <ThemeToggle />
      </View>

      <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
        More settings coming soon...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg
  },
  title: {
    fontSize: Typography.h1.fontSize,
    fontWeight: 'bold',
    marginBottom: Spacing.xl,
    marginTop: Spacing.md
  },
  section: {
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.h4.fontSize,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  message: {
    fontSize: Typography.body1.fontSize,
    textAlign: 'center',
    marginTop: Spacing.xl
  },
});
