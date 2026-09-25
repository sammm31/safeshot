import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
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
import { shadows } from '../theme/shadows';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { InspectionCard } from '../components/wire/InspectionCard';
import { historyStore, useHistory } from '../services/historyStore';
import { InspectionStatus } from '../types/inspection';

type RecordsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'RecordsTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type FilterType = 'ALL' | InspectionStatus;

export const RecordsScreen: React.FC = () => {
  const navigation = useNavigation<RecordsScreenNavigationProp>();
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('ALL');

  // Filter and search logic
  const filteredRecords = history.filter((item) => {
    // 1. Status filter
    if (filter !== 'ALL') {
      if (filter === 'DISCARD') {
        if (item.status !== 'DISCARD' && item.status !== 'DAMAGED') return false;
      } else if (item.status !== filter) {
        return false;
      }
    }

    // 2. Search query filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchId = item.id.toLowerCase().includes(q);
      const matchBatch = item.vialBatch?.batchNumber.toLowerCase().includes(q) || false;
      const matchVaccine = item.vialBatch?.vaccineName.toLowerCase().includes(q) || false;
      const matchSpecimen = item.details.specimenType.toLowerCase().includes(q);
      const matchStatus = item.status.toLowerCase().includes(q);

      return matchId || matchBatch || matchVaccine || matchSpecimen || matchStatus;
    }

    return true;
  });

  const handleClearHistory = () => {
    Alert.alert(
      'Manage Past Records',
      'Choose an action for your local inspection audit log:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset to Sample Records',
          onPress: () => historyStore.resetDefaults(),
        },
        {
          text: 'Clear All Records',
          style: 'destructive',
          onPress: () => historyStore.clear(),
        },
      ]
    );
  };

  const handleNewCheck = () => {
    navigation.navigate('MainTabs', { screen: 'VialCheckTab' });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Past Records"
        subtitle={`${history.length} vial inspection${history.length === 1 ? '' : 's'} recorded`}
        rightAction={
          history.length > 0 ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleClearHistory}
              style={styles.moreButton}
              accessibilityLabel="Record management options"
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

      {/* Search Input Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBarWrapper}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by vaccine, batch #, or ID..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs / Status Pills */}
      <View style={styles.filterBar}>
        {(['ALL', 'SAFE', 'BORDERLINE', 'DISCARD'] as FilterType[]).map((tab) => {
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

      {/* Inspection List / Empty State */}
      <FlatList
        data={filteredRecords}
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
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No matching records found' : 'No inspection records yet'}
            </Text>
            <Text style={styles.emptyDescription}>
              {searchQuery
                ? `No inspection matches "${searchQuery}". Try a different keyword.`
                : 'Run an optical check on a vaccine vial to generate audit reports.'}
            </Text>

            <View style={styles.emptyActionRow}>
              {searchQuery ? (
                <Button
                  title="Clear Search"
                  variant="secondary"
                  size="md"
                  onPress={() => setSearchQuery('')}
                />
              ) : (
                <>
                  <Button
                    title="Inspect a Vial"
                    variant="primary"
                    size="md"
                    icon={<Ionicons name="camera-outline" size={18} color={colors.textInverse} />}
                    onPress={handleNewCheck}
                  />

                  <Button
                    title="Load Sample Records"
                    variant="secondary"
                    size="md"
                    onPress={() => historyStore.resetDefaults()}
                    style={styles.loadSampleBtn}
                  />
                </>
              )}
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
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.subtle,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.textPrimary,
    height: '100%',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
  },
  filterPillActive: {
    backgroundColor: colors.navyPrimary,
    borderColor: colors.navyPrimary,
  },
  filterText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    fontSize: 11,
  },
  filterTextActive: {
    color: colors.textInverse,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: 130,
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceSubtle,
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
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.xl,
  },
  emptyActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadSampleBtn: {
    marginLeft: spacing.sm,
  },
});
