import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authStore } from '../services/authStore';

export const LoginScreen: React.FC = () => {
  const [identifier, setIdentifier] = useState('EMP-92041');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isIdentifierFocused, setIsIdentifierFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    setError(null);
    if (!identifier.trim()) {
      setError('Please enter your Email or Employee ID.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const res = authStore.login(identifier, password);
      if (!res.success) {
        setError(res.error || 'Authentication failed.');
      }
    }, 500);
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
      'Reset Password',
      'For cold-chain safety audit compliance, contact your hospital administrator or cold-chain officer:\n\nEmail: support@safeshot.health\nPhone: ext. #4409',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#06152B" />

      {/* Decorative Clinical Atmosphere & Bokeh Elements (from Pinterest reference) */}
      <View style={styles.backgroundDecor} pointerEvents="none">
        <View style={styles.topBackdropGlow} />
        <View style={styles.bokehDot1} />
        <View style={styles.bokehDot2} />
        <View style={styles.bokehDot3} />
        <View style={styles.bokehDot4} />
        <View style={styles.bokehDot5} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Top Brand & Circular Emblem Section (Exact Pinterest Reference Layout) */}
            <View style={styles.topSection}>
              {/* Dual-Color Arc Circular Emblem */}
              <View style={styles.emblemContainer}>
                {/* Left Arc: Vibrant Clinical Green */}
                <View style={[styles.arcSegment, styles.arcLeft]} />
                {/* Right Arc: Electric Medical Blue */}
                <View style={[styles.arcSegment, styles.arcRight]} />

                {/* Inner White/Dark Emblem Shield Center */}
                <View style={styles.emblemCore}>
                  <View style={styles.vialDropperIcon}>
                    <Ionicons name="shield-checkmark" size={36} color="#00B4D8" />
                  </View>
                </View>

                {/* Subtle Pulse Ring */}
                <View style={styles.emblemPulseRing} />
              </View>

              {/* Brand Typography */}
              <Text style={styles.brandTitle}>Safe Shot</Text>
              <Text style={styles.brandSubtitle}>Smart Vial Safety Inspection</Text>
              <Text style={styles.stationTag}>Cold Chain Quality Verification</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              {/* Error Message */}
              {error && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color="#EF4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Input 1: Email / Employee ID (Minimalist Underline Style from Reference) */}
              <View style={styles.inputRow}>
                <View style={styles.inputIconCol}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={isIdentifierFocused ? '#38BDF8' : '#94A3B8'}
                  />
                </View>
                <View style={styles.inputTextCol}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Email / Employee ID"
                    placeholderTextColor="rgba(148, 163, 184, 0.75)"
                    value={identifier}
                    onChangeText={(text) => {
                      setIdentifier(text);
                      if (error) setError(null);
                    }}
                    onFocus={() => setIsIdentifierFocused(true)}
                    onBlur={() => setIsIdentifierFocused(false)}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {identifier.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setIdentifier('')}
                    style={styles.clearBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="close-circle" size={17} color="rgba(148, 163, 184, 0.6)" />
                  </TouchableOpacity>
                )}
              </View>
              {/* Underline Indicator */}
              <View
                style={[
                  styles.underline,
                  isIdentifierFocused && styles.underlineActive,
                ]}
              />

              {/* Input 2: Password (Minimalist Underline Style from Reference) */}
              <View style={[styles.inputRow, styles.passwordInputRow]}>
                <View style={styles.inputIconCol}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={isPasswordFocused ? '#38BDF8' : '#94A3B8'}
                  />
                </View>
                <View style={styles.inputTextCol}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor="rgba(148, 163, 184, 0.75)"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (error) setError(null);
                    }}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {/* Show/Hide Password Toggle */}
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeToggleBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={showPassword ? '#38BDF8' : '#94A3B8'}
                  />
                </TouchableOpacity>
              </View>
              {/* Underline Indicator */}
              <View
                style={[
                  styles.underline,
                  isPasswordFocused && styles.underlineActive,
                ]}
              />

              {/* Forgot Password Link (Aligned Right) */}
              <View style={styles.forgotPasswordRow}>
                <TouchableOpacity
                  onPress={handleForgotPassword}
                  activeOpacity={0.75}
                  style={styles.forgotPasswordBtn}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Primary Action Button (Bold Electric Blue from Reference) */}
              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                activeOpacity={0.85}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? 'AUTHENTICATING...' : 'LOGIN'}
                </Text>
              </TouchableOpacity>

              {/* Secondary Demo Login Action */}
              <TouchableOpacity
                style={styles.demoLoginButton}
                onPress={handleDemoLogin}
                activeOpacity={0.8}
              >
                <Ionicons name="flash" size={14} color="#38BDF8" style={styles.demoIcon} />
                <Text style={styles.demoLoginText}>Demo Login (Instant Access)</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Clinical Station Footer */}
            <View style={styles.footerSection}>
              <View style={styles.footerBadge}>
                <View style={styles.secureDot} />
                <Text style={styles.footerBadgeText}>ENCRYPTED CLINICAL AUDIT</Text>
              </View>
              <Text style={styles.footerNote}>
                WHO VVM PQS Compliant • ISO/IEC 17025 Ready
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#07182C', // Deep Clinical Navy from Pinterest reference
  },
  backgroundDecor: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  topBackdropGlow: {
    position: 'absolute',
    top: -100,
    left: '10%',
    width: '80%',
    height: 340,
    borderRadius: 170,
    backgroundColor: 'rgba(2, 132, 199, 0.18)',
    transform: [{ scaleX: 1.4 }],
  },
  // Soft Bokeh Dots imitating the laboratory lighting in Pinterest design
  bokehDot1: {
    position: 'absolute',
    top: 90,
    left: 28,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(56, 189, 248, 0.25)',
  },
  bokehDot2: {
    position: 'absolute',
    top: 130,
    right: 36,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  bokehDot3: {
    position: 'absolute',
    top: 210,
    left: 45,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  bokehDot4: {
    position: 'absolute',
    top: 260,
    right: 50,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.18)',
  },
  bokehDot5: {
    position: 'absolute',
    bottom: 120,
    left: 40,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    paddingHorizontal: 28,
    paddingTop: Platform.OS === 'android' ? 24 : 16,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },
  // Top Emblem & Brand Section
  topSection: {
    alignItems: 'center',
    paddingTop: 16,
    marginBottom: 24,
  },
  emblemContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  // Dual-color arc from Pinterest reference: green on left, blue on right
  arcSegment: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3.5,
  },
  arcLeft: {
    borderColor: '#10B981', // Clinical Emerald/Lime Green
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  arcRight: {
    borderColor: '#0284C7', // Electric Medical Blue
    borderLeftColor: 'transparent',
    borderTopColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  emblemPulseRing: {
    position: 'absolute',
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.18)',
  },
  emblemCore: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#0B213D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    elevation: 6,
    shadowColor: '#00B4D8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  vialDropperIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#38BDF8', // Cyan soft
    letterSpacing: 0.2,
    marginBottom: 4,
    textAlign: 'center',
  },
  stationTag: {
    fontSize: 11,
    color: '#94A3B8',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  // Form Section
  formContainer: {
    width: '100%',
    paddingVertical: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#F87171',
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
  },
  // Minimalist Underline Input Fields (Pinterest signature aesthetic)
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  passwordInputRow: {
    marginTop: 18,
  },
  inputIconCol: {
    width: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  inputTextCol: {
    flex: 1,
  },
  textInput: {
    fontSize: 15,
    color: '#FFFFFF',
    paddingVertical: 4,
    height: 36,
  },
  clearBtn: {
    padding: 4,
  },
  eyeToggleBtn: {
    padding: 6,
  },
  underline: {
    height: 1.5,
    backgroundColor: 'rgba(148, 163, 184, 0.35)',
    width: '100%',
    borderRadius: 1,
  },
  underlineActive: {
    backgroundColor: '#38BDF8', // Luminous Cyan highlight on focus
    height: 2,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  forgotPasswordRow: {
    alignItems: 'flex-end',
    marginTop: 12,
    marginBottom: 26,
  },
  forgotPasswordBtn: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  // Primary Button: Solid Electric Blue (from Pinterest reference)
  primaryButton: {
    backgroundColor: '#0284C7', // Electric Medical Blue
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  // Demo Login Option
  demoLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    backgroundColor: 'rgba(2, 132, 199, 0.12)',
  },
  demoIcon: {
    marginRight: 6,
  },
  demoLoginText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#38BDF8',
    letterSpacing: 0.3,
  },
  // Footer
  footerSection: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 4,
  },
  footerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 33, 58, 0.8)',
    borderColor: 'rgba(56, 189, 248, 0.25)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
  },
  secureDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  footerBadgeText: {
    fontSize: 9,
    fontFamily: Platform.select({ android: 'monospace', default: 'monospace' }),
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  footerNote: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
  },
});
