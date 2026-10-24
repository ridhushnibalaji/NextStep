import { NativeTabs } from 'expo-router/native-tabs';

import { Colors } from '@/constants/theme';
import { useLanguage } from '@/lib/i18n';

export default function AppTabs() {
  const colors = Colors.light;
  const { t } = useLanguage();

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.soft}
      labelStyle={{ selected: { color: colors.tintText } }}
      iconColor={{ selected: colors.tintText }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{t.tabs.home}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          src={require('@/assets/images/tabIcons/home.png')}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="ask">
        <NativeTabs.Trigger.Label>{t.tabs.ask}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'bubble.left.and.bubble.right', selected: 'bubble.left.and.bubble.right.fill' }}
          md="chat"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="nearby">
        <NativeTabs.Trigger.Label>{t.tabs.nearby}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'map', selected: 'map.fill' }} md="map" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="mail">
        <NativeTabs.Trigger.Label>{t.tabs.mail}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'envelope', selected: 'envelope.fill' }} md="mail" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
