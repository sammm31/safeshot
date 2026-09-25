import { Platform, TextStyle } from 'react-native';

const monospaceFont = Platform.select({
  ios: 'Courier New',
  android: 'monospace',
  default: 'monospace',
});

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 18,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 16,
  },
  mono: {
    fontFamily: monospaceFont,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  monoLarge: {
    fontFamily: monospaceFont,
    fontSize: 15,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0.5,
  },
  button: {
    fontSize: 15,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0.2,
  },
  tag: {
    fontSize: 11,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 0.6,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },
};
