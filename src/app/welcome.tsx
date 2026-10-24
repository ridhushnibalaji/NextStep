import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Logo } from '@/components/logo';
import { ThemedText } from '@/components/themed-text';
import { Button, Choice, Screen } from '@/components/ui';
import { useHousehold } from '@/lib/household';
import { useLanguage } from '@/lib/i18n';

export default function WelcomeScreen() {
  const { t, language, setLanguage } = useLanguage();
  const { setWelcomed } = useHousehold();

  const start = () => {
    setWelcomed(true);
    router.replace('/');
  };

  return (
    <Screen inTabs={false}>
      <View style={styles.logo}>
        <Logo name={t.appName} />
      </View>
      <ThemedText type="title">{t.welcome.title}</ThemedText>

      <View style={styles.list}>
        <Choice label="English" selected={language === 'en'} onPress={() => setLanguage('en')} />
        <Choice label="Español" selected={language === 'es'} onPress={() => setLanguage('es')} />
      </View>

      <View style={styles.list}>
        {t.welcome.promises.map((promise) => (
          <ThemedText key={promise} themeColor="textSecondary">
            ✓  {promise}
          </ThemedText>
        ))}
      </View>

      <Button label={t.welcome.start} onPress={start} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  logo: { marginTop: 24 },
  list: { gap: 10 },
});
