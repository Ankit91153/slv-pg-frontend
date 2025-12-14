/**
 * OTP Screen Styles
 */

import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from '../responsive';

export const createOTPStyles = (theme) => {
    const { colors, typography, shadows } = theme;

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            justifyContent: 'center',
            padding: Spacing.xl,
        },
        title: {
            ...typography.h1,
            color: colors.text,
            marginBottom: Spacing.lg,
            textAlign: 'center',
        },
        subtitle: {
            ...typography.body1,
            color: colors.textSecondary,
            marginBottom: Spacing.xxl,
            textAlign: 'center',
        },
        form: {
            width: '100%',
        },
        input: {
            backgroundColor: colors.inputBackground,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            borderRadius: BorderRadius.sm,
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.lg,
            ...typography.body1,
            color: colors.text,
            marginBottom: Spacing.sm,
            textAlign: 'center',
            letterSpacing: 4,
        },
        inputError: {
            borderColor: colors.inputBorderError,
            borderWidth: 2,
        },
        errorText: {
            ...typography.caption,
            color: colors.error,
            marginBottom: Spacing.sm,
            textAlign: 'center',
        },
        button: {
            backgroundColor: colors.primary,
            paddingVertical: Spacing.lg,
            borderRadius: BorderRadius.sm,
            marginTop: Spacing.lg,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 50,
            ...shadows.sm,
        },
        buttonDisabled: {
            backgroundColor: colors.textDisabled,
            opacity: 0.6,
        },
        buttonText: {
            ...typography.button,
            color: colors.textInverse,
        },
        link: {
            ...typography.body2,
            color: colors.primary,
            textAlign: 'center',
            marginTop: Spacing.lg,
        },
    });
};
