/**
 * Centralized Color Palette
 * Contains all color definitions for both light and dark themes
 */

export const Colors = {
    // Light Theme Colors
    light: {
        // Primary Brand Colors
        primary: '#007AFF',       // iOS Blue
        primaryLight: '#4DA3FF',
        primaryDark: '#0051D5',
        secondary: '#5856D6',     // Purple
        secondaryLight: '#7F7EE0',
        secondaryDark: '#3634A3',
        accent: '#FF9500',        // Orange

        // Semantic Colors
        success: '#34C759',       // Green
        successLight: '#64D97E',
        error: '#FF3B30',         // Red
        errorLight: '#FF6B62',
        warning: '#FF9500',       // Orange
        warningLight: '#FFB340',
        info: '#007AFF',
        infoLight: '#4DA3FF',

        // Background Colors
        background: '#F5F5F7',    // Light gray
        backgroundSecondary: '#FFFFFF',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        elevated: '#FFFFFF',

        // Text Colors
        text: '#000000',
        textSecondary: '#666666',
        textTertiary: '#999999',
        textDisabled: '#C7C7CC',
        textInverse: '#FFFFFF',

        // Border Colors
        border: '#E5E5EA',
        borderLight: '#F2F2F7',
        borderDark: '#D1D1D6',

        // Input Colors
        inputBackground: '#FFFFFF',
        inputBorder: '#E5E5EA',
        inputBorderFocused: '#007AFF',
        inputBorderError: '#FF3B30',
        inputPlaceholder: '#C7C7CC',

        // Shadow
        shadow: '#000000',
        shadowLight: 'rgba(0, 0, 0, 0.05)',
        shadowMedium: 'rgba(0, 0, 0, 0.1)',
        shadowDark: 'rgba(0, 0, 0, 0.15)',

        // Status Colors (for PG Management)
        available: '#34C759',
        occupied: '#FF3B30',
        pending: '#FF9500',
        maintenance: '#999999',

        // Tab Bar
        tabBarBackground: '#FFFFFF',
        tabBarBorder: '#E5E5EA',
        tabBarActive: '#007AFF',
        tabBarInactive: '#999999',
    },

    // Dark Theme Colors
    dark: {
        // Primary Brand Colors
        primary: '#0A84FF',       // iOS Blue (Dark Mode)
        primaryLight: '#409CFF',
        primaryDark: '#006FDB',
        secondary: '#5E5CE6',     // Purple (Dark Mode)
        secondaryLight: '#7D7AFF',
        secondaryDark: '#4C4ACF',
        accent: '#FF9F0A',        // Orange (Dark Mode)

        // Semantic Colors
        success: '#32D74B',       // Green (Dark Mode)
        successLight: '#64DE77',
        error: '#FF453A',         // Red (Dark Mode)
        errorLight: '#FF6961',
        warning: '#FF9F0A',       // Orange (Dark Mode)
        warningLight: '#FFB340',
        info: '#0A84FF',
        infoLight: '#409CFF',

        // Background Colors
        background: '#000000',    // True black
        backgroundSecondary: '#1C1C1E',
        surface: '#1C1C1E',
        card: '#2C2C2E',
        elevated: '#3A3A3C',

        // Text Colors
        text: '#FFFFFF',
        textSecondary: '#EBEBF5',
        textTertiary: '#ABABAB',
        textDisabled: '#636366',
        textInverse: '#000000',

        // Border Colors
        border: '#38383A',
        borderLight: '#2C2C2E',
        borderDark: '#48484A',

        // Input Colors
        inputBackground: '#1C1C1E',
        inputBorder: '#38383A',
        inputBorderFocused: '#0A84FF',
        inputBorderError: '#FF453A',
        inputPlaceholder: '#636366',

        // Shadow
        shadow: '#000000',
        shadowLight: 'rgba(0, 0, 0, 0.3)',
        shadowMedium: 'rgba(0, 0, 0, 0.4)',
        shadowDark: 'rgba(0, 0, 0, 0.5)',

        // Status Colors (for PG Management)
        available: '#32D74B',
        occupied: '#FF453A',
        pending: '#FF9F0A',
        maintenance: '#8E8E93',

        // Tab Bar
        tabBarBackground: '#1C1C1E',
        tabBarBorder: '#38383A',
        tabBarActive: '#0A84FF',
        tabBarInactive: '#8E8E93',
    },
};

/**
 * Get color from theme
 * @param {boolean} isDark - Whether dark mode is active
 * @param {string} colorKey - Color key from Colors object
 * @returns {string} Color value
 */
export const getColor = (isDark, colorKey) => {
    return isDark ? Colors.dark[colorKey] : Colors.light[colorKey];
};
