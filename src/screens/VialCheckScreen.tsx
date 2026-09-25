import React, { useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { CompositeNavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { Button } from '../components/common/Button';
import { Header } from '../components/common/Header';
import { Badge } from '../components/common/Badge';
import { ScanningOverlay } from '../components/wire/ScanningOverlay';
import { analyzeVial } from '../services/vialInspectionService';
import { historyStore } from '../services/historyStore';
import { useInventory } from '../services/inventoryStore';
import { SAMPLE_SPECIMENS } from '../utils/sampleWires';
import { BatchItem } from '../types/inventory';
import { VialBatchInfo } from '../types/inspection';

type VialCheckNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'VialCheckTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const VialCheckScreen: React.FC = () => {
  const navigation = useNavigation<VialCheckNavigationProp>();
  const route = useRoute<any>();
  const { batches } = useInventory();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<BatchItem | null>(() => {
    const preselectedId = route.params?.preselectedBatchId;
    if (preselectedId) {
      return batches.find((b) => b.id === preselectedId) || batches[0] || null;
    }
    return batches[0] || null;
  });
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Take photo using device camera
  const handleTakePhoto = async () => {
    setPermissionError(null);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setPermissionError('Camera permission is required to capture vial inspection images.');
        Alert.alert(
          'Camera Permission Required',
          'Safe Shot requires camera access to capture vial cap/VVM images. Please grant permission in your system settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS !== 'web') {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Camera launch error:', err);
      Alert.alert('Camera Error', 'Could not open camera. Try choosing an image from the gallery instead.');
    }
  };

  // Choose image from gallery
  const handleChooseGallery = async () => {
    setPermissionError(null);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setPermissionError('Gallery permission is required to select existing images.');
        Alert.alert(
          'Gallery Access Required',
          'Safe Shot needs access to your gallery to choose a vial image for optical analysis.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS !== 'web') {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Gallery pick error:', err);
      Alert.alert('Gallery Error', 'Could not access the gallery. Please try again.');
    }
  };

  // Run the inspection service
  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const batchInfo: VialBatchInfo | undefined = selectedBatch
        ? {
            batchNumber: selectedBatch.batchNumber,
            vaccineName: selectedBatch.vaccineName,
            expiryDate: selectedBatch.expiryDate,
            manufacturer: selectedBatch.manufacturer,
            storageTemp: selectedBatch.storageTemp,
          }
        : undefined;

      const inspectionResult = await analyzeVial({
        imageUri: selectedImage,
        batchInfo,
      });

      // Persist in history store
      historyStore.add(inspectionResult);

      // Transition to Result Screen
      navigation.navigate('Result', { inspection: inspectionResult });
    } catch (err) {
      console.error('Vial inspection error:', err);
      Alert.alert('Analysis Failed', 'Unable to complete optical inspection. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetake = () => {
    setSelectedImage(null);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Vial Check"
        subtitle="Optical Vaccine Vial Monitor (VVM) Verification"
        rightAction={<Badge type="DEMO" label="AI INFERENCE READY" size="sm" />}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Permission Notice Banner (if previously denied) */}
        {permissionError && (
          <View style={styles.permissionBanner}>
            <Ionicons name="warning-outline" size={20} color={colors.statusBorderline} />
            <Text style={styles.permissionText}>{permissionError}</Text>
          </View>
        )}

        {/* Batch Selection Strip */}
        <View style={styles.batchSelectorContainer}>
          <View style={styles.batchLabelRow}>
            <Text style={styles.batchLabelText}>Assigned Vaccine Batch</Text>
            <TouchableOpacity onPress={() => setShowBatchModal(true)} activeOpacity={0.7}>
              <Text style={styles.changeBatchText}>Change batch</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.batchCard}
            activeOpacity={0.75}
            onPress={() => setShowBatchModal(true)}
          >
            <View style={styles.batchIconWrapper}>
              <Ionicons name="medical" size={20} color={colors.accent} />
            </View>
            <View style={styles.batchInfo}>
              <Text style={styles.batchVaccineName} numberOfLines={1}>
                {selectedBatch ? selectedBatch.vaccineName : 'Generic / Unassigned Batch'}
              </Text>
              <Text style={styles.batchSubText}>
                {selectedBatch ? `Batch: ${selectedBatch.batchNumber} • Exp: ${selectedBatch.expiryDate}` : 'Tap to assign batch from inventory'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Primary Capture / Selection Card */}
        <View style={styles.mainCardContainer}>
          {!selectedImage ? (
            /* Empty State / Image Selector */
            <View style={styles.emptyCard}>
              {/* Technical Reticle Accents */}
              <View style={[styles.cornerMarker, styles.cmTL]} />
              <View style={[styles.cornerMarker, styles.cmTR]} />
              <View style={[styles.cornerMarker, styles.cmBL]} />
              <View style={[styles.cornerMarker, styles.cmBR]} />

              <View style={styles.emptyIconCircle}>
                <Ionicons name="camera" size={38} color={colors.accent} />
              </View>

              <Text style={styles.emptyTitle}>Capture Vial Cap or VVM</Text>
              <Text style={styles.emptySubtitle}>
                Take a direct overhead photo or pick an image from gallery
              </Text>

              {/* Action Buttons */}
              <View style={styles.buttonStack}>
                <Button
                  title="Take Photo"
                  variant="primary"
                  size="md"
                  fullWidth
                  icon={<Ionicons name="camera-outline" size={18} color={colors.textInverse} />}
                  onPress={handleTakePhoto}
                  style={styles.actionBtn}
                />

                <Button
                  title="Choose from Gallery"
                  variant="secondary"
                  size="md"
                  fullWidth
                  icon={<Ionicons name="images-outline" size={18} color={colors.textPrimary} />}
                  onPress={handleChooseGallery}
                  style={styles.actionBtn}
                />
              </View>
            </View>
          ) : (
            /* Selected Image Preview Area */
            <View style={styles.previewContainer}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />

                {/* Technical Corner Brackets */}
                <View style={[styles.cornerMarker, styles.cmTL]} />
                <View style={[styles.cornerMarker, styles.cmTR]} />
                <View style={[styles.cornerMarker, styles.cmBL]} />
                <View style={[styles.cornerMarker, styles.cmBR]} />

                {/* Optical Scanning HUD Overlay during analysis */}
                {isAnalyzing && <ScanningOverlay />}
              </View>

              {/* Instruction banner */}
              <View style={styles.instructionBanner}>
                <Ionicons name="scan-outline" size={18} color={colors.accent} />
                <Text style={styles.instructionText}>
                  Ensure the central square and circular boundary are in focus.
                </Text>
              </View>

              {/* Action controls */}
              <View style={styles.previewActionGroup}>
                <Button
                  title="Analyze Vial"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isAnalyzing}
                  disabled={isAnalyzing}
                  icon={<Ionicons name="analytics-outline" size={20} color={colors.textInverse} />}
                  onPress={handleAnalyze}
                />

                <View style={styles.retakeRow}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleRetake}
                    disabled={isAnalyzing}
                    style={styles.retakeButton}
                  >
                    <Ionicons name="refresh-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.retakeText}>Retake / Choose another image</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Synthetic VVM Presets for Rapid Evaluation */}
        <View style={styles.specimensSection}>
          <View style={styles.specimensHeaderRow}>
            <Text style={styles.specimensTitle}>Synthetic VVM Test Presets</Text>
            <Text style={styles.specimensSubtitle}>Circle & square photometric test</Text>
          </View>

          <View style={styles.presetList}>
            {SAMPLE_SPECIMENS.map((preset) => {
              const isSelected = selectedImage === preset.uri;
              return (
                <TouchableOpacity
                  key={preset.id}
                  activeOpacity={0.8}
                  disabled={isAnalyzing}
                  onPress={() => setSelectedImage(preset.uri)}
                  style={[
                    styles.presetCard,
                    isSelected && styles.presetCardSelected,
                  ]}
                >
                  <View style={styles.presetThumbWrapper}>
                    <Image
                      source={{ uri: preset.uri }}
                      style={styles.presetThumb}
                    />
                  </View>
                  <View style={styles.presetInfo}>
                    <View style={styles.presetBadgeRow}>
                      <Badge type={preset.condition === 'DAMAGED' ? 'DISCARD' : preset.condition} size="sm" />
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
                      )}
                    </View>
                    <Text style={styles.presetTitle} numberOfLines={1}>
                      {preset.title.replace('Damaged', 'Discard')}
                    </Text>
                    <Text style={styles.presetSub} numberOfLines={1}>
                      {preset.subtitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Batch Selection Modal */}
      <Modal
        visible={showBatchModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBatchModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Vaccine Batch</Text>
              <TouchableOpacity onPress={() => setShowBatchModal(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.modalItem, selectedBatch === null && styles.modalItemSelected]}
                onPress={() => {
                  setSelectedBatch(null);
                  setShowBatchModal(false);
                }}
              >
                <View style={styles.modalItemContent}>
                  <Text style={styles.modalItemTitle}>None / Ad-hoc Inspection</Text>
                  <Text style={styles.modalItemSub}>Inspect without linking to an inventory batch</Text>
                </View>
                {selectedBatch === null && (
                  <Ionicons name="checkmark" size={20} color={colors.accent} />
                )}
              </TouchableOpacity>

              {batches.map((batch) => {
                const isCurrent = selectedBatch?.id === batch.id;
                return (
                  <TouchableOpacity
                    key={batch.id}
                    style={[styles.modalItem, isCurrent && styles.modalItemSelected]}
                    onPress={() => {
                      setSelectedBatch(batch);
                      setShowBatchModal(false);
                    }}
                  >
                    <View style={styles.modalItemContent}>
                      <Text style={styles.modalItemTitle}>{batch.vaccineName}</Text>
                      <Text style={styles.modalItemSub}>
                        {batch.batchNumber} • Avail: {batch.availableQuantity} • Exp: {batch.expiryDate}
                      </Text>
                    </View>
                    {isCurrent && (
                      <Ionicons name="checkmark" size={20} color={colors.accent} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 130,
  },
  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.statusBorderlineBg,
    borderColor: colors.statusBorderlineBorder,
    borderWidth: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  permissionText: {
    ...typography.bodySmall,
    color: colors.statusBorderline,
    marginLeft: spacing.sm,
    flex: 1,
  },
  batchSelectorContainer: {
    marginBottom: spacing.md,
  },
  batchLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  batchLabelText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  changeBatchText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
  },
  batchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.subtle,
  },
  batchIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  batchInfo: {
    flex: 1,
  },
  batchVaccineName: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  batchSubText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  mainCardContainer: {
    marginBottom: spacing.lg,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 280,
    ...shadows.card,
  },
  cornerMarker: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: colors.accent,
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
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  buttonStack: {
    width: '100%',
  },
  actionBtn: {
    marginBottom: spacing.sm,
  },
  previewContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.navyDark,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  instructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  instructionText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  previewActionGroup: {
    padding: spacing.lg,
  },
  retakeRow: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  retakeText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  specimensSection: {
    marginTop: spacing.xs,
  },
  specimensHeaderRow: {
    marginBottom: spacing.sm,
  },
  specimensTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary,
  },
  specimensSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },
  presetList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  presetCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.sm,
    marginHorizontal: '1%',
    marginBottom: spacing.sm,
    ...shadows.subtle,
  },
  presetCardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentLight,
  },
  presetThumbWrapper: {
    width: '100%',
    height: 80,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: colors.navyDark,
    marginBottom: spacing.xs,
  },
  presetThumb: {
    width: '100%',
    height: '100%',
  },
  presetInfo: {
    paddingHorizontal: 2,
  },
  presetBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  presetTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  presetSub: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  modalList: {
    marginTop: spacing.xs,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    backgroundColor: colors.surfaceSubtle,
  },
  modalItemSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentLight,
  },
  modalItemContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  modalItemTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalItemSub: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
});
