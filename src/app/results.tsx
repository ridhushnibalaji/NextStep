import { Redirect, router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Card, Screen, Tag } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { documentsFor, useHousehold } from '@/lib/household';
import { openWebsite, YOUR_TEXAS_BENEFITS } from '@/lib/links';
import { useLanguage } from '@/lib/i18n';

export default function ResultsScreen() {
  const { t } = useLanguage();
  const { answers, result } = useHousehold();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  if (!answers || !result) return <Redirect href="/screener" />;

  const docs = documentsFor(result.matches, answers);
  const hasSnap = result.matches.some((match) => match.program === 'snap');

  return (
    <Screen inTabs={false} top={false}>
      <View style={styles.intro}>
        <ThemedText type="subtitle">
          {result.matches.length > 0 ? t.results.summary(result.matches.length) : t.results.none}
        </ThemedText>
      </View>

      {result.matches.map((match) => {
        const program = t.programs[match.program];
        return (
          <Card key={match.program}>
            <Tag label={match.level === 'likely' ? t.results.likely : t.results.possible} strong={match.level === 'likely'} />
            <ThemedText type="heading">{program.name}</ThemedText>
            <ThemedText>{program.covers}</ThemedText>
            <Pressable accessibilityRole="link" onPress={() => openWebsite(program.applyUrl)}>
              <ThemedText type="link">{program.howToApply}</ThemedText>
            </Pressable>
          </Card>
        );
      })}

      {result.adultsInCoverageGap && (
        <Card tone="outline">
          <ThemedText type="heading">{t.results.gapTitle}</ThemedText>
          <ThemedText type="small">{t.results.gapBody}</ThemedText>
        </Card>
      )}

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        {t.results.nextTitle}
      </ThemedText>

      <View>
        <Step number={1} title={t.results.step1Title}>
          {docs.map((doc) => (
            <Pressable
              key={doc}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: !!checked[doc] }}
              onPress={() => setChecked({ ...checked, [doc]: !checked[doc] })}
              style={styles.checkRow}>
              <View style={[styles.checkbox, checked[doc] && styles.checkboxOn]}>
                {checked[doc] && (
                  <ThemedText type="smallBold" themeColor="onTint">
                    ✓
                  </ThemedText>
                )}
              </View>
              <ThemedText type="small" style={[styles.fill, checked[doc] && styles.done]}>
                {t.docs[doc]}
              </ThemedText>
            </Pressable>
          ))}
        </Step>

        <Step number={2} title={t.results.step2Title}>
          <ThemedText type="small">{t.results.step2Body}</ThemedText>
          <Button label={t.results.step2Cta} onPress={() => openWebsite(YOUR_TEXAS_BENEFITS)} />
        </Step>

        {hasSnap && (
          <Step number={3} title={t.results.step3Title}>
            <ThemedText type="small">{t.results.step3Body}</ThemedText>
          </Step>
        )}

        <Step number={hasSnap ? 4 : 3} title={t.results.step4Title} last>
          <ThemedText type="small">{t.results.step4Body}</ThemedText>
          <Button label={t.results.step4Cta} variant="secondary" onPress={() => router.push('/mail')} />
        </Step>
      </View>

      <Button label={t.results.askAbout} onPress={() => router.push('/ask')} />
    </Screen>
  );
}

function Step({ number, title, children, last }: { number: number; title: string; children: ReactNode; last?: boolean }) {
  return (
    <View style={styles.step}>
      <View style={styles.rail}>
        <View style={styles.dot}>
          <ThemedText type="bold" themeColor="onTint">
            {number}
          </ThemedText>
        </View>
        {!last && <View style={styles.line} />}
      </View>
      <View style={styles.stepBody}>
        <ThemedText type="heading" style={styles.stepTitle}>
          {title}
        </ThemedText>
        {children}
      </View>
    </View>
  );
}

const ink = Colors.light.textSecondary;

const styles = StyleSheet.create({
  fill: { flex: 1 },
  intro: { gap: 8 },
  sectionTitle: { marginTop: 16 },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 4 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: ink,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.white,
  },
  checkboxOn: { backgroundColor: Colors.light.tint, borderColor: Colors.light.tint },
  done: { textDecorationLine: 'line-through', opacity: 0.6 },
  step: { flexDirection: 'row', gap: 16 },
  rail: { alignItems: 'center', width: 36 },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: { flex: 1, width: 2, backgroundColor: Colors.light.border, marginVertical: 4 },
  stepBody: { flex: 1, gap: 8, paddingBottom: 24 },
  stepTitle: { paddingTop: 4 },
});
