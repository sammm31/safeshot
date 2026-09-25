import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { useInventory } from '../services/inventoryStore';
import { BatchItem, BatchStatus } from '../types/inventory';
import { getBatchStatusTheme } from '../utils/formatters';

export const InventoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { batches, transactions, dispenseVial, addBatch, resetDefaults } = useInventory();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'BATCHES' | 'TRANSACTIONS'>('BATCHES');

  // Add Batch Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVaccineName, setNewVaccineName] = useState('');
  const [newBatchNumber, setNewBatchNumber] = useState('');
  const [newQuantity, setNewQuantity] = useState('50');
  const [newExpiryDate, setNewExpiryDate] = useState('2027-02-15');
  const [newManufacturer, setNewManufacturer] = useState('Pfizer-BioNTech');
  const [newStorageTemp, setNewStorageTemp] = useState('2°C – 8°C');

  // Dispense Vial Modal State
  const [dispenseModalBatch, setDispenseModalBatch] = useState<BatchItem | null>(null);
  const [dispenseQty, setDispenseQty] = useState('1');
  const [dispenseWard, setDispenseWard] = useState('General Pediatric Ward 3');
  const [dispenseNotes, setDispenseNotes] = useState('Verified via Safe Shot VVM Optical Check.');

  // Filter batches
  const filteredBatches = batches.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.vaccineName.toLowerCase().includes(q) ||
      b.batchNumber.toLowerCase().includes(q) ||
      b.manufacturer.toLowerCase().includes(q)
    );
  });

  // Handle Dispense
  const handleConfirmDispense = () => {
    if (!dispenseModalBatch) return;
    const qty = parseInt(dispenseQty, 10);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid number of vials to dispense.');
      return;
    }

    const res = dispenseVial({
      batchId: dispenseModalBatch.id,
      quantity: qty,
      recipientWard: dispenseWard,
      notes: dispenseNotes,
    });

    if (res.success) {
      Alert.alert(
        'Vial Dispensed Successfully',
        `${res.message}\n\nInventory has been updated immediately and transaction logged.`,
        [{ text: 'OK' }]
      );
      setDispenseModalBatch(null);
    } else {
      Alert.alert('Dispense Error', res.message);
    }
  };

  // Handle Add Batch
  const handleSaveNewBatch = () => {
    if (!newVaccineName.trim() || !newBatchNumber.trim()) {
      Alert.alert('Missing Fields', 'Vaccine name and batch number are required.');
      return;
    }

    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid stock quantity.');
      return;
    }

    addBatch({
      vaccineName: newVaccineName.trim(),
      batchNumber: newBatchNumber.trim().toUpperCase(),
      totalQuantity: qty,
      availableQuantity: qty,
      expiryDate: newExpiryDate.trim(),
      manufacturer: newManufacturer.trim(),
      storageTemp: newStorageTemp.trim(),
      dosage: '0.5 mL per vial',
    });

    Alert.alert('Batch Added', `Batch ${newBatchNumber.toUpperCase()} added to active inventory.`);
    setShowAddModal(false);
    setNewVaccineName('');
    setNewBatchNumber('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Cold Chain Inventory"
        subtitle={`${batches.length} vaccine batches registered`}
        showBack
        onBack={() => navigation.goBack()}
        rightAction={
          <Button
            title="+ Add Batch"
            variant="primary"
            size="sm"
            onPress={() => setShowAddModal(true)}
          />
        }
      />

      {/* Segmented Controller: Batches vs Dispense Log */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'BATCHES' && styles.tabButtonActive]}
          onPress={() => setActiveTab('BATCHES')}
        >
          <Ionicons
            name="cube-outline"
            size={16}
            color={activeTab === 'BATCHES' ? colors.textInverse : colors.textSecondary}
          />
          <Text style={[styles.tabButtonText, activeTab === 'BATCHES' && styles.tabButtonTextActive]}>
            Stock Batches ({batches.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'TRANSACTIONS' && styles.tabButtonActive]}
          onPress={() => setActiveTab('TRANSACTIONS')}
        >
          <Ionicons
            name="receipt-outline"
            size={16}
            color={activeTab === 'TRANSACTIONS' ? colors.textInverse : colors.textSecondary}
          />
          <Text style={[styles.tabButtonText, activeTab === 'TRANSACTIONS' && styles.tabButtonTextActive]}>
            Dispense Logs ({transactions.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'BATCHES' ? (
        <>
          {/* Search Box */}
          <View style={styles.searchSection}>
            <View style={styles.searchBarWrapper}>
              <Ionicons name="search-outline" size={18} color={colors.textMuted} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search vaccine, batch #, or maker..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Batches FlatList */}
          <FlatList
            data={filteredBatches}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const statusTheme = getBatchStatusTheme(item.status);
              const percentage = Math.round((item.availableQuantity / item.totalQuantity) * 100);

              return (
                <View style={styles.batchCard}>
                  {/* Top Row: Vaccine Name + Status Badge */}
                  <View style={styles.batchHeaderRow}>
                    <View style={styles.titleCol}>
                      <Text style={styles.vaccineNameText}>{item.vaccineName}</Text>
                      <View style={styles.badgeRow}>
                        <View style={styles.batchTag}>
                          <Text style={styles.batchNumberText}>{item.batchNumber}</Text>
                        </View>
                        <View
                          style={[
                            styles.statusChip,
                            { backgroundColor: statusTheme.bgColor, borderColor: statusTheme.borderColor },
                          ]}
                        >
                          <Text style={[styles.statusChipText, { color: statusTheme.color }]}>
                            {statusTheme.label}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Stock Metrics Row */}
                  <View style={styles.stockRow}>
                    <View style={styles.stockCol}>
                      <Text style={styles.stockLabel}>Available Vials</Text>
                      <View style={styles.stockNumbers}>
                        <Text style={styles.stockAvailable}>{item.availableQuantity}</Text>
                        <Text style={styles.stockTotal}> / {item.totalQuantity}</Text>
                      </View>
                    </View>

                    <View style={styles.stockCol}>
                      <Text style={styles.stockLabel}>Expiry Date</Text>
                      <Text style={styles.expiryValue}>{item.expiryDate}</Text>
                    </View>

                    <View style={styles.stockCol}>
                      <Text style={styles.stockLabel}>Storage Temp</Text>
                      <Text style={styles.tempValue}>{item.storageTemp}</Text>
                    </View>
                  </View>

                  {/* Visual Quantity Bar */}
                  <View style={styles.stockBarTrack}>
                    <View
                      style={[
                        styles.stockBarFill,
                        {
                          width: `${Math.min(100, Math.max(0, percentage))}%`,
                          backgroundColor:
                            percentage < 20
                              ? colors.statusDiscard
                              : percentage < 40
                              ? colors.statusBorderline
                              : colors.statusSafe,
                        },
                      ]}
                    />
                  </View>

                  {/* Footer Action Row */}
                  <View style={styles.batchActionRow}>
                    <Text style={styles.manufacturerText} numberOfLines={1}>
                      {item.manufacturer}
                    </Text>

                    <View style={styles.actionBtnGroup}>
                      <TouchableOpacity
                        style={styles.inspectBtn}
                        onPress={() => {
                          navigation.navigate('MainTabs', {
                            screen: 'VialCheckTab',
                            params: { preselectedBatchId: item.id },
                          });
                        }}
                      >
                        <Ionicons name="scan-outline" size={14} color={colors.accent} />
                        <Text style={styles.inspectBtnText}>Check Vial</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.dispenseBtn,
                          item.availableQuantity === 0 && styles.dispenseBtnDisabled,
                        ]}
                        disabled={item.availableQuantity === 0}
                        onPress={() => setDispenseModalBatch(item)}
                      >
                        <Ionicons name="paper-plane-outline" size={14} color={colors.textInverse} />
                        <Text style={styles.dispenseBtnText}>Dispense</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="cube-outline" size={40} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>No vaccine batches found</Text>
                <Text style={styles.emptyDesc}>Try adjusting your search query or add a new batch.</Text>
              </View>
            }
          />
        </>
      ) : (
        /* Dispense Transaction History */
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.txnCard}>
              <View style={styles.txnHeader}>
                <View style={styles.txnIconCircle}>
                  <Ionicons name="arrow-up-circle" size={24} color={colors.accent} />
                </View>
                <View style={styles.txnTitleCol}>
                  <Text style={styles.txnVaccineName}>{item.vaccineName}</Text>
                  <Text style={styles.txnBatchText}>Batch: {item.batchNumber}</Text>
                </View>
                <View style={styles.txnQtyBadge}>
                  <Text style={styles.txnQtyText}>-{item.quantityDispensed} Vial</Text>
                </View>
              </View>

              <View style={styles.txnDivider} />

              <View style={styles.txnMetaRow}>
                <Text style={styles.txnMetaText}>Ward: {item.recipientWard || 'General Ward'}</Text>
                <Text style={styles.txnTimeText}>
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              {item.notes && <Text style={styles.txnNotesText}>{item.notes}</Text>}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No dispense records yet</Text>
              <Text style={styles.emptyDesc}>Dispense a vial from active stock to log transactions.</Text>
            </View>
          }
        />
      )}

      {/* Dispense Vial Modal */}
      <Modal
        visible={dispenseModalBatch !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDispenseModalBatch(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Dispense Vaccine Vial</Text>
                <Text style={styles.modalSubtitle}>{dispenseModalBatch?.vaccineName}</Text>
              </View>
              <TouchableOpacity onPress={() => setDispenseModalBatch(null)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalStockBanner}>
              <Text style={styles.modalStockText}>
                Remaining Available Stock: <Text style={{ fontWeight: '800' }}>{dispenseModalBatch?.availableQuantity}</Text> vials
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quantity to Dispense</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                value={dispenseQty}
                onChangeText={setDispenseQty}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Recipient Ward / Clinic</Text>
              <TextInput
                style={styles.modalInput}
                value={dispenseWard}
                onChangeText={setDispenseWard}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dispense Verification Notes</Text>
              <TextInput
                style={styles.modalInput}
                value={dispenseNotes}
                onChangeText={setDispenseNotes}
              />
            </View>

            <View style={styles.modalActionButtons}>
              <Button
                title="Cancel"
                variant="ghost"
                size="md"
                onPress={() => setDispenseModalBatch(null)}
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title="Confirm Dispense"
                variant="primary"
                size="md"
                icon={<Ionicons name="checkmark" size={18} color={colors.textInverse} />}
                onPress={handleConfirmDispense}
                style={{ flex: 1.5 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Batch Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <ScrollView contentContainerStyle={styles.addModalScroll}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Vaccine Batch</Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Vaccine Brand & Type</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. Covaxin Inactivated Vial"
                  placeholderTextColor={colors.textMuted}
                  value={newVaccineName}
                  onChangeText={setNewVaccineName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Batch / Lot Number</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. COV-2026-X88"
                  placeholderTextColor={colors.textMuted}
                  value={newBatchNumber}
                  onChangeText={setNewBatchNumber}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Initial Quantity (Vials)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. 50"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={newQuantity}
                  onChangeText={setNewQuantity}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Expiration Date (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="2027-02-15"
                  placeholderTextColor={colors.textMuted}
                  value={newExpiryDate}
                  onChangeText={setNewExpiryDate}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Manufacturer</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. Serum Institute / Bharat Biotech"
                  placeholderTextColor={colors.textMuted}
                  value={newManufacturer}
                  onChangeText={setNewManufacturer}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Storage Temperature</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="2°C – 8°C"
                  placeholderTextColor={colors.textMuted}
                  value={newStorageTemp}
                  onChangeText={setNewStorageTemp}
                />
              </View>

              <View style={styles.modalActionButtons}>
                <Button
                  title="Cancel"
                  variant="ghost"
                  size="md"
                  onPress={() => setShowAddModal(false)}
                  style={{ flex: 1, marginRight: 8 }}
                />
                <Button
                  title="Save Batch"
                  variant="primary"
                  size="md"
                  icon={<Ionicons name="save-outline" size={18} color={colors.textInverse} />}
                  onPress={handleSaveNewBatch}
                  style={{ flex: 1.5 }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabButtonActive: {
    backgroundColor: colors.navyPrimary,
    borderColor: colors.navyPrimary,
  },
  tabButtonText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    marginLeft: 6,
  },
  tabButtonTextActive: {
    color: colors.textInverse,
  },
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
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
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxxl,
  },
  batchCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  batchHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleCol: {
    flex: 1,
  },
  vaccineNameText: {
    ...typography.h3,
    fontSize: 16,
    color: colors.navyPrimary,
    fontWeight: '700',
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batchTag: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    marginRight: 6,
  },
  batchNumberText: {
    ...typography.mono,
    fontSize: 11,
    color: colors.navyPrimary,
    fontWeight: '700',
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  statusChipText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginVertical: spacing.xs,
  },
  stockCol: {
    flex: 1,
  },
  stockLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 2,
  },
  stockNumbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  stockAvailable: {
    ...typography.monoLarge,
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  stockTotal: {
    ...typography.caption,
    color: colors.textMuted,
  },
  expiryValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  tempValue: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  stockBarTrack: {
    height: 6,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 10,
  },
  stockBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  batchActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceSubtle,
  },
  manufacturerText: {
    ...typography.caption,
    color: colors.textMuted,
    flex: 1,
    marginRight: spacing.sm,
  },
  actionBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inspectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    marginRight: 8,
  },
  inspectBtnText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.accent,
    marginLeft: 4,
  },
  dispenseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navyPrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  dispenseBtnDisabled: {
    backgroundColor: colors.textMuted,
  },
  dispenseBtnText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textInverse,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  emptyDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
  },
  txnCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    ...shadows.subtle,
  },
  txnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txnIconCircle: {
    marginRight: spacing.md,
  },
  txnTitleCol: {
    flex: 1,
  },
  txnVaccineName: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  txnBatchText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  txnQtyBadge: {
    backgroundColor: colors.statusDiscardBg,
    borderColor: colors.statusDiscardBorder,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  txnQtyText: {
    ...typography.mono,
    fontSize: 12,
    fontWeight: '700',
    color: colors.statusDiscard,
  },
  txnDivider: {
    height: 1,
    backgroundColor: colors.surfaceSubtle,
    marginVertical: spacing.sm,
  },
  txnMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txnMetaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  txnTimeText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  txnNotesText: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.floating,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  modalSubtitle: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
    marginTop: 2,
  },
  modalStockBanner: {
    backgroundColor: colors.accentLight,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  modalStockText: {
    ...typography.bodySmall,
    color: colors.accent,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  modalInput: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  modalActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  addModalScroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
