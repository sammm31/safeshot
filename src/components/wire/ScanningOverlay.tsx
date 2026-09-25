import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const STEPS = [
  'Processing image...',
  'Extracting wire boundaries...',
  'Analyzing dielectric insulation...',
  'Computing integrity metrics...',
];

export const ScanningOverlay: React.FC = () => {
  const scanAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Laser sweep
    const sweep = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    sweep.start();

    // Pulse
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    // Step cycle
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => {
      sweep.stop();
      pulse.stop();
      clearInterval(interval);
    };
  }, [scanAnim, pulseAnim]);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 120],
  });

  return (
    <View style={styles.container}>
      {/* Background tint overlay */}
      <View style={styles.backdrop} />

      {/* Sweeping Laser Line */}
      <Animated.View
        style={[
          styles.laser,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.laserCore} />
        <View style={styles.laserFlare} />
      </Animated.View>

      {/* Center Target Reticle */}
      <View style={styles.reticle}>
        <View style={[styles.corner, styles.tl]} />
        <View style={[styles.corner, styles.tr]} />
        <View style={[styles.corner, styles.bl]} />
        <View style={[styles.corner, styles.br]} />
        
        <Animated.View style={[styles.centerRing, { opacity: pulseAnim }]} />
      </View>

      {/* Text Indicators */}
      <View style={styles.statusBox}>
        <View style={styles.pulseRow}>
          <Animated.View style={[styles.statusDot, { opacity: pulseAnim }]} />
          <Text style={styles.title}>Analyzing wire...</Text>
        </View>
        <Text style={styles.stepText}>{STEPS[stepIndex]}</Text>
        <Text style={styles.subtext}>Processing image with computer vision</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(7, 13, 30, 0.78)',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  laser: {
    position: 'absolute',
    width: '94%',
    height: 2,
    zIndex: 12,
  },
  laserCore: {
    height: 3,
    backgroundColor: colors.cyanVibrant,
    shadowColor: colors.cyanVibrant,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
  laserFlare: {
    position: 'absolute',
    top: -12,
    left: 0,
    right: 0,
    height: 26,
    backgroundColor: 'rgba(0, 180, 216, 0.22)',
  },
  reticle: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: spacing.lg,
  },
  centerRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.cyanSoft,
    borderStyle: 'dashed',
  },
  corner: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderColor: colors.cyanVibrant,
  },
  tl: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  tr: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bl: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  br: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  statusBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    alignItems: 'center',
    minWidth: 240,
  },
  pulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.cyanVibrant,
    marginRight: spacing.xs,
  },
  title: {
    ...typography.h3,
    color: colors.textInverse,
    fontSize: 16,
  },
  stepText: {
    fontFamily: typography.mono.fontFamily,
    fontSize: 12,
    color: colors.cyanSoft,
    marginTop: 2,
  },
  subtext: {
    ...typography.caption,
    color: colors.textInverseSecondary,
    fontSize: 11,
    marginTop: 6,
  },
});
