/**
 * Tenant Dashboard Screen Styles
 */

import { StyleSheet } from 'react-native';
import { Spacing } from '../responsive';

export const createTenantDashboardStyles = (theme) => {
    const { colors, typography } = theme;

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
            marginBottom: Spacing.xl,
            textAlign: 'center',
        },
        text: {
            ...typography.body1,
            color: colors.textSecondary,
            textAlign: 'center',
        },
    });
};
