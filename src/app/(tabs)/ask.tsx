import { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Chip } from '@/components/ui';
import { BottomTabInset, BrandFonts, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { sendChat, type ChatMessage } from '@/lib/api';
import { describeHousehold, useHousehold } from '@/lib/household';
import { useLanguage } from '@/lib/i18n';

export default function AskScreen() {
  const { t, language } = useLanguage();
  const theme = useTheme();
  const { answers, result, letterSummary } = useHousehold();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const list = useRef<FlatList<ChatMessage>>(null);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || sending) return;
    const history: ChatMessage[] = [...messages, { role: 'user', content: question }];
    setMessages(history);
    setDraft('');
    setError(null);
    setSending(true);
    try {
      const { reply } = await sendChat({
        messages: history,
        language,
        household: answers && result ? describeHousehold(answers, result) : null,
        letter: letterSummary,
      });
      setMessages([...history, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages(messages);
      setDraft(question);
      setError(e instanceof Error ? e.message : t.ask.error);
    } finally {
      setSending(false);
    }
  };

  return (
    <ThemedView style={styles.fill}>
      <SafeAreaView style={styles.fill} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.fill}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={-BottomTabInset}>
          <View style={[styles.column, { paddingBottom: BottomTabInset }]}>
            <ThemedText type="subtitle" style={styles.title}>
              {t.ask.title}
            </ThemedText>

            <FlatList
              ref={list}
              style={styles.fill}
              data={messages}
              keyExtractor={(_, index) => String(index)}
              contentContainerStyle={styles.messages}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() => list.current?.scrollToEnd({ animated: true })}
              ListHeaderComponent={
                <View style={styles.intro}>
                  <ThemedText themeColor="textSecondary">{t.ask.intro}</ThemedText>
                  {messages.length === 0 &&
                    t.ask.suggestions.map((suggestion) => (
                      <Chip key={suggestion} label={suggestion} selected={false} onPress={() => send(suggestion)} />
                    ))}
                </View>
              }
              renderItem={({ item }) => {
                const mine = item.role === 'user';
                return (
                  <View
                    style={[
                      styles.bubble,
                      mine ? [styles.mine, { backgroundColor: theme.soft }] : [styles.theirs, { backgroundColor: theme.white, borderColor: theme.border }],
                    ]}>
                    <ThemedText selectable>{item.content}</ThemedText>
                  </View>
                );
              }}
              ListFooterComponent={
                <>
                  {sending && (
                    <ThemedText type="smallBold" themeColor="textSecondary" accessibilityLiveRegion="polite">
                      {t.ask.thinking}
                    </ThemedText>
                  )}
                  {error && <ThemedText themeColor="danger">{error}</ThemedText>}
                </>
              }
            />

            <View style={styles.composer}>
              <TextInput
                accessibilityLabel={t.ask.placeholder}
                multiline
                placeholder={t.ask.placeholder}
                placeholderTextColor={theme.textSecondary}
                style={[
                  styles.input,
                  { color: theme.text, borderColor: theme.textSecondary, backgroundColor: theme.white },
                ]}
                value={draft}
                onChangeText={setDraft}
              />
              <Button label={t.ask.send} onPress={() => send(draft)} disabled={!draft.trim()} loading={sending} />
            </View>
            <ThemedText type="small" themeColor="textSecondary" style={styles.disclaimer}>
              {t.ask.disclaimer}
            </ThemedText>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  column: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center', paddingHorizontal: Spacing.three },
  title: { paddingVertical: Spacing.three },
  messages: { gap: Spacing.two, paddingBottom: Spacing.three },
  intro: { gap: Spacing.two, marginBottom: Spacing.two, alignItems: 'flex-start' },
  bubble: { maxWidth: '88%', borderRadius: 16, borderWidth: 1, borderColor: 'transparent', padding: Spacing.three },
  mine: { alignSelf: 'flex-end', borderBottomRightRadius: 6 },
  theirs: { alignSelf: 'flex-start', borderBottomLeftRadius: 6 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two, paddingTop: Spacing.two },
  input: {
    flex: 1,
    minHeight: 52,
    maxHeight: 140,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
    fontFamily: BrandFonts.regular,
  },
  disclaimer: { textAlign: 'center', paddingVertical: Spacing.two },
});
