import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { WireInspectionResult } from '../../types/inspection';
import { formatDateTime, getStatusTheme } from '../../utils/formatters';
import { Badge } from '../common/Badge';

export interface InspectionCardProps {
  inspection: WireInspectionResult;
  onPress: () => void;
}

export const InspectionCard: React.FC<InspectionCardProps> = ({
  inspection,
  onPress,
}) => {
  const { status, confidence, timestamp, imageUri, details } = inspection;
  const statusTheme = getStatusTheme(status);

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={styles.card}
    >
      {/* Wire Thumbnail with status glow border */}
      <View style={[styles.thumbnailContainer, { borderColor: statusTheme.borderColor }]}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.thumbnailFallback}>
            <Ionicons name="hardware-chip-outline" size={24} color={colors.accent} />
          </View>
        )}
      </View>

      {/* Details Column */}
      <View style={styles.infoColumn}>
        <View style={styles.statusRow}>
          <Badge type={status} size="sm" />
          <Text style={[styles.confidenceText, { color: statusTheme.color }]}>
            {confidence.toFixed(1)}%
          </Text>
        </View>

        <Text style={styles.wireTypeText} numberOfLines={1}>
          {details.wireType || 'Electrical Specimen'}
        </Text>

        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={13} color={colors.textMuted} />
          <Text style={styles.timestampText}>{formatDateTime(timestamp)}</Text>
        </View>
      </View>

      {/* Chevron indicator */}
      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0B132B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnailContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: colors.navyPrimary,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navySurface,
  },
  infoColumn: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  confidenceText: {
    fontFamily: typography.mono.fontFamily,
    fontSize: 13,
    fontWeight: '700',
  },
  wireTypeText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestampText: {
    ...typography.caption,
    color: colors.textMuted,
    marginLeft: 4,
    fontSize: 11,
  },
  arrowContainer: {
    paddingLeft: spacing.xs,
  },
});
