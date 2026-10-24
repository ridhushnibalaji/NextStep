import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Card, Screen, Tag, Warning } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { explainLetter, type LetterExplanation } from '@/lib/api';
import { useHousehold } from '@/lib/household';
import { useLanguage } from '@/lib/i18n';


export default function MailScreen() {
  const { t, language } = useLanguage();
  const { setLetterSummary } = useHousehold();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<LetterExplanation | null>(null);

  const pick = async (source: 'camera' | 'library') => {
    const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], base64: true, quality: 0.6 };
    if (source === 'camera') {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) return;
    }
    const picked =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
    const asset = picked.assets?.[0];
    if (picked.canceled || !asset?.base64) return;

    setPhotoUri(asset.uri);
    setExplanation(null);
    setError(null);
    setLoading(true);
    try {
      const result = await explainLetter({
        imageBase64: asset.base64,
        mimeType: asset.mimeType ?? 'image/jpeg',
        language,
      });
      setExplanation(result);
      if (result.isBenefitsLetter) {
        setLetterSummary(
          [result.program, result.summary, result.deadline && `Deadline: ${result.deadline}`, ...result.steps]
            .filter(Boolean)
            .join('\n'),
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t.mail.error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPhotoUri(null);
    setExplanation(null);
    setError(null);
  };

  return (
    <Screen>
      <ThemedText type="subtitle">{t.mail.title}</ThemedText>

      {!photoUri && (
        <View style={styles.summary}>
          <ThemedText>{t.mail.body}</ThemedText>
          <View style={styles.actions}>
            {process.env.EXPO_OS !== 'web' && <Button label={t.mail.takePhoto} onPress={() => pick('camera')} />}
            <Button
              label={t.mail.choosePhoto}
              variant={process.env.EXPO_OS === 'web' ? 'primary' : 'secondary'}
              onPress={() => pick('library')}
            />
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            {t.mail.privacy}
          </ThemedText>
        </View>
      )}

      {photoUri && (
        <Image source={{ uri: photoUri }} style={styles.photo} contentFit="cover" />
      )}

      {loading && (
        <ThemedText type="bold" accessibilityLiveRegion="polite">
          {t.mail.reading}
        </ThemedText>
      )}

      {error && (
        <ThemedText themeColor="danger">{error}</ThemedText>
      )}

      {explanation && !explanation.isBenefitsLetter && (
        <Card tone="outline">
          <ThemedText type="smallBold">{t.mail.notALetter}</ThemedText>
          <ThemedText>{explanation.summary}</ThemedText>
        </Card>
      )}

      {explanation?.isBenefitsLetter && (
        <>
          <View style={styles.summary}>
            <Tag label={t.mail.urgency[explanation.urgency]} strong={explanation.urgency === 'high'} />
            <ThemedText type="subtitle">{explanation.program}</ThemedText>
            <ThemedText>{explanation.summary}</ThemedText>
          </View>

          {explanation.deadline && (
            <Warning>
              <ThemedText type="bold">
                {t.mail.deadline}: {explanation.deadline}
              </ThemedText>
            </Warning>
          )}

          <Section title={t.mail.steps} items={explanation.steps} numbered />
          <Section title={t.mail.documents} items={explanation.documentsNeeded} />
          <Section title={t.mail.contacts} items={explanation.phoneNumbers} />

          <Button label={t.mail.askFollowUp} onPress={() => router.push('/ask')} />
        </>
      )}

      {photoUri && !loading && <Button label={t.mail.tryAnother} variant="link" onPress={reset} />}
    </Screen>
  );
}

function Section({ title, items, numbered }: { title: string; items: string[]; numbered?: boolean }) {
  if (items.length === 0) return null;
  return (
    <Card>
      <ThemedText type="heading">{title}</ThemedText>
      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          <ThemedText type="bold" style={styles.marker}>
            {numbered ? `${index + 1}.` : '•'}
          </ThemedText>
          <ThemedText style={styles.flex}>{item.replace(/^\s*(\d+[.)]|[-•*])\s+/, '')}</ThemedText>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  actions: { gap: Spacing.three, marginVertical: Spacing.two },
  photo: { width: '100%', height: 220, borderRadius: 4, borderWidth: 1, borderColor: Colors.light.border },
  summary: { gap: Spacing.two },
  item: { flexDirection: 'row', gap: Spacing.two },
  marker: { minWidth: 22 },
});
