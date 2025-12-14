/**
 * Profile Screen Styles
 */

import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from '../responsive';

export const createProfileStyles = (theme) => {
    const { colors, typography, shadows } = theme;

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: {
            padding: Spacing.xl,
        },
        header: {
            alignItems: 'center',
            marginBottom: Spacing.xxl,
            paddingVertical: Spacing.xl,
        },
        title: {
            ...typography.h1,
            color: colors.text,
            marginBottom: Spacing.md,
            textAlign: 'center',
        },
        subtitle: {
            ...typography.body1,
            color: colors.textSecondary,
            textAlign: 'center',
        },
        themeToggleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.card,
            padding: Spacing.lg,
            borderRadius: BorderRadius.md,
            marginBottom: Spacing.lg,
            ...shadows.sm,
        },
        themeToggleLabel: {
            ...typography.body1,
            color: colors.text,
            fontWeight: '600',
        },
        infoCard: {
            backgroundColor: colors.card,
            padding: Spacing.lg,
            borderRadius: BorderRadius.md,
            marginBottom: Spacing.md,
            ...shadows.sm,
        },
        infoLabel: {
            ...typography.label,
            color: colors.textSecondary,
            marginBottom: Spacing.xs,
        },
        infoValue: {
            ...typography.body1,
            color: colors.text,
            fontWeight: '500',
        },
        logoutButton: {
            backgroundColor: colors.error,
            paddingVertical: Spacing.lg,
            borderRadius: BorderRadius.sm,
            marginTop: Spacing.xl,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 50,
            ...shadows.sm,
        },
        logoutButtonText: {
            ...typography.button,
            color: colors.textInverse,
        },
    });
};
