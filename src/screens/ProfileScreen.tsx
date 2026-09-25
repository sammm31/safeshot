import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../services/authStore';
import { useHistory } from '../services/historyStore';
import { useInventory } from '../services/inventoryStore';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const history = useHistory();
  const { transactions } = useInventory();

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm('Are you sure you want to end your current Safe Shot inspection session?')) {
        logout();
      }
      return;
    }
    Alert.alert(
      'Log Out',
      'Are you sure you want to end your current Safe Shot inspection session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            logout();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Technician Profile"
        subtitle="Credentials & Cold Chain Station"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user?.avatarInitials || 'SJ'}</Text>
          </View>

          <Text style={styles.userName}>{user?.name || 'Dr. Sarah Jenkins'}</Text>
          <Text style={styles.userRole}>{user?.role || 'Senior Vaccine Safety Officer'}</Text>

          <View style={styles.badgeRow}>
            <Badge type="INFO" label={user?.employeeId || 'EMP-92041'} size="sm" />
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>Active Station</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{history.length}</Text>
            <Text style={styles.statLbl}>Vials Checked</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{transactions.length}</Text>
            <Text style={styles.statLbl}>Dispensed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>98.5%</Text>
            <Text style={styles.statLbl}>Accuracy</Text>
          </View>
        </View>

        {/* Facility Information Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Station & Facility</Text>

          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={18} color={colors.accent} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Facility / Hospital</Text>
              <Text style={styles.infoValue}>{user?.facility || 'Metropolitan General Hospital'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="medkit-outline" size={18} color={colors.accent} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>{user?.department || 'Pediatric Immunization Unit'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color={colors.accent} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Official Email</Text>
              <Text style={styles.infoValue}>{user?.email || 's.jenkins@safeshot.health'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.accent} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Audit Registered Date</Text>
              <Text style={styles.infoValue}>{user?.joinedDate || '2024-03-15'}</Text>
            </View>
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.navRow}
            onPress={() => navigation.navigate('Inventory')}
          >
            <View style={styles.navIconBox}>
              <Ionicons name="cube-outline" size={18} color={colors.accent} />
            </View>
            <Text style={styles.navTitle}>View Cold Chain Inventory</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navRow}
            onPress={() => navigation.navigate('Settings')}
          >
            <View style={styles.navIconBox}>
              <Ionicons name="settings-outline" size={18} color={colors.accent} />
            </View>
            <Text style={styles.navTitle}>App Settings & Preferences</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navRow}
            onPress={() => navigation.navigate('About')}
          >
            <View style={styles.navIconBox}>
              <Ionicons name="information-circle-outline" size={18} color={colors.accent} />
            </View>
            <Text style={styles.navTitle}>About Safe Shot</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* App Info Box */}
        <View style={styles.appInfoBox}>
          <Text style={styles.appInfoText}>Safe Shot Mobile • Version 1.0.0 (Expo SDK 57)</Text>
          <Text style={styles.appInfoSub}>Simulated Computer Vision ML Layer</Text>
        </View>

        {/* Logout Button */}
        <Button
          title="Log Out of Station"
          variant="danger"
          size="lg"
          fullWidth
          icon={<Ionicons name="log-out-outline" size={20} color={colors.statusDiscard} />}
          onPress={handleLogout}
          style={styles.logoutBtn}
        />
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
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.navyPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  avatarText: {
    ...typography.h2,
    color: colors.textInverse,
    fontSize: 26,
    fontWeight: '800',
  },
  userName: {
    ...typography.h2,
    color: colors.navyPrimary,
    fontSize: 20,
    marginBottom: 2,
  },
  userRole: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.statusSafe,
    marginHorizontal: 8,
  },
  activeText: {
    ...typography.caption,
    color: colors.statusSafe,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    ...typography.h3,
    color: colors.navyPrimary,
    fontWeight: '800',
  },
  statLbl: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: colors.border,
    alignSelf: 'center',
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  sectionHeading: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceSubtle,
  },
  infoCol: {
    marginLeft: spacing.md,
    flex: 1,
  },
  infoLabel: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
  },
  infoValue: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: 1,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  navIconBox: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  navTitle: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  appInfoBox: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  appInfoText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  appInfoSub: {
    ...typography.caption,
    color: colors.textSubtle,
    fontSize: 10,
    marginTop: 2,
  },
  logoutBtn: {
    marginBottom: spacing.md,
  },
});
