import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useLanguage } from '@/lib/i18n';

const c = Colors.light;

export function Screen({ children, inTabs = true, top = true }: { children: ReactNode; inTabs?: boolean; top?: boolean }) {
  return (
    <SafeAreaView style={styles.screen} edges={top ? ['top'] : []}>
      <ScrollView
        contentInsetAdjustmentBehavior={top ? 'never' : 'automatic'}
        contentContainerStyle={[styles.scroll, { paddingBottom: (inTabs ? BottomTabInset : 0) + Spacing.five }]}
        keyboardShouldPersistTaps="handled">
        <View style={styles.column}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function Card({ children, tone = 'plain', style }: { children: ReactNode; tone?: 'plain' | 'outline'; style?: ViewStyle }) {
  return <View style={[styles.card, styles[tone], style]}>{children}</View>;
}

export function ListLink({ title, body, onPress }: { title: string; body?: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} style={({ pressed }) => [styles.listLink, pressed && styles.pressed]}>
      <View style={styles.listLinkText}>
        <ThemedText type="bold" themeColor="tintText">
          {title}
        </ThemedText>
        {body && (
          <ThemedText type="small" themeColor="textSecondary">
            {body}
          </ThemedText>
        )}
      </View>
      <ThemedText type="subtitle" themeColor="tintText">
        ›
      </ThemedText>
    </Pressable>
  );
}

export function Warning({ children }: { children: ReactNode }) {
  return (
    <View style={styles.warning}>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.warningIcon}>
        <ThemedText type="heading" themeColor="onTint">
          !
        </ThemedText>
      </View>
      <View style={styles.fill}>{children}</View>
    </View>
  );
}

export function Choice({
  label,
  selected,
  onPress,
  style,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.choice, selected && styles.choiceSelected, pressed && styles.pressed, style]}>
      <View style={[styles.radio, selected && styles.radioSelected]} />
      <ThemedText type="bold">{label}</ThemedText>
    </Pressable>
  );
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'link';
  disabled?: boolean;
  loading?: boolean;
}) {
  if (variant === 'link') {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} style={styles.linkButton}>
        <ThemedText type="link">{label}</ThemedText>
      </Pressable>
    );
  }
  const primary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        primary ? styles.buttonPrimary : styles.buttonSecondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      {loading ? (
        <ActivityIndicator color={primary ? c.onTint : c.tint} />
      ) : (
        <ThemedText type="bold" themeColor={primary ? 'onTint' : 'tintText'}>
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

export function Tag({ label, strong }: { label: string; strong?: boolean }) {
  return (
    <View style={[styles.tag, strong ? styles.tagStrong : styles.tagLight]}>
      <ThemedText type="label" themeColor={strong ? 'onTint' : 'tintText'}>
        {label}
      </ThemedText>
    </View>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${value * 100}%` }]} />
    </View>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}>
      <ThemedText type="smallBold" themeColor={selected ? 'onTint' : 'text'}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function Reveal({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setOpen(!open)}>
        <ThemedText type="link">{label}</ThemedText>
      </Pressable>
      {open && <View style={styles.revealBody}>{children}</View>}
    </View>
  );
}

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const other = language === 'en' ? 'es' : 'en';
  return (
    <Pressable accessibilityRole="button" onPress={() => setLanguage(other)} style={styles.toggle}>
      <ThemedText type="smallBold" themeColor="tintText">
        {other === 'es' ? 'Español' : 'English'}
      </ThemedText>
    </Pressable>
  );
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 15,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  const control = (text: string, next: number, disabled: boolean) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${text === '+' ? 'Increase' : 'Decrease'} ${label}`}
      disabled={disabled}
      onPress={() => onChange(next)}
      style={({ pressed }) => [styles.stepperButton, pressed && styles.pressed, disabled && styles.disabled]}>
      <ThemedText type="subtitle" themeColor="tintText">
        {text}
      </ThemedText>
    </Pressable>
  );
  return (
    <View style={styles.stepperRow}>
      <ThemedText type="bold" style={styles.fill}>
        {label}
      </ThemedText>
      {control('−', value - 1, value <= min)}
      <ThemedText type="subtitle" style={styles.stepperValue} accessibilityLiveRegion="polite">
        {value}
      </ThemedText>
      {control('+', value + 1, value >= max)}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  screen: { flex: 1, backgroundColor: c.background },
  scroll: { flexGrow: 1, alignItems: 'center', paddingHorizontal: 20, paddingTop: Spacing.three },
  column: { width: '100%', maxWidth: MaxContentWidth, gap: 20 },
  card: { gap: Spacing.two },
  plain: { borderTopWidth: 1, borderColor: c.border, paddingTop: 20 },
  outline: { borderWidth: 1.5, borderColor: c.tint, borderRadius: 4, padding: 16 },
  warning: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.three },
  listLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: c.border,
  },
  listLinkText: { flex: 1, gap: 2 },
  warningIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: c.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.4 },
  button: { minHeight: 56, borderRadius: 6, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  buttonPrimary: { backgroundColor: c.tint },
  buttonSecondary: { backgroundColor: c.white, borderWidth: 1.5, borderColor: c.tint },
  linkButton: { alignSelf: 'center', padding: Spacing.two },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: 60,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: c.border,
    backgroundColor: c.white,
  },
  choiceSelected: { borderColor: c.tint, backgroundColor: c.soft },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: c.textSecondary },
  radioSelected: { borderColor: c.tint, borderWidth: 7 },
  tag: { alignSelf: 'flex-start', borderRadius: 2, paddingHorizontal: 8, paddingVertical: 2 },
  tagStrong: { backgroundColor: c.tint },
  tagLight: { borderWidth: 1.5, borderColor: c.tint, paddingHorizontal: 6.5, paddingVertical: 0.5 },
  progressTrack: { height: 8, borderRadius: 0, overflow: 'hidden', backgroundColor: c.border },
  progressFill: { height: '100%', backgroundColor: c.tint },
  chip: {
    borderWidth: 1.5,
    borderColor: c.border,
    borderRadius: 6,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    backgroundColor: c.white,
  },
  chipSelected: { backgroundColor: c.tint, borderColor: c.tint },
  revealBody: { gap: Spacing.two, paddingTop: Spacing.two },
  toggle: { borderWidth: 1.5, borderColor: c.border, borderRadius: 6, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: c.white },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, minHeight: 60 },
  stepperButton: {
    width: 48,
    height: 48,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: c.tint,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.white,
  },
  stepperValue: { minWidth: 32, textAlign: 'center' },
});
