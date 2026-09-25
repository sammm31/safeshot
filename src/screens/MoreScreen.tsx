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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { RootStackParamList } from '../navigation/types';
import { Header } from '../components/common/Header';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../services/authStore';
import { useInventory } from '../services/inventoryStore';

type MoreNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const MoreScreen: React.FC = () => {
  const navigation = useNavigation<MoreNavigationProp>();
  const { user, logout } = useAuth();
  const { batches, expiringSoonBatches } = useInventory();

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm('Are you sure you want to end your Safe Shot inspection session?')) {
        logout();
      }
      return;
    }
    Alert.alert(
      'Log Out',
      'Are you sure you want to end your Safe Shot inspection session?',
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
        title="More Options"
        subtitle="Cold Chain Management & Utilities"
        rightAction={
          <Badge type="DEMO" label="STATION ACTIVE" size="sm" />
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Mini Header Card */}
        <TouchableOpacity
          style={styles.userCard}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user?.avatarInitials || 'SJ'}</Text>
          </View>
          <View style={styles.userInfoCol}>
            <Text style={styles.userNameText}>{user?.name || 'Dr. Sarah Jenkins'}</Text>
            <Text style={styles.userEmpId}>{user?.employeeId || 'EMP-92041'} • {user?.facility || 'Hospital Station'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Primary Management Hub Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeading}>Operations & Inventory</Text>

          {/* 1. Inventory */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Inventory')}
          >
            <View style={[styles.menuIconBox, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="cube-outline" size={22} color={colors.accent} />
            </View>
            <View style={styles.menuContent}>
              <View style={styles.menuTitleRow}>
                <Text style={styles.menuTitle}>Cold Chain Inventory</Text>
                {expiringSoonBatches.length > 0 && (
                  <Badge type="BORDERLINE" label={`${expiringSoonBatches.length} CRITICAL`} size="sm" />
                )}
              </View>
              <Text style={styles.menuDesc}>
                {batches.length} batches • Dispense vials & manage stock
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          {/* 2. Profile */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="person-outline" size={22} color={colors.statusSafe} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Technician Profile</Text>
              <Text style={styles.menuDesc}>Station credentials, ID & audit logs</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          {/* 3. Settings */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Settings')}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="settings-outline" size={22} color={colors.navyPrimary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Settings & Preferences</Text>
              <Text style={styles.menuDesc}>Reticle HUD, haptics & mock cache</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          {/* 4. About */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('About')}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="information-circle-outline" size={22} color="#D97706" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>About Safe Shot</Text>
              <Text style={styles.menuDesc}>VVM guidelines & architecture roadmap</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutRow}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <View style={styles.logoutIconBox}>
              <Ionicons name="log-out-outline" size={20} color={colors.statusDiscard} />
            </View>
            <Text style={styles.logoutText}>Log Out of Station</Text>
          </TouchableOpacity>
        </View>

        {/* Version info */}
        <View style={styles.footer}>
          <Text style={styles.footerVersion}>Safe Shot • Version 1.0.0 (Expo SDK 57)</Text>
          <Text style={styles.footerSub}>Simulated Computer Vision ML Layer</Text>
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
    paddingBottom: spacing.xxxl,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.navyPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.h3,
    color: colors.textInverse,
    fontWeight: '800',
  },
  userInfoCol: {
    flex: 1,
  },
  userNameText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userEmpId: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  menuSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.subtle,
  },
  sectionHeading: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceSubtle,
  },
  menuIconBox: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuContent: {
    flex: 1,
    marginRight: spacing.xs,
  },
  menuTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  menuDesc: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  logoutSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.xl,
    ...shadows.subtle,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  logoutIconBox: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.statusDiscardBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  logoutText: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.statusDiscard,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  footerVersion: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  footerSub: {
    ...typography.caption,
    color: colors.textSubtle,
    fontSize: 10,
    marginTop: 2,
  },
});
