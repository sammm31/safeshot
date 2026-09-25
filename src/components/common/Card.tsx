import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

export type CardVariant = 'elevated' | 'outlined' | 'dark' | 'tinted';

export interface CardProps {
  children?: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  padding?: keyof typeof spacing;
  radius?: keyof typeof borderRadius;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  onPress,
  padding = 'lg',
  radius = 'lg',
  style,
  testID,
}) => {
  const cardStyle: StyleProp<ViewStyle> = [
    styles.base,
    styles[`variant_${variant}`],
    {
      padding: spacing[padding],
      borderRadius: borderRadius[radius],
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={cardStyle}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} testID={testID}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  variant_elevated: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  variant_outlined: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  variant_dark: {
    backgroundColor: colors.navyPrimary,
    borderWidth: 1,
    borderColor: colors.navyBorder,
    ...shadows.card,
  },
  variant_tinted: {
    backgroundColor: colors.accentLight,
    borderWidth: 1,
    borderColor: 'rgba(2, 132, 199, 0.25)',
  },
});
