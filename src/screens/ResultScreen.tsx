import React from 'react';
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
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
import { ResultStatusCard } from '../components/wire/ResultStatusCard';
import { formatDateTime } from '../utils/formatters';

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;
type ResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Result'>;

export const ResultScreen: React.FC = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const navigation = useNavigation<ResultScreenNavigationProp>();

  const { inspection } = route.params;

  const handleInspectAnother = () => {
    navigation.navigate('MainTabs', {
      screen: 'CheckWireTab',
    });
  };

  const handleShareReport = async () => {
    try {
      await Share.share({
        title: `Safe Shot Inspection: ${inspection.status}`,
        message: `Safe Shot Report [${inspection.id}]\nStatus: ${inspection.status}\nConfidence: ${inspection.confidence.toFixed(1)}%\nTimestamp: ${formatDateTime(inspection.timestamp)}\nNotes: ${inspection.message}\n(Demo result — ML analysis will be connected later)`,
      });
    } catch (err) {
      console.warn('Share error:', err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Inspection Result"
        subtitle={`Specimen ID: ${inspection.id}`}
        showBack
        onBack={() => navigation.goBack()}
        rightAction={
          <Button
            title="Share"
            variant="ghost"
            size="sm"
            icon={<Ionicons name="share-outline" size={18} color={colors.accent} />}
            onPress={handleShareReport}
          />
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Analyzed Image Card */}
        <View style={styles.imageCard}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: inspection.imageUri }}
              style={styles.analyzedImage}
              resizeMode="cover"
            />

            {/* Technical Viewfinder Brackets */}
            <View style={[styles.cornerMarker, styles.cmTL]} />
            <View style={[styles.cornerMarker, styles.cmTR]} />
            <View style={[styles.cornerMarker, styles.cmBL]} />
            <View style={[styles.cornerMarker, styles.cmBR]} />

            {/* Status Stamp Overlay */}
            <View style={styles.stampBadge}>
              <Ionicons name="scan-circle-outline" size={14} color={colors.cyanVibrant} />
              <Text style={styles.stampText}>PROCESSED BY OPTICAL CV</Text>
            </View>
          </View>
        </View>

        {/* Prominent Inspection Result Card */}
        <View style={styles.resultCardSection}>
          <ResultStatusCard inspection={inspection} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Button
            title="Inspect Another Specimen"
            variant="primary"
            size="lg"
            fullWidth
            icon={<Ionicons name="camera-outline" size={20} color={colors.textInverse} />}
            onPress={handleInspectAnother}
          />

          <View style={styles.secondaryBtnRow}>
            <Button
              title="View All in History"
              variant="secondary"
              size="md"
              fullWidth
              icon={<Ionicons name="time-outline" size={18} color={colors.textPrimary} />}
              onPress={() => navigation.navigate('MainTabs', { screen: 'HistoryTab' })}
            />
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
  imageCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  imageWrapper: {
    width: '100%',
    height: 230,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.navyPrimary,
    position: 'relative',
  },
  analyzedImage: {
    width: '100%',
    height: '100%',
  },
  cornerMarker: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderColor: colors.accent,
    zIndex: 2,
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
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 19, 43, 0.88)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: '#334155',
    zIndex: 3,
  },
  stampText: {
    fontFamily: typography.mono.fontFamily,
    fontSize: 9,
    color: colors.cyanSoft,
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  resultCardSection: {
    marginBottom: spacing.xl,
  },
  actionSection: {
    marginBottom: spacing.xl,
  },
  secondaryBtnRow: {
    marginTop: spacing.sm,
  },
});
