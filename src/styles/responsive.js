/**
 * Responsive Design Utilities
 * Handles responsive font sizes, spacing, and device detection
 */

import { Dimensions, PixelRatio, Platform } from 'react-native';

// Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 12/13/14 size)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Device Type Detection
 */
export const DeviceType = {
    isPhone: SCREEN_WIDTH < 768,
    isTablet: SCREEN_WIDTH >= 768,
    isSmallPhone: SCREEN_WIDTH < 375,
    isLargePhone: SCREEN_WIDTH >= 414,
};

/**
 * Screen Dimensions
 */
export const Screen = {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    isPortrait: SCREEN_HEIGHT > SCREEN_WIDTH,
    isLandscape: SCREEN_WIDTH > SCREEN_HEIGHT,
};

/**
 * Responsive Width
 * Scales width proportionally to screen width
 */
export const wp = (percentage) => {
    const value = (percentage * SCREEN_WIDTH) / 100;
    return Math.round(PixelRatio.roundToNearestPixel(value));
};

/**
 * Responsive Height
 * Scales height proportionally to screen height
 */
export const hp = (percentage) => {
    const value = (percentage * SCREEN_HEIGHT) / 100;
    return Math.round(PixelRatio.roundToNearestPixel(value));
};

/**
 * Responsive Font Size
 * Scales font size based on screen width with limits
 */
export const fontSize = (size) => {
    if (DeviceType.isTablet) {
        // Tablets get 1.2x font size
        return Math.round(size * 1.2);
    }

    // Scale based on screen width ratio
    const scale = SCREEN_WIDTH / BASE_WIDTH;
    const newSize = size * scale;

    // Apply limits to prevent too small or too large fonts
    const minSize = size * 0.8;
    const maxSize = size * 1.2;

    return Math.round(Math.min(Math.max(newSize, minSize), maxSize));
};

/**
 * Line Height
 * Calculates appropriate line height based on font size
 */
export const lineHeight = (size, multiplier = 1.4) => {
    return Math.round(fontSize(size) * multiplier);
};

/**
 * Responsive Spacing
 * Scales spacing based on device type
 */
export const spacing = (size) => {
    if (DeviceType.isTablet) {
        return Math.round(size * 1.3);
    }
    return size;
};

/**
 * Predefined Spacing Scale (based on 4px grid)
 */
export const Spacing = {
    xs: spacing(4),
    sm: spacing(8),
    md: spacing(12),
    lg: spacing(16),
    xl: spacing(20),
    xxl: spacing(24),
    xxxl: spacing(32),
    huge: spacing(40),
};

/**
 * Responsive Border Radius
 */
export const borderRadius = (size) => {
    if (DeviceType.isTablet) {
        return Math.round(size * 1.2);
    }
    return size;
};

/**
 * Predefined Border Radius Scale
 */
export const BorderRadius = {
    xs: borderRadius(4),
    sm: borderRadius(8),
    md: borderRadius(12),
    lg: borderRadius(16),
    xl: borderRadius(20),
    round: borderRadius(999),
};

/**
 * Icon Sizes
 */
export const IconSize = {
    xs: fontSize(16),
    sm: fontSize(20),
    md: fontSize(24),
    lg: fontSize(32),
    xl: fontSize(40),
    xxl: fontSize(48),
};

/**
 * Typography Scale
 */
export const Typography = {
    // Display (very large text)
    display1: {
        fontSize: fontSize(40),
        lineHeight: lineHeight(40, 1.2),
        fontWeight: 'bold',
    },
    display2: {
        fontSize: fontSize(34),
        lineHeight: lineHeight(34, 1.2),
        fontWeight: 'bold',
    },

    // Headings
    h1: {
        fontSize: fontSize(28),
        lineHeight: lineHeight(28, 1.3),
        fontWeight: 'bold',
    },
    h2: {
        fontSize: fontSize(24),
        lineHeight: lineHeight(24, 1.3),
        fontWeight: 'bold',
    },
    h3: {
        fontSize: fontSize(20),
        lineHeight: lineHeight(20, 1.4),
        fontWeight: '600',
    },
    h4: {
        fontSize: fontSize(18),
        lineHeight: lineHeight(18, 1.4),
        fontWeight: '600',
    },
    h5: {
        fontSize: fontSize(16),
        lineHeight: lineHeight(16, 1.4),
        fontWeight: '600',
    },
    h6: {
        fontSize: fontSize(14),
        lineHeight: lineHeight(14, 1.4),
        fontWeight: '600',
    },

    // Body Text
    body1: {
        fontSize: fontSize(16),
        lineHeight: lineHeight(16, 1.5),
        fontWeight: 'normal',
    },
    body2: {
        fontSize: fontSize(14),
        lineHeight: lineHeight(14, 1.5),
        fontWeight: 'normal',
    },

    // Labels and Captions
    label: {
        fontSize: fontSize(14),
        lineHeight: lineHeight(14, 1.4),
        fontWeight: '500',
    },
    caption: {
        fontSize: fontSize(12),
        lineHeight: lineHeight(12, 1.4),
        fontWeight: 'normal',
    },
    overline: {
        fontSize: fontSize(10),
        lineHeight: lineHeight(10, 1.4),
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },

    // Button Text
    button: {
        fontSize: fontSize(16),
        lineHeight: lineHeight(16, 1.2),
        fontWeight: '600',
    },
    buttonSmall: {
        fontSize: fontSize(14),
        lineHeight: lineHeight(14, 1.2),
        fontWeight: '600',
    },
};

/**
 * Check if device is iOS
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Check if device is Android
 */
export const isAndroid = Platform.OS === 'android';

/**
 * Platform-specific padding (for safe area)
 */
export const platformPadding = {
    paddingTop: isIOS ? spacing(8) : spacing(4),
    paddingBottom: isIOS ? spacing(8) : spacing(4),
};
