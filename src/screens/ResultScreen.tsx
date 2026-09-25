import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { RootStackParamList } from '../navigation/types';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatDateTime, getStatusTheme } from '../utils/formatters';
import { historyStore } from '../services/historyStore';

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;
type ResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Result'>;

export const ResultScreen: React.FC = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const navigation = useNavigation<ResultScreenNavigationProp>();

  const { inspection } = route.params;
  const [isSaved, setIsSaved] = useState(inspection.isSaved || false);
  const statusTheme = getStatusTheme(inspection.status);

  const handleInspectAnother = () => {
    navigation.navigate('MainTabs', {
      screen: 'VialCheckTab',
    });
  };

  const handleViewRecords = () => {
    navigation.navigate('MainTabs', {
      screen: 'RecordsTab',
    });
  };

  const handleSaveReport = () => {
    historyStore.markSaved(inspection.id);
    setIsSaved(true);
    Alert.alert(
      'Report Saved to Records',
      `Inspection report #${inspection.id} has been securely archived in your local audit records.`,
      [
        { text: 'View in Records', onPress: handleViewRecords },
        { text: 'Done', style: 'cancel' },
      ]
    );
  };

  const handleShareReport = async () => {
    try {
      const batchDetails = inspection.vialBatch
        ? `Batch: ${inspection.vialBatch.batchNumber} (${inspection.vialBatch.vaccineName})\nExpiry: ${inspection.vialBatch.expiryDate}\n`
        : '';

      await Share.share({
        title: `Safe Shot Inspection Report: ${inspection.status}`,
        message: `SAFE SHOT INSPECTION REPORT\nReport ID: ${inspection.id}\nStatus: ${inspection.status}\nConfidence: ${inspection.confidence.toFixed(1)}%\nTimestamp: ${formatDateTime(inspection.timestamp)}\n${batchDetails}Recommendation: ${inspection.details.recommendation}\n\nNotice: Demo result — ML analysis will be connected later.`,
      });
    } catch (err) {
      console.warn('Share error:', err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Vial Inspection Report"
        subtitle={`Report ID: ${inspection.id}`}
        showBack
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShareReport}
            accessibilityLabel="Share report"
          >
            <Ionicons name="share-outline" size={20} color={colors.accent} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mandatory Transparency Banner */}
        <View style={styles.demoNoticeBanner}>
          <Ionicons name="information-circle-outline" size={18} color="#0369A1" />
          <Text style={styles.demoNoticeText}>
            Demo result — ML analysis will be connected later
          </Text>
        </View>

        {/* Primary Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: statusTheme.bgColor, borderColor: statusTheme.borderColor }]}>
          <View style={[styles.statusIconCircle, { backgroundColor: statusTheme.color }]}>
            <Ionicons name={statusTheme.icon} size={28} color={colors.textInverse} />
          </View>
          <View style={styles.statusTextCol}>
            <View style={styles.statusBadgeRow}>
              <Text style={[styles.statusTitle, { color: statusTheme.color }]}>
                {statusTheme.label}
              </Text>
              <Badge type="DEMO" label="SIMULATED CV" size="sm" />
            </View>
            <Text style={styles.statusDescription}>{statusTheme.description}</Text>
          </View>
        </View>

        {/* Captured Vial Image with HUD */}
        <View style={styles.imageCard}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: inspection.imageUri }}
              style={styles.analyzedImage}
              resizeMode="cover"
            />

            {/* Corner Alignment Reticles */}
            <View style={[styles.cornerMarker, styles.cmTL]} />
            <View style={[styles.cornerMarker, styles.cmTR]} />
            <View style={[styles.cornerMarker, styles.cmBL]} />
            <View style={[styles.cornerMarker, styles.cmBR]} />

            {/* Optical Tag Overlay */}
            <View style={styles.stampBadge}>
              <Ionicons name="scan-circle" size={14} color={colors.cyanVibrant} />
              <Text style={styles.stampText}>VVM CONCENTRIC ANALYSIS</Text>
            </View>
          </View>
        </View>

        {/* Confidence Meter Section */}
        <View style={styles.metricsCard}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Inspection Confidence</Text>
            <Text style={[styles.metricValue, { color: statusTheme.color }]}>
              {inspection.confidence.toFixed(1)}%
            </Text>
          </View>

          <View style={styles.meterTrack}>
            <View
              style={[
                styles.meterFill,
                {
                  width: `${Math.min(100, Math.max(0, inspection.confidence))}%`,
                  backgroundColor: statusTheme.color,
                },
              ]}
            />
          </View>

          <View style={styles.meterLabelsRow}>
            <Text style={styles.meterSubText}>Threshold: 85.0%</Text>
            <Text style={styles.meterSubText}>Status: {inspection.status}</Text>
          </View>
        </View>

        {/* Associated Batch Information (if available) */}
        {inspection.vialBatch && (
          <View style={styles.infoCard}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="medical-outline" size={18} color={colors.accent} />
              <Text style={styles.cardSectionTitle}>Batch Information</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Vaccine Name</Text>
              <Text style={styles.detailValue}>{inspection.vialBatch.vaccineName}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Batch Number</Text>
              <Text style={[styles.detailValue, styles.monoText]}>{inspection.vialBatch.batchNumber}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Expiration Date</Text>
              <Text style={styles.detailValue}>{inspection.vialBatch.expiryDate}</Text>
            </View>

            {inspection.vialBatch.manufacturer && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Manufacturer</Text>
                <Text style={styles.detailValue}>{inspection.vialBatch.manufacturer}</Text>
              </View>
            )}

            {inspection.vialBatch.storageTemp && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Storage Temp</Text>
                <Text style={styles.detailValue}>{inspection.vialBatch.storageTemp}</Text>
              </View>
            )}
          </View>
        )}

        {/* Optical Diagnostics */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="analytics-outline" size={18} color={colors.accent} />
            <Text style={styles.cardSectionTitle}>Optical Diagnostics</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Inspection Timestamp</Text>
            <Text style={styles.detailValue}>{formatDateTime(inspection.timestamp)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Luminance Profile</Text>
            <Text style={styles.detailValue}>{inspection.details.insulationIntegrity}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Defect Analysis</Text>
            <Text style={[styles.detailValue, { color: statusTheme.color }]}>
              {inspection.details.defectDetected}
            </Text>
          </View>

          {/* Recommendation Box */}
          <View style={styles.recommendationBox}>
            <View style={styles.recHeaderRow}>
              <Ionicons name="shield-checkmark-outline" size={16} color={colors.navyPrimary} />
              <Text style={styles.recHeading}>Recommendation</Text>
            </View>
            <Text style={styles.recBody}>{inspection.details.recommendation}</Text>
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.actionsSection}>
          <Button
            title={isSaved ? 'Report Saved' : 'Save Report to Records'}
            variant={isSaved ? 'secondary' : 'primary'}
            size="lg"
            fullWidth
            icon={
              <Ionicons
                name={isSaved ? 'checkmark-circle' : 'bookmark-outline'}
                size={20}
                color={isSaved ? colors.statusSafe : colors.textInverse}
              />
            }
            onPress={handleSaveReport}
            disabled={isSaved}
            style={styles.saveBtn}
          />

          <Button
            title="Inspect Another Vial"
            variant="secondary"
            size="md"
            fullWidth
            icon={<Ionicons name="camera-outline" size={18} color={colors.textPrimary} />}
            onPress={handleInspectAnother}
            style={styles.secondaryBtn}
          />

          <TouchableOpacity
            style={styles.textActionBtn}
            activeOpacity={0.7}
            onPress={handleViewRecords}
          >
            <Text style={styles.textActionLink}>View All Past Records &rarr;</Text>
          </TouchableOpacity>
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
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoNoticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  demoNoticeText: {
    ...typography.caption,
    fontWeight: '600',
    color: '#0369A1',
    marginLeft: spacing.xs,
    flex: 1,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  statusIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  statusTextCol: {
    flex: 1,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statusTitle: {
    ...typography.h2,
    fontSize: 22,
    fontWeight: '800',
  },
  statusDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  imageCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.card,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1.2,
    backgroundColor: colors.navyDark,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzedImage: {
    width: '100%',
    height: '100%',
  },
  cornerMarker: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: colors.cyanSoft,
  },
  cmTL: {
    top: 10,
    left: 10,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  cmTR: {
    top: 10,
    right: 10,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  cmBL: {
    bottom: 10,
    left: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  cmBR: {
    bottom: 10,
    right: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  stampBadge: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 13, 30, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  stampText: {
    ...typography.mono,
    fontSize: 10,
    color: colors.cyanSoft,
    fontWeight: '700',
    marginLeft: 5,
    letterSpacing: 0.5,
  },
  metricsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  metricLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  metricValue: {
    ...typography.monoLarge,
    fontSize: 18,
    fontWeight: '800',
  },
  meterTrack: {
    height: 10,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 4,
  },
  meterFill: {
    height: '100%',
    borderRadius: 5,
  },
  meterLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  meterSubText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceSubtle,
  },
  cardSectionTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  detailLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    flex: 1,
  },
  detailValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1.4,
    textAlign: 'right',
  },
  monoText: {
    ...typography.mono,
  },
  recommendationBox: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  recHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  recHeading: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.navyPrimary,
    marginLeft: 4,
  },
  recBody: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  actionsSection: {
    marginTop: spacing.sm,
  },
  saveBtn: {
    marginBottom: spacing.sm,
  },
  secondaryBtn: {
    marginBottom: spacing.md,
  },
  textActionBtn: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  textActionLink: {
    ...typography.bodySmall,
    color: colors.accent,
    fontWeight: '600',
  },
});
