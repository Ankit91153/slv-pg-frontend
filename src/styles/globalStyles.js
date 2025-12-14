/**
 * Global Reusable Styles
 * Common style patterns used across the app
 */

import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius } from './responsive';

/**
 * Creates global styles based on current theme
 * @param {Object} theme - Current theme object
 * @returns {Object} StyleSheet object
 */
export const createGlobalStyles = (theme) => {
    const { colors, typography, shadows } = theme;

    return StyleSheet.create({
        // ===== FLEX UTILITIES =====
        flex1: {
            flex: 1,
        },
        flexRow: {
            flexDirection: 'row',
        },
        flexColumn: {
            flexDirection: 'column',
        },
        flexCenter: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        flexStart: {
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
        },
        flexEnd: {
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
        },
        flexBetween: {
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        flexAround: {
            justifyContent: 'space-around',
            alignItems: 'center',
        },
        flexWrap: {
            flexWrap: 'wrap',
        },
        alignCenter: {
            alignItems: 'center',
        },
        alignStart: {
            alignItems: 'flex-start',
        },
        alignEnd: {
            alignItems: 'flex-end',
        },
        justifyCenter: {
            justifyContent: 'center',
        },
        justifyStart: {
            justifyContent: 'flex-start',
        },
        justifyEnd: {
            justifyContent: 'flex-end',
        },
        justifyBetween: {
            justifyContent: 'space-between',
        },

        // ===== CONTAINERS =====
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        containerPadded: {
            flex: 1,
            backgroundColor: colors.background,
            padding: Spacing.lg,
        },
        containerCentered: {
            flex: 1,
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            padding: Spacing.lg,
        },
        scrollContainer: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContentContainer: {
            padding: Spacing.lg,
        },
        safeAreaContainer: {
            flex: 1,
            backgroundColor: colors.background,
        },

        // ===== CARDS =====
        card: {
            backgroundColor: colors.card,
            borderRadius: BorderRadius.md,
            padding: Spacing.lg,
            ...shadows.md,
        },
        cardSmall: {
            backgroundColor: colors.card,
            borderRadius: BorderRadius.sm,
            padding: Spacing.md,
            ...shadows.sm,
        },
        cardLarge: {
            backgroundColor: colors.card,
            borderRadius: BorderRadius.lg,
            padding: Spacing.xl,
            ...shadows.lg,
        },
        cardFlat: {
            backgroundColor: colors.card,
            borderRadius: BorderRadius.md,
            padding: Spacing.lg,
            borderWidth: 1,
            borderColor: colors.border,
        },

        // ===== BUTTONS =====
        buttonPrimary: {
            backgroundColor: colors.primary,
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.xl,
            borderRadius: BorderRadius.sm,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 48,
            ...shadows.sm,
        },
        buttonPrimaryText: {
            ...typography.button,
            color: colors.textInverse,
        },
        buttonSecondary: {
            backgroundColor: colors.secondary,
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.xl,
            borderRadius: BorderRadius.sm,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 48,
            ...shadows.sm,
        },
        buttonSecondaryText: {
            ...typography.button,
            color: colors.textInverse,
        },
        buttonOutlined: {
            backgroundColor: 'transparent',
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.xl,
            borderRadius: BorderRadius.sm,
            borderWidth: 1.5,
            borderColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 48,
        },
        buttonOutlinedText: {
            ...typography.button,
            color: colors.primary,
        },
        buttonText: {
            backgroundColor: 'transparent',
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.md,
            alignItems: 'center',
            justifyContent: 'center',
        },
        buttonTextText: {
            ...typography.button,
            color: colors.primary,
        },
        buttonDisabled: {
            backgroundColor: colors.textDisabled,
            opacity: 0.6,
        },
        buttonDisabledText: {
            ...typography.button,
            color: colors.textSecondary,
        },

        // ===== INPUTS =====
        input: {
            backgroundColor: colors.inputBackground,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            borderRadius: BorderRadius.sm,
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.lg,
            ...typography.body1,
            color: colors.text,
            minHeight: 48,
        },
        inputFocused: {
            borderColor: colors.inputBorderFocused,
            borderWidth: 2,
        },
        inputError: {
            borderColor: colors.inputBorderError,
            borderWidth: 2,
        },
        inputMultiline: {
            backgroundColor: colors.inputBackground,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            borderRadius: BorderRadius.sm,
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.lg,
            ...typography.body1,
            color: colors.text,
            minHeight: 100,
            textAlignVertical: 'top',
        },
        inputLabel: {
            ...typography.label,
            color: colors.textSecondary,
            marginBottom: Spacing.xs,
        },
        inputErrorText: {
            ...typography.caption,
            color: colors.error,
            marginTop: Spacing.xs,
        },

        // ===== TYPOGRAPHY =====
        textDisplay1: {
            ...typography.display1,
            color: colors.text,
        },
        textDisplay2: {
            ...typography.display2,
            color: colors.text,
        },
        textH1: {
            ...typography.h1,
            color: colors.text,
        },
        textH2: {
            ...typography.h2,
            color: colors.text,
        },
        textH3: {
            ...typography.h3,
            color: colors.text,
        },
        textH4: {
            ...typography.h4,
            color: colors.text,
        },
        textH5: {
            ...typography.h5,
            color: colors.text,
        },
        textH6: {
            ...typography.h6,
            color: colors.text,
        },
        textBody1: {
            ...typography.body1,
            color: colors.text,
        },
        textBody2: {
            ...typography.body2,
            color: colors.text,
        },
        textLabel: {
            ...typography.label,
            color: colors.textSecondary,
        },
        textCaption: {
            ...typography.caption,
            color: colors.textSecondary,
        },
        textOverline: {
            ...typography.overline,
            color: colors.textSecondary,
        },
        textPrimary: {
            color: colors.text,
        },
        textSecondary: {
            color: colors.textSecondary,
        },
        textTertiary: {
            color: colors.textTertiary,
        },
        textDisabled: {
            color: colors.textDisabled,
        },
        textInverse: {
            color: colors.textInverse,
        },
        textSuccess: {
            color: colors.success,
        },
        textError: {
            color: colors.error,
        },
        textWarning: {
            color: colors.warning,
        },
        textInfo: {
            color: colors.info,
        },
        textCenter: {
            textAlign: 'center',
        },
        textLeft: {
            textAlign: 'left',
        },
        textRight: {
            textAlign: 'right',
        },
        textBold: {
            fontWeight: 'bold',
        },
        textSemiBold: {
            fontWeight: '600',
        },
        textMedium: {
            fontWeight: '500',
        },

        // ===== LINKS =====
        link: {
            ...typography.body1,
            color: colors.primary,
        },
        linkUnderline: {
            ...typography.body1,
            color: colors.primary,
            textDecorationLine: 'underline',
        },

        // ===== DIVIDERS =====
        divider: {
            height: 1,
            backgroundColor: colors.border,
            marginVertical: Spacing.md,
        },
        dividerVertical: {
            width: 1,
            backgroundColor: colors.border,
            marginHorizontal: Spacing.md,
        },

        // ===== BADGES =====
        badge: {
            paddingHorizontal: Spacing.sm,
            paddingVertical: Spacing.xs,
            borderRadius: BorderRadius.xs,
            alignSelf: 'flex-start',
        },
        badgeSuccess: {
            backgroundColor: colors.success + '20',
        },
        badgeSuccessText: {
            ...typography.caption,
            color: colors.success,
            fontWeight: '600',
        },
        badgeError: {
            backgroundColor: colors.error + '20',
        },
        badgeErrorText: {
            ...typography.caption,
            color: colors.error,
            fontWeight: '600',
        },
        badgeWarning: {
            backgroundColor: colors.warning + '20',
        },
        badgeWarningText: {
            ...typography.caption,
            color: colors.warning,
            fontWeight: '600',
        },
        badgeInfo: {
            backgroundColor: colors.info + '20',
        },
        badgeInfoText: {
            ...typography.caption,
            color: colors.info,
            fontWeight: '600',
        },

        // ===== SPACING UTILITIES =====
        mt0: { marginTop: 0 },
        mt1: { marginTop: Spacing.xs },
        mt2: { marginTop: Spacing.sm },
        mt3: { marginTop: Spacing.md },
        mt4: { marginTop: Spacing.lg },
        mt5: { marginTop: Spacing.xl },

        mb0: { marginBottom: 0 },
        mb1: { marginBottom: Spacing.xs },
        mb2: { marginBottom: Spacing.sm },
        mb3: { marginBottom: Spacing.md },
        mb4: { marginBottom: Spacing.lg },
        mb5: { marginBottom: Spacing.xl },

        ml0: { marginLeft: 0 },
        ml1: { marginLeft: Spacing.xs },
        ml2: { marginLeft: Spacing.sm },
        ml3: { marginLeft: Spacing.md },
        ml4: { marginLeft: Spacing.lg },
        ml5: { marginLeft: Spacing.xl },

        mr0: { marginRight: 0 },
        mr1: { marginRight: Spacing.xs },
        mr2: { marginRight: Spacing.sm },
        mr3: { marginRight: Spacing.md },
        mr4: { marginRight: Spacing.lg },
        mr5: { marginRight: Spacing.xl },

        pt0: { paddingTop: 0 },
        pt1: { paddingTop: Spacing.xs },
        pt2: { paddingTop: Spacing.sm },
        pt3: { paddingTop: Spacing.md },
        pt4: { paddingTop: Spacing.lg },
        pt5: { paddingTop: Spacing.xl },

        pb0: { paddingBottom: 0 },
        pb1: { paddingBottom: Spacing.xs },
        pb2: { paddingBottom: Spacing.sm },
        pb3: { paddingBottom: Spacing.md },
        pb4: { paddingBottom: Spacing.lg },
        pb5: { paddingBottom: Spacing.xl },

        pl0: { paddingLeft: 0 },
        pl1: { paddingLeft: Spacing.xs },
        pl2: { paddingLeft: Spacing.sm },
        pl3: { paddingLeft: Spacing.md },
        pl4: { paddingLeft: Spacing.lg },
        pl5: { paddingLeft: Spacing.xl },

        pr0: { paddingRight: 0 },
        pr1: { paddingRight: Spacing.xs },
        pr2: { paddingRight: Spacing.sm },
        pr3: { paddingRight: Spacing.md },
        pr4: { paddingRight: Spacing.lg },
        pr5: { paddingRight: Spacing.xl },
    });
};
