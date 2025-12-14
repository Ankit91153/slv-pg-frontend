/**
 * Common Admin Screen Styles
 * Shared styles across admin service screens (Floors, Rooms, Beds, Bookings, RoomTypes)
 */

import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from '../responsive';

export const createCommonAdminStyles = (theme) => {
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
        },
        title: {
            ...typography.h2,
            color: colors.text,
        },
        headerActions: {
            flexDirection: 'row',
            gap: Spacing.sm,
        },
        addButton: {
            backgroundColor: colors.primary,
            paddingHorizontal: Spacing.lg,
            paddingVertical: Spacing.md,
            borderRadius: BorderRadius.sm,
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.xs,
            ...shadows.sm,
        },
        addButtonText: {
            ...typography.button,
            color: colors.textInverse,
        },
        listContainer: {
            paddingBottom: Spacing.xl,
        },
        itemCard: {
            backgroundColor: colors.card,
            padding: Spacing.lg,
            borderRadius: BorderRadius.md,
            marginBottom: Spacing.md,
            ...shadows.md,
        },
        itemHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: Spacing.sm,
        },
        itemTitle: {
            ...typography.h4,
            color: colors.text,
            flex: 1,
            marginRight: Spacing.md,
        },
        itemActions: {
            flexDirection: 'row',
            gap: Spacing.sm,
        },
        itemInfo: {
            marginTop: Spacing.sm,
        },
        itemInfoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Spacing.xs,
        },
        itemLabel: {
            ...typography.body2,
            color: colors.textSecondary,
            marginRight: Spacing.xs,
        },
        itemValue: {
            ...typography.body2,
            color: colors.text,
            fontWeight: '500',
        },
        badge: {
            paddingHorizontal: Spacing.sm,
            paddingVertical: Spacing.xs,
            borderRadius: BorderRadius.xs,
            alignSelf: 'flex-start',
            marginTop: Spacing.xs,
        },
        badgeText: {
            ...typography.caption,
            fontWeight: '600',
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: Spacing.huge,
        },
        emptyText: {
            ...typography.body1,
            color: colors.textSecondary,
            marginTop: Spacing.lg,
            textAlign: 'center',
        },
        iconButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.card,
            justifyContent: 'center',
            alignItems: 'center',
            ...shadows.sm,
        },
        deleteButton: {
            backgroundColor: colors.error + '10',
        },
        editButton: {
            backgroundColor: colors.primary + '10',
        },
    });
};
