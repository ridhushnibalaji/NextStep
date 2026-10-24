import '@/global.css';

import { Platform } from 'react-native';

const palette = {
  text: '#1F2933',
  textSecondary: '#52606D',
  background: '#FAF8F4',
  white: '#FFFFFF',
  border: '#DDD7CC',
  tint: '#0F5E59',
  tintText: '#0F5E59',
  onTint: '#FFFFFF',
  soft: '#E5F0EE',
  danger: '#B42318',
} as const;

export const Colors = { light: palette, dark: palette };

export type ThemeColor = keyof typeof palette;

export const BrandFonts = {
  regular: 'PublicSans_400Regular',
  semibold: 'PublicSans_600SemiBold',
  bold: 'PublicSans_700Bold',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 96, android: 80, web: 96 }) ?? 0;
export const MaxContentWidth = 560;
