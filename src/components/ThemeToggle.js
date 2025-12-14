/**
 * Theme Toggle Component
 * A reusable component for switching between light, dark, and system themes
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Spacing, BorderRadius } from '../styles/responsive';

export default function ThemeToggle({ style }) {
    const { theme, themeMode, setThemeMode } = useTheme();

    const options = [
        { mode: 'light', icon: 'sunny', label: 'Light' },
        { mode: 'dark', icon: 'moon', label: 'Dark' },
        { mode: 'system', icon: 'phone-portrait', label: 'System' },
    ];

    return (
        <View style={[styles.container, style]}>
            {options.map((option) => {
                const isActive = themeMode === option.mode;
                return (
                    <TouchableOpacity
                        key={option.mode}
                        style={[
                            styles.option,
                            {
                                backgroundColor: isActive ? theme.colors.primary : theme.colors.card,
                                borderColor: isActive ? theme.colors.primary : theme.colors.border,
                            },
                            theme.shadows.sm,
                        ]}
                        onPress={() => setThemeMode(option.mode)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={option.icon}
                            size={20}
                            color={isActive ? theme.colors.textInverse : theme.colors.textSecondary}
                        />
                        <Text
                            style={[
                                styles.label,
                                {
                                    color: isActive ? theme.colors.textInverse : theme.colors.text,
                                    fontWeight: isActive ? '600' : 'normal',
                                },
                            ]}
                        >
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    option: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.sm,
        borderRadius: BorderRadius.sm,
        borderWidth: 1,
        gap: Spacing.xs,
    },
    label: {
        fontSize: 13,
    },
});
