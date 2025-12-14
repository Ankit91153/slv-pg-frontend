/**
 * Theme Context
 * Provides theme state and toggle functionality throughout the app
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme, StatusBar } from 'react-native';
import { lightTheme, darkTheme } from '../styles/theme';
import { createGlobalStyles } from '../styles/globalStyles';

const THEME_STORAGE_KEY = '@app_theme_preference';

// Create Context
const ThemeContext = createContext({
    theme: lightTheme,
    isDark: false,
    themeMode: 'system', // 'light', 'dark', or 'system'
    setThemeMode: () => { },
    globalStyles: createGlobalStyles(lightTheme),
});

/**
 * Theme Provider Component
 */
export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeModeState] = useState('system'); // 'light', 'dark', 'system'
    const [isLoading, setIsLoading] = useState(true);

    // Determine if dark mode should be active
    const isDark = themeMode === 'system'
        ? systemColorScheme === 'dark'
        : themeMode === 'dark';

    // Load saved theme preference on mount
    useEffect(() => {
        loadThemePreference();
    }, []);

    // Update when system theme changes (only if in system mode)
    useEffect(() => {
        if (themeMode === 'system') {
            // Re-render when system theme changes
        }
    }, [systemColorScheme, themeMode]);

    // Load theme preference from AsyncStorage
    const loadThemePreference = async () => {
        try {
            const savedThemeMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedThemeMode !== null && ['light', 'dark', 'system'].includes(savedThemeMode)) {
                setThemeModeState(savedThemeMode);
            } else {
                // Default to system
                setThemeModeState('system');
            }
        } catch (error) {
            console.error('Error loading theme preference:', error);
            setThemeModeState('system');
        } finally {
            setIsLoading(false);
        }
    };

    // Save theme preference to AsyncStorage
    const saveThemePreference = async (mode) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
        } catch (error) {
            console.error('Error saving theme preference:', error);
        }
    };

    // Set theme mode (light, dark, or system)
    const setThemeMode = (mode) => {
        if (['light', 'dark', 'system'].includes(mode)) {
            setThemeModeState(mode);
            saveThemePreference(mode);
        }
    };

    // Legacy toggle function for backward compatibility
    const toggleTheme = () => {
        const newMode = isDark ? 'light' : 'dark';
        setThemeMode(newMode);
    };

    // Get current theme
    const theme = isDark ? darkTheme : lightTheme;

    // Create global styles based on current theme
    const globalStyles = createGlobalStyles(theme);

    // Don't render children until theme is loaded
    if (isLoading) {
        return null; // or a loading screen
    }

    return (
        <ThemeContext.Provider
            value={{
                theme,
                isDark,
                themeMode,
                setThemeMode,
                toggleTheme, // Legacy support
                globalStyles,
            }}
        >
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
            />
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Custom hook to use theme context
 * @returns {Object} { theme, isDark, themeMode, setThemeMode, toggleTheme, globalStyles }
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
