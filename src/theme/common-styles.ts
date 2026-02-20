import { StyleSheet } from 'react-native';

import type { AppTheme } from './theme';

export const createCommonStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.white,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xxl,
    },
    centerContainer: {
      flex: 1,
      backgroundColor: theme.colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    button: {
      height: 50,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: theme.spacing.md,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.white,
    },
    input: {
      height: 50,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.borderColor,
      paddingHorizontal: 15,
      marginVertical: theme.spacing.md,
      fontSize: theme.typography.body,
      backgroundColor: theme.colors.gray,
      color: theme.colors.darkGray,
    },
    text: {
      fontSize: theme.typography.body,
      color: theme.colors.darkGray,
    },
    heading: {
      fontSize: theme.typography.title,
      fontWeight: '700',
      color: theme.colors.black,
      marginVertical: theme.spacing.md,
    },
    subHeading: {
      fontSize: theme.typography.caption,
      color: theme.colors.mediumGray,
      marginVertical: 5,
    },
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    centerContent: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.lg,
    },
    card: {
      width: '100%',
      maxWidth: 520,
      padding: theme.spacing.xl,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  });
