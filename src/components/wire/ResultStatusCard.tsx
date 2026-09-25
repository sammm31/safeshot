import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { WireInspectionResult } from '../../types/inspection';
import { formatDateTime, getStatusTheme } from '../../utils/formatters';
import { Badge } from '../common/Badge';

export interface ResultStatusCardProps {
  inspection: WireInspectionResult;
}

export const ResultStatusCard: React.FC<ResultStatusCardProps> = ({ inspection }) => {
  const { status, confidence, message, timestamp, details } = inspection;
  const statusTheme = getStatusTheme(status);

  return (
    <View style={[styles.container, { borderColor: statusTheme.borderColor }]}>
      {/* Status Header Banner */}
      <View style={[styles.headerBanner, { backgroundColor: statusTheme.bgColor }]}>
        <View style={[styles.iconCircle, { backgroundColor: statusTheme.color }]}>
          <Ionicons name={statusTheme.icon} size={28} color={colors.textInverse} />
        </View>

        <View style={styles.titleColumn}>
          <View style={styles.badgeRow}>
            <Text style={[styles.statusTitle, { color: statusTheme.color }]}>
              {statusTheme.label}
            </Text>
            <Badge type="DEMO" label="DEMO RESULT" size="sm" />
          </View>
          <Text style={styles.timestampText}>{formatDateTime(timestamp)}</Text>
        </View>
      </View>

      {/* Main Status Explanation */}
      <View style={styles.contentBody}>
        <Text style={styles.explanationText}>{message}</Text>

        {/* Confidence Meter Card */}
        <View style={styles.confidenceSection}>
          <View style={styles.confidenceRow}>
            <Text style={styles.confidenceLabel}>Inspection Confidence</Text>
            <Text style={[styles.confidenceValue, { color: statusTheme.color }]}>
              {confidence.toFixed(1)}%
            </Text>
          </View>

          {/* Meter Track */}
          <View style={styles.meterTrack}>
            <View
              style={[
                styles.meterFill,
                {
                  width: `${Math.min(100, Math.max(0, confidence))}%`,
                  backgroundColor: statusTheme.color,
                },
              ]}
            />
          </View>
        </View>

        {/* Technical Diagnostics Grid */}
        <View style={styles.diagnosticsContainer}>
          <Text style={styles.diagnosticsHeader}>Optical Diagnostics</Text>

          <View style={styles.diagnosticRow}>
            <View style={styles.diagnosticItem}>
              <Text style={styles.diagLabel}>Specimen Geometry</Text>
              <Text style={styles.diagValue}>{details.wireType}</Text>
            </View>
          </View>

          <View style={styles.diagnosticRow}>
            <View style={styles.diagnosticItem}>
              <Text style={styles.diagLabel}>Luminance Profile</Text>
              <Text style={styles.diagValue}>{details.insulationIntegrity}</Text>
            </View>
          </View>

          <View style={styles.diagnosticRow}>
            <View style={styles.diagnosticItem}>
              <Text style={styles.diagLabel}>Brightness Delta Analysis</Text>
              <Text style={[styles.diagValue, { color: statusTheme.color }]}>
                {details.defectDetected}
              </Text>
            </View>
          </View>

          <View style={styles.recommendationBox}>
            <View style={styles.recHeaderRow}>
              <Ionicons name="information-circle-outline" size={16} color={colors.accent} />
              <Text style={styles.recTitle}>Recommendation</Text>
            </View>
            <Text style={styles.recText}>{details.recommendation}</Text>
          </View>
        </View>

        {/* Demo Disclaimer Notice */}
        <View style={styles.demoNoticeCard}>
          <Ionicons name="construct-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.demoNoticeText}>
            Demo result — ML analysis will be connected later.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#0B132B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  titleColumn: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusTitle: {
    ...typography.h2,
    fontSize: 20,
    letterSpacing: 0.5,
  },
  timestampText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  contentBody: {
    padding: spacing.lg,
  },
  explanationText: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '500',
    lineHeight: 24,
  },
  confidenceSection: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  confidenceLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  confidenceValue: {
    fontFamily: typography.mono.fontFamily,
    fontSize: 18,
    fontWeight: '700',
  },
  meterTrack: {
    height: 8,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 4,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: 4,
  },
  diagnosticsContainer: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  diagnosticsHeader: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  diagnosticRow: {
    marginBottom: spacing.sm,
  },
  diagnosticItem: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  diagLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: 2,
  },
  diagValue: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  recommendationBox: {
    backgroundColor: colors.accentLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(2, 132, 199, 0.25)',
  },
  recHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  recTitle: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '700',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  recText: {
    ...typography.bodySmall,
    color: colors.navyPrimary,
    lineHeight: 18,
  },
  demoNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoNoticeText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flex: 1,
    fontSize: 12,
  },
});
