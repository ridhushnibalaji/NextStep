import { Redirect, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Logo } from '@/components/logo';
import { ThemedText } from '@/components/themed-text';
import { Button, Card, LanguageToggle, ListLink, Screen } from '@/components/ui';
import { useHousehold } from '@/lib/household';
import { useLanguage } from '@/lib/i18n';

export default function HomeScreen() {
  const { t } = useLanguage();
  const { result, welcomed } = useHousehold();

  if (!welcomed) return <Redirect href="/welcome" />;

  return (
    <Screen>
      <View style={styles.header}>
        <Logo name={t.appName} />
        <LanguageToggle />
      </View>

      <View style={styles.hero}>
        <ThemedText type="title">{t.home.heroTitle}</ThemedText>
      </View>

      <Card tone="outline">
        <ThemedText>
          <ThemedText type="bold">{t.home.statNumber}</ThemedText> {t.home.statBody}
        </ThemedText>
        <View style={styles.actions}>
          {result ? (
            <>
              <Button label={t.home.seeResults} onPress={() => router.push('/results')} />
              <Button label={t.home.redo} variant="secondary" onPress={() => router.push('/screener')} />
            </>
          ) : (
            <Button label={t.home.checkCta} onPress={() => router.push('/screener')} />
          )}
        </View>
      </Card>

      <View>
        <ListLink title={t.home.askTitle} body={t.home.askBody} onPress={() => router.push('/ask')} />
        <ListLink title={t.home.mailTitle} body={t.home.mailBody} onPress={() => router.push('/mail')} />
      </View>

      <ThemedText type="small" themeColor="textSecondary" style={styles.footer}>
        {t.notGovernment}
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  hero: { gap: 8, marginTop: 8 },
  actions: { gap: 12, marginTop: 8 },
  footer: { textAlign: 'center', marginTop: 16 },
});
