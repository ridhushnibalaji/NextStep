import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Card, Chip, Choice, ProgressBar, Reveal, Screen, Stepper } from '@/components/ui';
import { BrandFonts, Colors } from '@/constants/theme';
import { monthlyIncomeFrom, type Answers, type IncomeDetails, type Job, type OtherIncome, type PayFrequency } from '@/lib/eligibility';
import { useHousehold } from '@/lib/household';
import { useLanguage } from '@/lib/i18n';

const FREQUENCIES: PayFrequency[] = ['weekly', 'biweekly', 'twiceMonthly', 'monthly', 'varies'];
const OTHER_INCOME: OtherIncome[] = ['childSupport', 'unemployment', 'socialSecurity', 'disability', 'veterans', 'otherMoney'];
const NEW_JOB: Job = { amount: '', frequency: 'biweekly' };

export default function ScreenerScreen() {
  const { t, language } = useLanguage();
  const { answers: saved, saveAnswers } = useHousehold();
  const [answers, setAnswers] = useState<Answers>(
    saved ?? { householdSize: 1, monthlyIncome: 0, babies: 0, youngChildren: 0, schoolChildren: 0, pregnant: false },
  );
  const [pregnantAnswered, setPregnantAnswered] = useState(saved !== null);
  const [income, setIncome] = useState<IncomeDetails>(saved?.income ?? { hasJob: null, jobs: [NEW_JOB], other: {}, noOther: false });
  const [stepIndex, setStepIndex] = useState(0);

  const steps = ['size', 'kids', 'pregnant', 'work'];
  if (income.hasJob) steps.push('jobs');
  steps.push('other');
  const step = steps[stepIndex];

  const update = (patch: Partial<Answers>) => setAnswers({ ...answers, ...patch });
  const updateIncome = (patch: Partial<IncomeDetails>) => setIncome({ ...income, ...patch });
  const updateJob = (index: number, patch: Partial<Job>) =>
    updateIncome({ jobs: income.jobs.map((job, i) => (i === index ? { ...job, ...patch } : job)) });

  const tooManyKids = answers.babies + answers.youngChildren + answers.schoolChildren >= answers.householdSize;
  const monthly = monthlyIncomeFrom(income);
  const hasOther = income.noOther || Object.keys(income.other).length > 0;

  const canContinue =
    (step === 'kids' && !tooManyKids) ||
    (step === 'jobs' && income.jobs.some((job) => job.amount !== '')) ||
    (step === 'other' && hasOther) ||
    step === 'size';

  const goTo = (index: number) => {
    if (index < steps.length) {
      setStepIndex(index);
      return;
    }
    saveAnswers({ ...answers, monthlyIncome: monthly, income });
    router.replace('/results');
  };

  const answerAndContinue = (save: () => void) => {
    save();
    setTimeout(() => goTo(stepIndex + 1), 200);
  };

  const toggleOther = (key: OtherIncome) => {
    const other = { ...income.other };
    if (key in other) delete other[key];
    else other[key] = '';
    updateIncome({ other, noOther: false });
  };

  const total = monthly.toLocaleString(language === 'es' ? 'es-US' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  return (
    <Screen inTabs={false} top={false}>
      <ProgressBar value={(stepIndex + 1) / steps.length} />

      {step === 'size' && (
        <>
          <Question title={t.screener.sizeQ} />
          <Card>
            <Stepper
              label={t.screener.people}
              value={answers.householdSize}
              min={1}
              onChange={(householdSize) => update({ householdSize })}
            />
          </Card>
          <Reveal label={t.screener.sizeWhatIf}>
            {t.screener.sizeWhatIfItems.map((item) => (
              <ThemedText key={item} type="small">
                {item}
              </ThemedText>
            ))}
          </Reveal>
        </>
      )}

      {step === 'kids' && (
        <>
          <Question title={t.screener.kidsQ} hint={t.screener.kidsHint} />
          <Card>
            <Stepper label={t.screener.babies} value={answers.babies} onChange={(babies) => update({ babies })} />
            <Stepper label={t.screener.young} value={answers.youngChildren} onChange={(youngChildren) => update({ youngChildren })} />
            <Stepper label={t.screener.school} value={answers.schoolChildren} onChange={(schoolChildren) => update({ schoolChildren })} />
          </Card>
          {tooManyKids && (
            <ThemedText type="smallBold" themeColor="danger">
              {t.screener.tooManyKids}
            </ThemedText>
          )}
        </>
      )}

      {step === 'pregnant' && (
        <>
          <Question title={t.screener.pregnantQ} />
          <YesNo
            value={pregnantAnswered ? answers.pregnant : null}
            yes={t.screener.yes}
            no={t.screener.no}
            onChoose={(pregnant) =>
              answerAndContinue(() => {
                update({ pregnant });
                setPregnantAnswered(true);
              })
            }
          />
        </>
      )}

      {step === 'work' && (
        <>
          <Question title={t.screener.workQ} />
          <YesNo value={income.hasJob} yes={t.screener.yes} no={t.screener.no} onChoose={(hasJob) => answerAndContinue(() => updateIncome({ hasJob }))} />
        </>
      )}

      {step === 'jobs' && (
        <>
          <Question title={t.screener.jobsQ} />
          {income.jobs.map((job, index) => (
            <Card key={index}>
              {income.jobs.length > 1 && <ThemedText type="heading">{t.screener.jobLabel(index + 1)}</ThemedText>}
              <MoneyInput label={t.screener.payAmount} value={job.amount} onChange={(amount) => updateJob(index, { amount })} />
              {job.frequency === 'varies' && <ThemedText type="small">{t.screener.variesHint}</ThemedText>}
              <ThemedText type="smallBold">{t.screener.howOften}</ThemedText>
              <View style={styles.chips}>
                {FREQUENCIES.map((frequency) => (
                  <Chip
                    key={frequency}
                    label={t.screener.freq[frequency]}
                    selected={job.frequency === frequency}
                    onPress={() => updateJob(index, { frequency })}
                  />
                ))}
              </View>
              {income.jobs.length > 1 && (
                <Button
                  label={t.screener.removeJob}
                  variant="link"
                  onPress={() => updateIncome({ jobs: income.jobs.filter((_, i) => i !== index) })}
                />
              )}
            </Card>
          ))}
          <Button label={t.screener.addJob} variant="secondary" onPress={() => updateIncome({ jobs: [...income.jobs, NEW_JOB] })} />
        </>
      )}

      {step === 'other' && (
        <>
          <Question title={t.screener.otherQ} hint={t.screener.otherHint} />
          <View style={styles.chips}>
            {OTHER_INCOME.map((key) => (
              <Chip key={key} label={t.screener.other[key]} selected={key in income.other} onPress={() => toggleOther(key)} />
            ))}
            <Chip
              label={t.screener.noneOfThese}
              selected={income.noOther}
              onPress={() => updateIncome({ other: {}, noOther: !income.noOther })}
            />
          </View>
          {OTHER_INCOME.filter((key) => key in income.other).map((key) => (
            <Card key={key}>
              <ThemedText type="smallBold">
                {t.screener.other[key]}, {t.screener.perMonth}
              </ThemedText>
              <MoneyInput
                label={t.screener.other[key]}
                value={income.other[key] ?? ''}
                onChange={(amount) => updateIncome({ other: { ...income.other, [key]: amount } })}
              />
            </Card>
          ))}
          {hasOther && <ThemedText type="bold">{t.screener.total(total)}</ThemedText>}
        </>
      )}

      <View style={styles.nav}>
        {step !== 'pregnant' && step !== 'work' && (
          <Button
            label={step === 'other' ? t.screener.finish : t.screener.next}
            onPress={() => goTo(stepIndex + 1)}
            disabled={!canContinue}
          />
        )}
        {stepIndex > 0 && <Button label={t.screener.back} variant="link" onPress={() => setStepIndex(stepIndex - 1)} />}
      </View>
    </Screen>
  );
}

function YesNo({ value, yes, no, onChoose }: { value: boolean | null; yes: string; no: string; onChoose: (value: boolean) => void }) {
  return (
    <View accessibilityRole="radiogroup" style={styles.list}>
      <Choice label={yes} selected={value === true} onPress={() => onChoose(true)} />
      <Choice label={no} selected={value === false} onPress={() => onChoose(false)} />
    </View>
  );
}

function Question({ title, hint }: { title: string; hint?: string }) {
  return (
    <View style={styles.question}>
      <ThemedText type="subtitle">{title}</ThemedText>
      {hint && <ThemedText themeColor="textSecondary">{hint}</ThemedText>}
    </View>
  );
}

function MoneyInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <View style={styles.moneyInput}>
      <ThemedText type="subtitle">$</ThemedText>
      <TextInput
        accessibilityLabel={label}
        inputMode="numeric"
        keyboardType="number-pad"
        placeholder="0"
        placeholderTextColor={Colors.light.textSecondary}
        style={styles.moneyText}
        value={value}
        onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  question: { gap: 8, marginTop: 8 },
  list: { gap: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moneyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.light.textSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.white,
  },
  moneyText: { flex: 1, fontSize: 24, fontFamily: BrandFonts.semibold, color: Colors.light.text, paddingVertical: 12 },
  nav: { gap: 8, marginTop: 16 },
});
