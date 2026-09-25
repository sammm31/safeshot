import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
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
import { historyStore } from '../services/historyStore';
import { inventoryStore } from '../services/inventoryStore';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [soundFeedback, setSoundFeedback] = useState(true);
  const [autoSaveReport, setAutoSaveReport] = useState(true);
  const [highContrastHud, setHighContrastHud] = useState(false);
  const [offlineMode, setOfflineMode] = useState(true);

  const handleResetDemoData = () => {
    Alert.alert(
      'Reset All Mock Data',
      'This will reset your local inspection records and vaccine inventory back to initial demo values.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Data',
          style: 'destructive',
          onPress: () => {
            historyStore.resetDefaults();
            inventoryStore.resetDefaults();
            Alert.alert('Reset Complete', 'Demo inspection records and inventory have been restored.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Settings & Preferences"
        subtitle="Inspection Station Configuration"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Inspection Experience Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Optical Inspection Preferences</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Auto-Archive Reports</Text>
              <Text style={styles.settingSubtitle}>Automatically save completed inspections to Past Records</Text>
            </View>
            <Switch
              value={autoSaveReport}
              onValueChange={setAutoSaveReport}
              trackColor={{ false: colors.borderStrong, true: colors.accent }}
              thumbColor={colors.textInverse}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Audio / Haptic Feedback</Text>
              <Text style={styles.settingSubtitle}>Play auditory confirmation upon status classification</Text>
            </View>
            <Switch
              value={soundFeedback}
              onValueChange={setSoundFeedback}
              trackColor={{ false: colors.borderStrong, true: colors.accent }}
              thumbColor={colors.textInverse}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>High-Contrast Reticle HUD</Text>
              <Text style={styles.settingSubtitle}>Enhance concentric circle-square viewfinder contrast</Text>
            </View>
            <Switch
              value={highContrastHud}
              onValueChange={setHighContrastHud}
              trackColor={{ false: colors.borderStrong, true: colors.accent }}
              thumbColor={colors.textInverse}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Offline Standalone Mode</Text>
              <Text style={styles.settingSubtitle}>Run on-device simulated inference without network access</Text>
            </View>
            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              trackColor={{ false: colors.borderStrong, true: colors.accent }}
              thumbColor={colors.textInverse}
            />
          </View>
        </View>

        {/* Data & Storage Management */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Mock Data & Cache Management</Text>

          <TouchableOpacity style={styles.actionRow} onPress={handleResetDemoData}>
            <View style={styles.actionIconWrapper}>
              <Ionicons name="refresh-circle-outline" size={22} color={colors.accent} />
            </View>
            <View style={styles.actionTextCol}>
              <Text style={styles.actionTitle}>Restore Initial Demo Data</Text>
              <Text style={styles.actionSub}>Reset sample records and vaccine batches</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => {
              Alert.alert(
                'Clear Local Inspection Cache',
                'Are you sure? This will remove all temporary cached images.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Clear Cache', onPress: () => Alert.alert('Cache Cleared', 'Temporary cache wiped.') },
                ]
              );
            }}
          >
            <View style={styles.actionIconWrapper}>
              <Ionicons name="trash-outline" size={22} color={colors.statusDiscard} />
            </View>
            <View style={styles.actionTextCol}>
              <Text style={[styles.actionTitle, { color: colors.statusDiscard }]}>Clear Image Cache</Text>
              <Text style={styles.actionSub}>Free up local temporary media storage</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* System Diagnostics & About */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>System Diagnostics</Text>

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Application Build</Text>
            <Text style={styles.specValue}>Safe Shot v1.0.0-rc4</Text>
          </View>

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Runtime Engine</Text>
            <Text style={styles.specValue}>React Native 0.86 • Expo SDK 57</Text>
          </View>

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Inference Engine</Text>
            <Text style={styles.specValue}>Mock Photometric CV Layer</Text>
          </View>

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Target Architecture</Text>
            <Text style={styles.specValue}>Android Native / Expo Go</Text>
          </View>
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
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceSubtle,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  settingSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 15,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceSubtle,
  },
  actionIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  actionTextCol: {
    flex: 1,
  },
  actionTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actionSub: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  specLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  specValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
