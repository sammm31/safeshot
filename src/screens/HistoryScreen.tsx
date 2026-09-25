import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { InspectionCard } from '../components/wire/InspectionCard';
import { historyStore, useHistory } from '../services/historyStore';
import { InspectionStatus, WireStatus } from '../types/inspection';

type HistoryScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'HistoryTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type FilterType = 'ALL' | InspectionStatus;

export const HistoryScreen: React.FC = () => {
  const navigation = useNavigation<HistoryScreenNavigationProp>();
  const history = useHistory();
  const [filter, setFilter] = useState<FilterType>('ALL');

  const filteredHistory = history.filter((item) => {
    if (filter === 'ALL') return true;
    return item.status === filter;
  });

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Choose an action for the inspection history list:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset to Sample Data',
          onPress: () => historyStore.resetDefaults(),
        },
        {
          text: 'Clear All (Empty State)',
          style: 'destructive',
          onPress: () => historyStore.clear(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Inspection History"
        subtitle={`${history.length} specimen${history.length === 1 ? '' : 's'} recorded`}
        rightAction={
          history.length > 0 ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleClearHistory}
              style={styles.moreButton}
              accessibilityLabel="History options"
            >
              <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => historyStore.resetDefaults()}
              style={styles.restoreButton}
            >
              <Text style={styles.restoreText}>Restore Demo</Text>
            </TouchableOpacity>
          )
        }
      />

      {/* Filter Tabs / Pills */}
      {history.length > 0 && (
        <View style={styles.filterBar}>
          {(['ALL', 'SAFE', 'BORDERLINE', 'DAMAGED'] as FilterType[]).map((tab) => {
            const isActive = filter === tab;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.75}
                onPress={() => setFilter(tab)}
                style={[
                  styles.filterPill,
                  isActive && styles.filterPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Inspection List / Empty State */}
      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InspectionCard
            inspection={item}
            onPress={() => navigation.navigate('Result', { inspection: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="document-text-outline" size={42} color={colors.accent} />
            </View>
            <Text style={styles.emptyTitle}>Your inspections will appear here.</Text>
            <Text style={styles.emptyDescription}>
              Capture a specimen or choose an image to generate detailed computer-vision diagnostic reports.
            </Text>

            <View style={styles.emptyActionRow}>
              <Button
                title="Inspect a Specimen"
                variant="primary"
                size="md"
                icon={<Ionicons name="camera-outline" size={18} color={colors.textInverse} />}
                onPress={() => navigation.navigate('CheckWireTab')}
              />

              <Button
                title="Load Sample Records"
                variant="secondary"
                size="md"
                onPress={() => historyStore.resetDefaults()}
                style={styles.loadSampleBtn}
              />
            </View>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restoreButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.accentLight,
  },
  restoreText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '700',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  filterPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  filterPillActive: {
    backgroundColor: colors.navyPrimary,
    borderColor: colors.navyPrimary,
  },
  filterText: {
    ...typography.tag,
    color: colors.textSecondary,
    fontSize: 11,
  },
  filterTextActive: {
    color: colors.textInverse,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.hero,
    paddingHorizontal: spacing.xl,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emptyDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  emptyActionRow: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadSampleBtn: {
    width: '100%',
  },
});
