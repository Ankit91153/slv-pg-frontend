/**
 * Admin Dashboard Screen Styles
 */

import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from '../responsive';

export const createAdminDashboardStyles = (theme) => {
    const { colors, typography, shadows } = theme;

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            padding: Spacing.xl,
        },
        centerContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: Spacing.xl,
            marginTop: Spacing.md,
        },
        title: {
            ...typography.h1,
            color: colors.text,
        },
        refreshButton: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.card,
            justifyContent: 'center',
            alignItems: 'center',
            ...shadows.md,
        },
        statsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        statCard: {
            width: '48%',
            backgroundColor: colors.card,
            padding: Spacing.lg,
            borderRadius: BorderRadius.md,
            marginBottom: Spacing.lg,
            borderLeftWidth: 4,
            ...shadows.md,
        },
        statHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: Spacing.md,
        },
        iconContainer: {
            width: 44,
            height: 44,
            borderRadius: 22,
            justifyContent: 'center',
            alignItems: 'center',
        },
        statValue: {
            ...typography.display2,
            color: colors.text,
            marginBottom: Spacing.xs,
        },
        statLabel: {
            ...typography.body2,
            color: colors.textSecondary,
        },
    });
};
