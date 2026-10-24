import { Tabs, TabList, TabTrigger, TabSlot, TabTriggerSlotProps, TabListProps } from 'expo-router/ui';
import { Pressable, View, StyleSheet } from 'react-native';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/lib/i18n';

import { ThemedText } from './themed-text';

export default function AppTabs() {
  const { t } = useLanguage();
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>{t.tabs.home}</TabButton>
          </TabTrigger>
          <TabTrigger name="ask" href="/ask" asChild>
            <TabButton>{t.tabs.ask}</TabButton>
          </TabTrigger>
          <TabTrigger name="nearby" href="/nearby" asChild>
            <TabButton>{t.tabs.nearby}</TabButton>
          </TabTrigger>
          <TabTrigger name="mail" href="/mail" asChild>
            <TabButton>{t.tabs.mail}</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, onPress }: TabTriggerSlotProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      onPress={onPress}
      style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      <View style={[styles.tabInner, isFocused && { backgroundColor: theme.soft }]}>
        <ThemedText type="smallBold" themeColor={isFocused ? 'tintText' : 'textSecondary'}>
          {children}
        </ThemedText>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const theme = useTheme();
  return (
    <View {...props} style={styles.tabListContainer}>
      <View
        style={[
          styles.innerContainer,
          { backgroundColor: theme.white, borderColor: theme.border },
        ]}>
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    padding: Spacing.one + Spacing.half,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexGrow: 1,
    maxWidth: MaxContentWidth,
  },
  tabButton: { flex: 1 },
  pressed: { opacity: 0.7 },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one + Spacing.half,
    paddingVertical: Spacing.two + Spacing.one,
    borderRadius: 12,
  },
});
