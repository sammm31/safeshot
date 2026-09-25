import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  dark?: boolean;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  dark = false,
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        dark ? styles.darkContainer : styles.lightContainer,
        style,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.leftGroup}>
          {showBack && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onBack}
              style={[styles.backButton, dark ? styles.backButtonDark : styles.backButtonLight]}
              accessibilityLabel="Go back"
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={dark ? colors.textInverse : colors.navyPrimary}
              />
            </TouchableOpacity>
          )}
          <View style={styles.titleColumn}>
            <Text style={[styles.title, dark ? styles.titleDark : styles.titleLight]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, dark ? styles.subtitleDark : styles.subtitleLight]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {rightAction && <View style={styles.rightGroup}>{rightAction}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  lightContainer: {
    backgroundColor: colors.background,
  },
  darkContainer: {
    backgroundColor: colors.navyPrimary,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  backButtonLight: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  backButtonDark: {
    backgroundColor: colors.navyMedium,
    borderWidth: 1,
    borderColor: colors.navyBorder,
  },
  titleColumn: {
    flex: 1,
  },
  title: {
    ...typography.h2,
  },
  titleLight: {
    color: colors.textPrimary,
  },
  titleDark: {
    color: colors.textInverse,
  },
  subtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  subtitleLight: {
    color: colors.textSecondary,
  },
  subtitleDark: {
    color: colors.textInverseSecondary,
  },
  rightGroup: {
    marginLeft: spacing.sm,
  },
});
