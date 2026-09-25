import { Platform, ViewStyle } from 'react-native';

export const shadows = {
  none: {},
  subtle: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#0B132B',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    android: {
      elevation: 2,
    },
    default: {
      // web
      boxShadow: '0 1px 3px rgba(11, 19, 43, 0.06)',
    } as unknown as ViewStyle,
  }),
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#0B132B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    android: {
      elevation: 3,
    },
    default: {
      boxShadow: '0 2px 8px rgba(11, 19, 43, 0.08)',
    } as unknown as ViewStyle,
  }),
  floating: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#0B132B',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    android: {
      elevation: 6,
    },
    default: {
      boxShadow: '0 6px 16px rgba(11, 19, 43, 0.12)',
    } as unknown as ViewStyle,
  }),
};
