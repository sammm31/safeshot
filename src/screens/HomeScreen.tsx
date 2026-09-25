import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { InspectionIllustration, WireIllustration } from '../components/wire/WireIllustration';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useHistory } from '../services/historyStore';
import { InspectionCard } from '../components/wire/InspectionCard';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'HomeTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const history = useHistory();
  const recentInspections = history.slice(0, 2);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Top Header */}
        <View style={styles.headerRow}>
          <View style={styles.brandGroup}>
            <View style={styles.logoBadge}>
              <Ionicons name="flash-outline" size={20} color={colors.cyanVibrant} />
            </View>
            <View>
              <View style={styles.brandTitleRow}>
                <Text style={styles.brandName}>Safe Shot</Text>
                <Badge type="DEMO" label="v1.0" size="sm" style={styles.versionBadge} />
              </View>
              <Text style={styles.brandSubtitle}>Smart Safety Inspection</Text>
            </View>
          </View>

          {/* About / Info shortcut button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('About')}
            style={styles.infoButton}
            accessibilityLabel="About Safe Shot"
          >
            <Ionicons name="information-circle-outline" size={22} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadgeRow}>
            <View style={styles.readyIndicator}>
              <View style={styles.readyDot} />
              <Text style={styles.readyText}>COMPUTER VISION READY</Text>
            </View>
          </View>

          <Text style={styles.heroHeadline}>Verify before you proceed.</Text>
          <Text style={styles.heroDescription}>
            Capture a clear image of the target area and let Safe Shot analyze its condition.
          </Text>

          {/* Technical Diagram Illustration */}
          <InspectionIllustration />

          {/* Actions */}
          <View style={styles.ctaGroup}>
            <Button
              title="Start Inspection"
              variant="primary"
              size="lg"
              fullWidth
              icon={<Ionicons name="camera-outline" size={20} color={colors.textInverse} />}
              onPress={() => navigation.navigate('CheckWireTab')}
            />

            <View style={styles.secondaryActionRow}>
              <Button
                title="View History"
                variant="secondary"
                size="md"
                style={styles.secondaryButton}
                icon={<Ionicons name="time-outline" size={18} color={colors.textPrimary} />}
                onPress={() => navigation.navigate('HistoryTab')}
              />
            </View>
          </View>
        </View>

        {/* How It Works Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>How it works</Text>
          <Text style={styles.sectionMeta}>3 simple steps</Text>
        </View>

        <View style={styles.stepsContainer}>
          {/* Step 1 */}
          <View style={styles.stepCard}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>01</Text>
            </View>
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>Capture</Text>
              <Text style={styles.stepDesc}>Take or select an inspection image</Text>
            </View>
          </View>

          {/* Step 2 */}
          <View style={styles.stepCard}>
            <View style={[styles.stepNumberBadge, styles.stepNumberBadgeAccent]}>
              <Text style={[styles.stepNumberText, styles.stepNumberTextAccent]}>02</Text>
            </View>
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>Inspect</Text>
              <Text style={styles.stepDesc}>Analyze optical condition</Text>
            </View>
          </View>

          {/* Step 3 */}
          <View style={styles.stepCard}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>03</Text>
            </View>
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>Result</Text>
              <Text style={styles.stepDesc}>View the safety status</Text>
            </View>
          </View>
        </View>

        {/* Safety & Lighting Guideline Card */}
        <Card variant="tinted" padding="md" style={styles.safetyCard}>
          <View style={styles.safetyRow}>
            <View style={styles.safetyIconContainer}>
              <Ionicons name="sunny-outline" size={20} color={colors.accent} />
            </View>
            <View style={styles.safetyTextGroup}>
              <Text style={styles.safetyTitle}>Inspection Quality Tip</Text>
              <Text style={styles.safetyBody}>
                Good lighting and a clear image improve inspection quality. Ensure sharp boundary contrast between the central square and outer circle region.
              </Text>
            </View>
          </View>
        </Card>

        {/* Recent Inspections Preview */}
        {recentInspections.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Recent Inspections</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('HistoryTab')}
              >
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            {recentInspections.map((item) => (
              <InspectionCard
                key={item.id}
                inspection={item}
                onPress={() => navigation.navigate('Result', { inspection: item })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: colors.navyPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    ...shadows.subtle,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandName: {
    ...typography.h3,
    color: colors.navyPrimary,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  versionBadge: {
    marginLeft: 6,
  },
  brandSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
  },
  infoButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  heroCard: {
    backgroundColor: colors.navyPrimary,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.navyBorder,
    ...shadows.floating,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  readyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 132, 199, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  readyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cyanVibrant,
    marginRight: 6,
  },
  readyText: {
    fontFamily: typography.mono.fontFamily,
    fontSize: 10,
    color: colors.cyanSoft,
    letterSpacing: 0.6,
  },
  heroHeadline: {
    ...typography.h1,
    color: colors.textInverse,
    fontSize: 26,
    lineHeight: 32,
    marginBottom: spacing.xs,
  },
  heroDescription: {
    ...typography.body,
    color: colors.textInverseSecondary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  ctaGroup: {
    marginTop: spacing.md,
  },
  secondaryActionRow: {
    marginTop: spacing.sm,
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: colors.navyMedium,
    borderColor: colors.navyBorder,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  sectionMeta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  stepsContainer: {
    flexDirection: 'column',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.subtle,
  },
  stepNumberBadge: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  stepNumberBadgeAccent: {
    backgroundColor: colors.accentLight,
    borderColor: 'rgba(2, 132, 199, 0.4)',
  },
  stepNumberText: {
    fontFamily: typography.mono.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  stepNumberTextAccent: {
    color: colors.accent,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  stepDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  safetyCard: {
    marginBottom: spacing.xl,
  },
  safetyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  safetyIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  safetyTextGroup: {
    flex: 1,
  },
  safetyTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.accentHover,
    marginBottom: 2,
  },
  safetyBody: {
    ...typography.bodySmall,
    color: colors.navyMedium,
    lineHeight: 18,
  },
  recentSection: {
    marginTop: spacing.xs,
  },
  seeAllText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
  },
});
