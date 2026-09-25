import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { authStore } from '../services/authStore';

export const LoginScreen: React.FC = () => {
  const [identifier, setIdentifier] = useState('EMP-92041');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    setError(null);
    if (!identifier.trim()) {
      setError('Please enter your Employee ID or Email.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const res = authStore.login(identifier, password);
      if (!res.success) {
        setError(res.error || 'Authentication failed.');
      }
    }, 600);
  };

  const handleDemoLogin = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      authStore.demoLogin();
    }, 400);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Access Credentials',
      'For cold-chain safety audit compliance, contact your Hospital IT / Cold Chain Administrator at:\n\nsupport@safeshot.health\nInternal Ext: #4409',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Brand Section */}
          <View style={styles.headerSection}>
            <View style={styles.logoBadge}>
              <Ionicons name="shield-checkmark" size={32} color={colors.cyanVibrant} />
            </View>

            <View style={styles.titleRow}>
              <Text style={styles.appName}>Safe Shot</Text>
              <Badge type="DEMO" label="v1.0" size="sm" style={styles.versionBadge} />
            </View>

            <Text style={styles.appSubtitle}>Smart Vial Safety Inspection</Text>
            <Text style={styles.facilityNote}>Authorized Cold Chain & Immunization Access</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Sign in to your station</Text>

            {error && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle-outline" size={18} color={colors.statusDiscard} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Email / Employee ID Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email or Employee ID</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={19}
                  color={colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. EMP-92041 or user@hospital.org"
                  placeholderTextColor={colors.textMuted}
                  value={identifier}
                  onChangeText={(val) => {
                    setIdentifier(val);
                    if (error) setError(null);
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {identifier.length > 0 && (
                  <TouchableOpacity onPress={() => setIdentifier('')}>
                    <Ionicons name="close-circle" size={17} color={colors.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.inputLabel}>Password</Text>
                <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={19}
                  color={colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter station password"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Action */}
            <Button
              title="Log In to Safe Shot"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onPress={handleLogin}
              style={styles.loginBtn}
              icon={<Ionicons name="log-in-outline" size={20} color={colors.textInverse} />}
            />

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR PROTOTYPE TESTING</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Demo One-Tap Login Button */}
            <Button
              title="Instant Demo Login"
              variant="secondary"
              size="md"
              fullWidth
              onPress={handleDemoLogin}
              icon={<Ionicons name="flash-outline" size={18} color={colors.accent} />}
              style={styles.demoBtn}
            />
          </View>

          {/* Footer Security Notice */}
          <View style={styles.footer}>
            <Ionicons name="shield-half-outline" size={15} color={colors.textMuted} />
            <Text style={styles.footerText}>
              Encrypted Cold Chain Audit • ISO/IEC 17025 Compliant
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.navyPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.card,
    borderWidth: 1.5,
    borderColor: colors.navyBorder,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  appName: {
    ...typography.h1,
    color: colors.navyPrimary,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  versionBadge: {
    marginLeft: 8,
  },
  appSubtitle: {
    ...typography.bodyLarge,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: 4,
  },
  facilityNote: {
    ...typography.caption,
    color: colors.textMuted,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.floating,
  },
  cardHeading: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.statusDiscardBg,
    borderColor: colors.statusDiscardBorder,
    borderWidth: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.statusDiscard,
    marginLeft: spacing.xs,
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  forgotPasswordText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    height: '100%',
  },
  eyeButton: {
    padding: 6,
  },
  loginBtn: {
    marginTop: spacing.md,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    paddingHorizontal: spacing.sm,
    letterSpacing: 0.8,
  },
  demoBtn: {
    borderColor: colors.accent,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.caption,
    color: colors.textMuted,
    marginLeft: 6,
    fontSize: 11,
  },
});
