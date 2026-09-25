import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const WireIllustration: React.FC = () => {
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scanAnim]);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-55, 55],
  });

  return (
    <View style={styles.container}>
      {/* Background Reticle Grid */}
      <View style={styles.gridOverlay}>
        <View style={styles.gridLineH} />
        <View style={styles.gridLineV} />
        <View style={styles.calibRing} />
      </View>

      {/* Synthetic Inspection Specimen Geometry */}
      <View style={styles.specimenContainer}>
        {/* 1. Large OUTER CIRCLE representing the inspection area */}
        <View style={styles.outerCircle}>
          {/* 2. Clearly visible INNER SQUARE inside center of circle */}
          <View style={styles.innerSquare} />
        </View>
      </View>

      {/* Sweeping Laser Scan Line */}
      <Animated.View
        style={[
          styles.laserScanLine,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.laserCore} />
        <View style={styles.laserGlow} />
      </Animated.View>

      {/* Corner Calibration Marks */}
      <View style={[styles.cornerBracket, styles.topLeft]} />
      <View style={[styles.cornerBracket, styles.topRight]} />
      <View style={[styles.cornerBracket, styles.bottomLeft]} />
      <View style={[styles.cornerBracket, styles.bottomRight]} />

      {/* Telemetry Badge */}
      <View style={styles.telemetryBadge}>
        <View style={styles.pulseDot} />
        <Text style={styles.telemetryText}>SYNTHETIC CV: CIRCLE + SQUARE GEOMETRY</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 160,
    width: '100%',
    backgroundColor: '#070D1E',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginVertical: spacing.sm,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.3,
  },
  gridLineH: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#334155',
  },
  gridLineV: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: '#334155',
  },
  calibRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    borderStyle: 'dashed',
  },
  specimenContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  // 1. Large OUTER CIRCLE (Flat, simple visual region with sharp boundary)
  outerCircle: {
    width: 114,
    height: 114,
    borderRadius: 57,
    backgroundColor: '#2D3748', // Darker circle region
    borderWidth: 2,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 2. Clearly visible INNER SQUARE (Flat, simple visual region with sharp boundary)
  innerSquare: {
    width: 44,
    height: 44,
    backgroundColor: '#F8FAFC', // Lighter square region (Safe pattern)
    borderWidth: 1.5,
    borderColor: '#94A3B8',
  },
  laserScanLine: {
    position: 'absolute',
    width: '84%',
    height: 2,
    zIndex: 5,
  },
  laserCore: {
    height: 2,
    backgroundColor: colors.cyanVibrant,
  },
  laserGlow: {
    position: 'absolute',
    top: -4,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: 'rgba(0, 180, 216, 0.25)',
  },
  cornerBracket: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: colors.cyanVibrant,
    zIndex: 4,
  },
  topLeft: {
    top: 10,
    left: 10,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  topRight: {
    top: 10,
    right: 10,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bottomLeft: {
    bottom: 10,
    left: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bottomRight: {
    bottom: 10,
    right: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  telemetryBadge: {
    position: 'absolute',
    bottom: 8,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: '#334155',
    zIndex: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  telemetryText: {
    fontFamily: typography.mono.fontFamily,
    fontSize: 9,
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
});
