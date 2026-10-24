import { StyleSheet, Text, type TextProps } from 'react-native';

import { BrandFonts, Colors, ThemeColor } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'bold' | 'small' | 'smallBold' | 'label' | 'title' | 'subtitle' | 'heading' | 'link';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor = 'text', ...rest }: ThemedTextProps) {
  return <Text style={[{ color: Colors.light[themeColor] }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: { fontFamily: BrandFonts.regular, fontSize: 17, lineHeight: 26 },
  bold: { fontFamily: BrandFonts.semibold, fontSize: 17, lineHeight: 26 },
  small: { fontFamily: BrandFonts.regular, fontSize: 15, lineHeight: 22 },
  smallBold: { fontFamily: BrandFonts.semibold, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: BrandFonts.semibold, fontSize: 13, lineHeight: 18, letterSpacing: 0.4, textTransform: 'uppercase' },
  title: { fontFamily: BrandFonts.bold, fontSize: 32, lineHeight: 38 },
  subtitle: { fontFamily: BrandFonts.bold, fontSize: 24, lineHeight: 31 },
  heading: { fontFamily: BrandFonts.bold, fontSize: 19, lineHeight: 26 },
  link: { fontFamily: BrandFonts.semibold, fontSize: 16, lineHeight: 24, color: Colors.light.tintText, textDecorationLine: 'underline' },
});
