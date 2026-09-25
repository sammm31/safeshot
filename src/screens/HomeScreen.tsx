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
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useHistory, useInspectionStats } from '../services/historyStore';
import { useInventory } from '../services/inventoryStore';
import { useAuth } from '../services/authStore';
import { InspectionCard } from '../components/wire/InspectionCard';
import { InspectionIllustration } from '../components/wire/WireIllustration';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'HomeTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const history = useHistory();
  const stats = useInspectionStats();
  const { expiringSoonBatches } = useInventory();

  const recentInspections = history.slice(0, 3);
  const expiringCount = expiringSoonBatches.length;

  const navigateToVialCheck = () => {
    navigation.navigate('MainTabs', { screen: 'VialCheckTab' });
  };

  const navigateToRecords = () => {
    navigation.navigate('MainTabs', { screen: 'RecordsTab' });
  };

  const navigateToInventory = () => {
    navigation.navigate('Inventory');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Row with User Info */}
        <View style={styles.topHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.greetingText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'Healthcare Technician'}</Text>
            <View style={styles.metaRow}>
              <View style={styles.empChip}>
                <Ionicons name="card-outline" size={12} color={colors.accent} />
                <Text style={styles.empText}>{user?.employeeId || 'EMP-92041'}</Text>
              </View>
              <Text style={styles.facilityDot}>•</Text>
              <Text style={styles.facilityText} numberOfLines={1}>
                {user?.department || 'Cold Chain Unit'}
              </Text>
            </View>
          </View>

          {/* Shortcut icon buttons */}
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconBtn}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('About')}
              accessibilityLabel="About Safe Shot"
            >
              <Ionicons name="information-circle-outline" size={22} color={colors.navyPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconBtn, styles.profileBtn]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Profile')}
              accessibilityLabel="View profile"
            >
              <Text style={styles.avatarInitials}>{user?.avatarInitials || 'SH'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Expiring-Soon Inventory Alert Banner (if applicable) */}
        {expiringCount > 0 && (
          <TouchableOpacity
            style={styles.alertBanner}
            activeOpacity={0.8}
            onPress={navigateToInventory}
          >
            <View style={styles.alertIconWrapper}>
              <Ionicons name="alert-circle" size={22} color="#B45309" />
            </View>
            <View style={styles.alertContent}>
              <View style={styles.alertTitleRow}>
                <Text style={styles.alertTitle}>Cold-Chain Inventory Alert</Text>
                <Badge type="BORDERLINE" label={`${expiringCount} CRITICAL`} size="sm" />
              </View>
              <Text style={styles.alertSub}>
                {expiringCount} vaccine batch{expiringCount > 1 ? 'es are' : ' is'} expiring soon or low in stock. Tap to inspect.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B45309" />
          </TouchableOpacity>
        )}

        {/* 4 Summary Stat Cards */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionHeading}>Inspection Summary</Text>

          <View style={styles.statsGrid}>
            {/* Total Card */}
            <View style={[styles.statCard, styles.statCardTotal]}>
              <View style={styles.statHeader}>
                <Ionicons name="scan-outline" size={18} color={colors.accent} />
                <Text style={styles.statLabel}>Total Checks</Text>
              </View>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statSub}>All logged tests</Text>
            </View>

            {/* Safe Card */}
            <View style={[styles.statCard, styles.statCardSafe]}>
              <View style={styles.statHeader}>
                <Ionicons name="checkmark-circle-outline" size={18} color={colors.statusSafe} />
                <Text style={[styles.statLabel, { color: colors.statusSafe }]}>Safe</Text>
              </View>
              <Text style={[styles.statNumber, { color: colors.statusSafe }]}>{stats.safe}</Text>
              <Text style={styles.statSub}>Cleared for use</Text>
            </View>

            {/* Borderline Card */}
            <View style={[styles.statCard, styles.statCardBorderline]}>
              <View style={styles.statHeader}>
                <Ionicons name="warning-outline" size={18} color={colors.statusBorderline} />
                <Text style={[styles.statLabel, { color: colors.statusBorderline }]}>Borderline</Text>
              </View>
              <Text style={[styles.statNumber, { color: colors.statusBorderline }]}>{stats.borderline}</Text>
              <Text style={styles.statSub}>Needs recheck</Text>
            </View>

            {/* Discard Card */}
            <View style={[styles.statCard, styles.statCardDiscard]}>
              <View style={styles.statHeader}>
                <Ionicons name="close-circle-outline" size={18} color={colors.statusDiscard} />
                <Text style={[styles.statLabel, { color: colors.statusDiscard }]}>Discard</Text>
              </View>
              <Text style={[styles.statNumber, { color: colors.statusDiscard }]}>{stats.discard}</Text>
              <Text style={styles.statSub}>Heat damaged</Text>
            </View>
          </View>
        </View>

        {/* Large Primary Action: Vial Check Hero Card */}
        <View style={styles.heroSection}>
          <View style={styles.heroCard}>
            <View style={styles.heroBadgeRow}>
              <View style={styles.readyIndicator}>
                <View style={styles.readyDot} />
                <Text style={styles.readyText}>OPTICAL VVM AI READY</Text>
              </View>
              <Badge type="INFO" label="RAPID CHECK" size="sm" />
            </View>

            <Text style={styles.heroHeadline}>Smart Vial Safety Check</Text>
            <Text style={styles.heroDescription}>
              Point camera at the vial cap or select from gallery. Safe Shot detects the concentric circle-and-square VVM to verify vaccine viability.
            </Text>

            {/* Concentric Inspection Graphic */}
            <InspectionIllustration />

            {/* Direct Action Button */}
            <Button
              title="Launch Vial Check"
              variant="primary"
              size="lg"
              fullWidth
              icon={<Ionicons name="camera-outline" size={22} color={colors.textInverse} />}
              onPress={navigateToVialCheck}
              style={styles.vialCheckCta}
            />
          </View>
        </View>

        {/* Quick Action Hub */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionHeading}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.quickActionCard}
              activeOpacity={0.75}
              onPress={navigateToInventory}
            >
              <View style={[styles.quickActionIconBox, { backgroundColor: colors.accentLight }]}>
                <Ionicons name="cube-outline" size={22} color={colors.accent} />
              </View>
              <Text style={styles.quickActionTitle}>Inventory</Text>
              <Text style={styles.quickActionDesc}>Batches & stock</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              activeOpacity={0.75}
              onPress={navigateToRecords}
            >
              <View style={[styles.quickActionIconBox, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="document-text-outline" size={22} color={colors.statusSafe} />
              </View>
              <Text style={styles.quickActionTitle}>Past Records</Text>
              <Text style={styles.quickActionDesc}>Search reports</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              activeOpacity={0.75}
              onPress={() => navigation.navigate('Profile')}
            >
              <View style={[styles.quickActionIconBox, { backgroundColor: '#F3E8FF' }]}>
                <Ionicons name="person-outline" size={22} color="#7E22CE" />
              </View>
              <Text style={styles.quickActionTitle}>My Profile</Text>
              <Text style={styles.quickActionDesc}>Unit & logs</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Inspection Activity Section */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Recent Vial Inspections</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={navigateToRecords}>
              <Text style={styles.seeAllText}>View all ({history.length})</Text>
            </TouchableOpacity>
          </View>

          {recentInspections.length > 0 ? (
            recentInspections.map((item) => (
              <InspectionCard
                key={item.id}
                inspection={item}
                onPress={() => navigation.navigate('Result', { inspection: item })}
              />
            ))
          ) : (
            <Card variant="outlined" padding="lg" style={styles.emptyRecentCard}>
              <Ionicons name="scan-outline" size={28} color={colors.textMuted} />
              <Text style={styles.emptyRecentTitle}>No inspections recorded yet</Text>
              <Text style={styles.emptyRecentDesc}>
                Tap "Launch Vial Check" to inspect your first vaccine vial.
              </Text>
            </Card>
          )}
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
    paddingTop: spacing.xs,
    paddingBottom: 130,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  userInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  greetingText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
  },
  userName: {
    ...typography.h2,
    color: colors.navyPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  empChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  empText: {
    ...typography.mono,
    fontSize: 11,
    color: colors.accent,
    fontWeight: '700',
    marginLeft: 3,
  },
  facilityDot: {
    marginHorizontal: 6,
    color: colors.textMuted,
  },
  facilityText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    flex: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    ...shadows.subtle,
  },
  profileBtn: {
    backgroundColor: colors.navyPrimary,
    borderColor: colors.navyPrimary,
  },
  avatarInitials: {
    color: colors.textInverse,
    fontWeight: '700',
    fontSize: 13,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  alertIconWrapper: {
    marginRight: spacing.md,
  },
  alertContent: {
    flex: 1,
    marginRight: spacing.xs,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  alertTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: '#92400E',
  },
  alertSub: {
    ...typography.caption,
    color: '#B45309',
    fontSize: 11,
    lineHeight: 15,
  },
  sectionHeading: {
    ...typography.h3,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  statsSection: {
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: '1%',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  statCardTotal: {
    borderLeftWidth: 3.5,
    borderLeftColor: colors.accent,
  },
  statCardSafe: {
    borderLeftWidth: 3.5,
    borderLeftColor: colors.statusSafe,
  },
  statCardBorderline: {
    borderLeftWidth: 3.5,
    borderLeftColor: colors.statusBorderline,
  },
  statCardDiscard: {
    borderLeftWidth: 3.5,
    borderLeftColor: colors.statusDiscard,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 5,
    fontSize: 12,
  },
  statNumber: {
    ...typography.h2,
    fontSize: 24,
    fontWeight: '800',
    color: colors.navyPrimary,
  },
  statSub: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  heroSection: {
    marginBottom: spacing.lg,
  },
  heroCard: {
    backgroundColor: colors.navyPrimary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.floating,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  readyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 132, 199, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  readyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cyanVibrant,
    marginRight: 5,
  },
  readyText: {
    ...typography.mono,
    fontSize: 9,
    fontWeight: '700',
    color: colors.cyanSoft,
    letterSpacing: 0.5,
  },
  heroHeadline: {
    ...typography.h2,
    color: colors.textInverse,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroDescription: {
    ...typography.bodySmall,
    color: colors.textInverseSecondary,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  vialCheckCta: {
    marginTop: spacing.sm,
    backgroundColor: colors.accent,
  },
  quickActionsSection: {
    marginBottom: spacing.lg,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    ...shadows.card,
  },
  quickActionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  quickActionDesc: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  recentSection: {
    marginBottom: spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  seeAllText: {
    ...typography.bodySmall,
    color: colors.accent,
    fontWeight: '600',
  },
  emptyRecentCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyRecentTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  emptyRecentDesc: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
});
