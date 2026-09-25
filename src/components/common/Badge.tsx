import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { InspectionStatus, WireStatus } from '../../types/inspection';
import { getStatusTheme } from '../../utils/formatters';

export type BadgeType = InspectionStatus | 'DEMO' | 'INFO' | 'NEUTRAL';

export interface BadgeProps {
  type?: BadgeType;
  label?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  type = 'NEUTRAL',
  label,
  icon,
  size = 'md',
  style,
  textStyle,
}) => {
  let bgColor = colors.surfaceSubtle;
  let textColor = colors.textSecondary;
  let borderColor = colors.border;
  let defaultLabel = label;

  if (type === 'SAFE' || type === 'BORDERLINE' || type === 'DAMAGED' || type === 'DISCARD') {
    const theme = getStatusTheme(type);
    bgColor = theme.bgColor;
    textColor = theme.color;
    borderColor = theme.borderColor;
    if (!defaultLabel) defaultLabel = theme.label;
  } else if (type === 'DEMO') {
    bgColor = 'rgba(2, 132, 199, 0.12)';
    textColor = colors.accent;
    borderColor = 'rgba(2, 132, 199, 0.25)';
    if (!defaultLabel) defaultLabel = 'DEMO MODE';
  } else if (type === 'INFO') {
    bgColor = colors.accentLight;
    textColor = colors.accent;
    borderColor = colors.accent;
  }

  return (
    <View
      style={[
        styles.badge,
        styles[`size_${size}`],
        { backgroundColor: bgColor, borderColor },
        style,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[
          styles.text,
          styles[`text_${size}`],
          { color: textColor },
          textStyle,
        ]}
      >
        {defaultLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: borderRadius.full,
  },
  iconContainer: {
    marginRight: 4,
  },
  text: {
    ...typography.tag,
  },
  size_sm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  size_md: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  size_lg: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  text_sm: {
    fontSize: 10,
  },
  text_md: {
    fontSize: 11,
  },
  text_lg: {
    fontSize: 13,
  },
});
