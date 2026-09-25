import React, { useState } from 'react';
import {
  Alert,
  Image,
  Linking,
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
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Header } from '../components/common/Header';
import { ScanningOverlay } from '../components/wire/ScanningOverlay';
import { analyzeWire } from '../services/wireCheckService';
import { historyStore } from '../services/historyStore';
import { SAMPLE_WIRES } from '../utils/sampleWires';
import { Badge } from '../components/common/Badge';

type CheckWireNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'CheckWireTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const CheckWireScreen: React.FC = () => {
  const navigation = useNavigation<CheckWireNavigationProp>();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Take photo using device camera
  const handleTakePhoto = async () => {
    setPermissionError(null);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setPermissionError('Camera permission is required to capture wire images.');
        Alert.alert(
          'Camera Permission Required',
          'WireCheck requires camera access to inspect wires. Please grant camera permission in your system settings.',
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
        aspect: [4, 3],
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Camera launch error:', err);
      Alert.alert('Camera Error', 'Could not open the camera. Please try selecting an image from the gallery instead.');
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
          'WireCheck needs access to your photos to choose a wire image for analysis.',
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
        aspect: [4, 3],
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
      const inspectionResult = await analyzeWire(selectedImage);
      // Persist in history store
      historyStore.add(inspectionResult);

      // Transition to Result Screen
      navigation.navigate('Result', { inspection: inspectionResult });
    } catch (err) {
      console.error('Inspection error:', err);
      Alert.alert('Analysis Failed', 'Unable to complete wire inspection. Please try again.');
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
        title="Check a Wire"
        subtitle="Capture a clear image for inspection"
        rightAction={
          <Badge type="DEMO" label="AI INFERENCE READY" size="sm" />
        }
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

        {/* Primary Selection / Preview Area */}
        <View style={styles.mainCardContainer}>
          {!selectedImage ? (
            /* Empty State / Image Picker Selector */
            <View style={styles.emptyCard}>
              {/* Technical Reticle Accents */}
              <View style={[styles.cornerMarker, styles.cmTL]} />
              <View style={[styles.cornerMarker, styles.cmTR]} />
              <View style={[styles.cornerMarker, styles.cmBL]} />
              <View style={[styles.cornerMarker, styles.cmBR]} />

              <View style={styles.emptyIconCircle}>
                <Ionicons name="camera" size={36} color={colors.accent} />
              </View>

              <Text style={styles.emptyTitle}>Capture wire image</Text>
              <Text style={styles.emptySubtitle}>
                or choose an image from your gallery
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
                  Make sure the inspection area is clearly visible.
                </Text>
              </View>

              {/* Action controls */}
              <View style={styles.previewActionGroup}>
                <Button
                  title="Analyze Wire"
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
                    <Text style={styles.retakeText}>Retake / Choose another</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Synthetic Dataset Specimens */}
        <View style={styles.specimensSection}>
          <View style={styles.specimensHeaderRow}>
            <Text style={styles.specimensTitle}>Synthetic Dataset Specimens</Text>
            <Text style={styles.specimensSubtitle}>Circle & square photometric test</Text>
          </View>

          <View style={styles.presetList}>
            {SAMPLE_WIRES.map((preset) => {
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
                      <Badge type={preset.condition} size="sm" />
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
                      )}
                    </View>
                    <Text style={styles.presetTitle} numberOfLines={1}>
                      {preset.title}
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
    marginLeft: spacing.xs,
    flex: 1,
  },
  mainCardContainer: {
    marginBottom: spacing.xl,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    position: 'relative',
    ...shadows.card,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  buttonStack: {
    width: '100%',
    gap: spacing.sm,
  },
  actionBtn: {
    marginBottom: 2,
  },
  previewContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  imageWrapper: {
    width: '100%',
    height: 260,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.navyPrimary,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  cornerMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.accent,
    zIndex: 3,
  },
  cmTL: {
    top: 10,
    left: 10,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
  },
  cmTR: {
    top: 10,
    right: 10,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
  },
  cmBL: {
    bottom: 10,
    left: 10,
    borderBottomWidth: 2.5,
    borderLeftWidth: 2.5,
  },
  cmBR: {
    bottom: 10,
    right: 10,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
  },
  instructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  instructionText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flex: 1,
    fontSize: 12,
  },
  previewActionGroup: {
    marginTop: spacing.lg,
  },
  retakeRow: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  retakeText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: '600',
  },
  specimensSection: {
    marginTop: spacing.xs,
  },
  specimensHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  specimensTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  specimensSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  presetList: {
    gap: spacing.sm,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.subtle,
  },
  presetCardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentLight,
  },
  presetThumbWrapper: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: colors.navyPrimary,
  },
  presetThumb: {
    width: '100%',
    height: '100%',
  },
  presetInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  presetBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  presetTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  presetSub: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
});
