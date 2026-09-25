import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { shadows } from '../../theme/shadows';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'dark' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  disabled,
  ...props
}) => {
  const containerStyles: StyleProp<ViewStyle> = [
    styles.base,
    styles[size],
    styles[`variant_${variant}`],
    fullWidth ? styles.fullWidth : null,
    disabled || loading ? styles.disabled : null,
    style,
  ];

  const textStyles: StyleProp<TextStyle> = [
    styles.text,
    styles[`text_${size}`],
    styles[`textVariant_${variant}`],
    disabled ? styles.textDisabled : null,
  ];

  const spinnerColor =
    variant === 'primary' || variant === 'dark' || variant === 'danger'
      ? colors.textInverse
      : colors.accent;

  return (
    <TouchableOpacity
      activeOpacity={0.78}
      disabled={disabled || loading}
      style={containerStyles}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.55,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing.xs,
  },
  iconRight: {
    marginLeft: spacing.xs,
  },
  text: {
    ...typography.button,
  },
  textDisabled: {
    color: colors.textMuted,
  },

  // Sizes
  sm: {
    height: 38,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  md: {
    height: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  lg: {
    height: 54,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
  },

  text_sm: {
    fontSize: 13,
  },
  text_md: {
    fontSize: 15,
  },
  text_lg: {
    fontSize: 16,
    fontWeight: '700',
  },

  // Variants
  variant_primary: {
    backgroundColor: colors.accent,
    ...shadows.subtle,
  },
  textVariant_primary: {
    color: colors.textInverse,
  },

  variant_dark: {
    backgroundColor: colors.navyPrimary,
    ...shadows.subtle,
  },
  textVariant_dark: {
    color: colors.textInverse,
  },

  variant_secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    ...shadows.subtle,
  },
  textVariant_secondary: {
    color: colors.textPrimary,
  },

  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  textVariant_outline: {
    color: colors.accent,
  },

  variant_danger: {
    backgroundColor: colors.statusDamaged,
  },
  textVariant_danger: {
    color: colors.textInverse,
  },

  variant_ghost: {
    backgroundColor: 'transparent',
  },
  textVariant_ghost: {
    color: colors.accent,
  },
});
