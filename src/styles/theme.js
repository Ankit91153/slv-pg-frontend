/**
 * Theme Configuration
 * Combines colors, typography, spacing, and other design tokens
 */

import { Colors } from './colors';
import { Typography, Spacing, BorderRadius, IconSize } from './responsive';

/**
 * Shadow Presets
 */
const shadows = {
    light: {
        none: {
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
        },
        sm: {
            shadowColor: Colors.light.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        md: {
            shadowColor: Colors.light.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        lg: {
            shadowColor: Colors.light.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 5,
        },
        xl: {
            shadowColor: Colors.light.shadow,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 8,
        },
    },
    dark: {
        none: {
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
        },
        sm: {
            shadowColor: Colors.dark.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 1,
        },
        md: {
            shadowColor: Colors.dark.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 4,
            elevation: 3,
        },
        lg: {
            shadowColor: Colors.dark.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 5,
        },
        xl: {
            shadowColor: Colors.dark.shadow,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.6,
            shadowRadius: 16,
            elevation: 8,
        },
    },
};

/**
 * Light Theme
 */
export const lightTheme = {
    colors: Colors.light,
    typography: Typography,
    spacing: Spacing,
    borderRadius: BorderRadius,
    iconSize: IconSize,
    shadows: shadows.light,
    isDark: false,
};

/**
 * Dark Theme
 */
export const darkTheme = {
    colors: Colors.dark,
    typography: Typography,
    spacing: Spacing,
    borderRadius: BorderRadius,
    iconSize: IconSize,
    shadows: shadows.dark,
    isDark: true,
};

/**
 * Get theme based on mode
 */
export const getTheme = (isDark) => (isDark ? darkTheme : lightTheme);

/**
 * Default theme
 */
export const defaultTheme = lightTheme;
