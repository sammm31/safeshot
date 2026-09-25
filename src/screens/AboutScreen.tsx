import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Header } from '../components/common/Header';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const AboutScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="About WireCheck"
        subtitle="Version 1.0.0 (Demo Build)"
        showBack
        onBack={() => navigation.goBack()}
        rightAction={<Badge type="DEMO" label="PROTOTYPE" size="sm" />}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Hero Card */}
        <Card variant="dark" padding="xl" style={styles.heroCard}>
          <View style={styles.heroBrandRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="flash-outline" size={24} color={colors.cyanVibrant} />
            </View>
            <View>
              <Text style={styles.heroTitle}>WireCheck</Text>
              <Text style={styles.heroSub}>Intelligent Conductor Quality Verification</Text>
            </View>
          </View>

          <Text style={styles.heroLeadText}>
            WireCheck is a mobile inspection application designed to assist with wire-condition checking using image analysis.
          </Text>
        </Card>

        {/* Clear Mandatory Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <View style={styles.disclaimerHeaderRow}>
            <Ionicons name="shield-half-outline" size={20} color={colors.statusBorderline} />
            <Text style={styles.disclaimerTitle}>Safety Disclaimer</Text>
          </View>
          <Text style={styles.disclaimerText}>
            WireCheck is an assistive inspection tool and should not replace professional electrical inspection. Always de-energize and verify zero electrical potential using a calibrated multimeter before handling physical conductors.
          </Text>
        </View>

        {/* Section 1: How it Works */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>How it works</Text>

          <Card variant="elevated" padding="lg" style={styles.infoCard}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="shapes-outline" size={20} color={colors.accent} />
              </View>
              <View style={styles.featureBody}>
                <Text style={styles.featureTitle}>1. Geometric Region Ingestion</Text>
                <Text style={styles.featureDesc}>
                  Identifies a large outer circle representing the inspection area, and a concentric inner square at its center with sharp flat boundaries.
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="contrast-outline" size={20} color={colors.accent} />
              </View>
              <View style={styles.featureBody}>
                <Text style={styles.featureTitle}>2. Photometric Gradient Extraction</Text>
                <Text style={styles.featureDesc}>
                  Measures the luminance relationship between the inner square and outer circle under consistent geometry.
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="analytics-outline" size={20} color={colors.accent} />
              </View>
              <View style={styles.featureBody}>
                <Text style={styles.featureTitle}>3. Brightness-Based Classification</Text>
                <Text style={styles.featureDesc}>
                  SAFE when inner square is clearly lighter than outer circle. BORDERLINE when brightness is approximately the same. DAMAGED when inner square is same or darker than circle.
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Section 2: Inspection Guidance */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Classification Rules</Text>

          <Card variant="elevated" padding="lg" style={styles.infoCard}>
            <View style={styles.guidelineRow}>
              <Ionicons name="checkmark-circle-outline" size={18} color={colors.statusSafe} />
              <View style={styles.guidelineContent}>
                <Text style={styles.guidelineTitle}>SAFE Condition</Text>
                <Text style={styles.guidelineDesc}>
                  Inner square must be clearly LIGHTER than the outer circle (positive luminance gradient).
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.guidelineRow}>
              <Ionicons name="warning-outline" size={18} color={colors.statusBorderline} />
              <View style={styles.guidelineContent}>
                <Text style={styles.guidelineTitle}>BORDERLINE Condition</Text>
                <Text style={styles.guidelineDesc}>
                  Inner square has approximately the SAME brightness/color as the outer circle (equi-luminance band).
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.guidelineRow}>
              <Ionicons name="alert-circle-outline" size={18} color={colors.statusDamaged} />
              <View style={styles.guidelineContent}>
                <Text style={styles.guidelineTitle}>DAMAGED / UNSAFE Condition</Text>
                <Text style={styles.guidelineDesc}>
                  Inner square is the SAME or DARKER than the outer circle (inverted contrast or deficit).
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Section 3: About the Project */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>About the project</Text>

          <Card variant="elevated" padding="lg" style={styles.infoCard}>
            <Text style={styles.projectText}>
              WireCheck is an engineering prototype created for electrical technicians, safety auditors, and maintenance teams.
            </Text>

            <View style={styles.techStackContainer}>
              <Text style={styles.techStackTitle}>Architecture Roadmap</Text>
              <View style={styles.pipelineBox}>
                <Text style={styles.pipelineNode}>Mobile App (Expo / React Native)</Text>
                <Ionicons name="arrow-down" size={14} color={colors.accent} />
                <Text style={styles.pipelineNode}>Secure Cloud Inspection API Gateway</Text>
                <Ionicons name="arrow-down" size={14} color={colors.accent} />
                <Text style={styles.pipelineNode}>Computer Vision ML Model (YOLOv8 / ResNet)</Text>
                <Ionicons name="arrow-down" size={14} color={colors.accent} />
                <Text style={styles.pipelineNode}>Real-time Diagnostic Report (SAFE / BORDERLINE / DAMAGED)</Text>
              </View>
            </View>

            <View style={styles.metaSpecsRow}>
              <View style={styles.specColumn}>
                <Text style={styles.specLabel}>Status</Text>
                <Text style={styles.specValue}>Mock Service Mode</Text>
              </View>
              <View style={styles.specColumn}>
                <Text style={styles.specLabel}>Target Accuracy</Text>
                <Text style={styles.specValue}>&gt; 96.5%</Text>
              </View>
            </View>
          </Card>
        </View>
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
    paddingBottom: spacing.xxxl,
  },
  heroCard: {
    marginBottom: spacing.lg,
  },
  heroBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.navySurface,
    borderWidth: 1,
    borderColor: colors.navyBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.textInverse,
    fontSize: 22,
  },
  heroSub: {
    ...typography.caption,
    color: colors.cyanSoft,
    marginTop: 2,
  },
  heroLeadText: {
    ...typography.body,
    color: colors.textInverseSecondary,
    lineHeight: 22,
  },
  disclaimerContainer: {
    backgroundColor: colors.statusBorderlineBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.statusBorderlineBorder,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  disclaimerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  disclaimerTitle: {
    ...typography.h3,
    fontSize: 15,
    color: colors.statusBorderline,
    marginLeft: spacing.xs,
  },
  disclaimerText: {
    ...typography.bodySmall,
    color: colors.navyPrimary,
    lineHeight: 20,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeading: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.surface,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  featureBody: {
    flex: 1,
  },
  featureTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  featureDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  guidelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  guidelineContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  guidelineTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  guidelineDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  projectText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  techStackContainer: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  techStackTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  pipelineBox: {
    alignItems: 'center',
    gap: 4,
  },
  pipelineNode: {
    fontFamily: typography.mono.fontFamily,
    fontSize: 11,
    color: colors.accentHover,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    textAlign: 'center',
    width: '100%',
  },
  metaSpecsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
  },
  specColumn: {
    flex: 1,
  },
  specLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  specValue: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
});
