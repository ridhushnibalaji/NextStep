import { createContext, useContext, useState, type ReactNode } from 'react';

import { screen, type Answers, type Match, type ScreenResult } from '@/lib/eligibility';
import type { Strings } from '@/lib/i18n';

type HouseholdContextValue = {
  answers: Answers | null;
  result: ScreenResult | null;
  saveAnswers: (answers: Answers) => void;
  clear: () => void;
  letterSummary: string | null;
  setLetterSummary: (summary: string | null) => void;
  welcomed: boolean;
  setWelcomed: (welcomed: boolean) => void;
};

const HouseholdContext = createContext<HouseholdContextValue | null>(null);

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Answers | null>(null);
  const [letterSummary, setLetterSummary] = useState<string | null>(null);
  const [welcomed, setWelcomed] = useState(false);
  const result = answers ? screen(answers) : null;

  return (
    <HouseholdContext.Provider
      value={{
        answers,
        result,
        saveAnswers: setAnswers,
        clear: () => setAnswers(null),
        letterSummary,
        setLetterSummary,
        welcomed,
        setWelcomed,
      }}>
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  const value = useContext(HouseholdContext);
  if (!value) throw new Error('useHousehold must be used inside HouseholdProvider');
  return value;
}

export function documentsFor(matches: Match[], answers: Answers): (keyof Strings['docs'])[] {
  const docs: (keyof Strings['docs'])[] = ['id', 'income', 'address', 'ssn', 'immigration'];
  if (matches.some((m) => m.program === 'snap')) docs.push('bills');
  if (answers.pregnant) docs.push('pregnancy');
  if (answers.babies + answers.youngChildren + answers.schoolChildren > 0) docs.push('kids');
  return docs;
}

export function describeHousehold(answers: Answers, result: ScreenResult) {
  const programs = result.matches.map((m) => `${m.program} (${m.level})`).join(', ') || 'none';
  return [
    `Household size: ${answers.householdSize}`,
    `Monthly income before taxes: about $${answers.monthlyIncome} (${result.percentOfPoverty}% of the federal poverty level)`,
    `Children: ${answers.babies} under 1, ${answers.youngChildren} aged 1-5, ${answers.schoolChildren} aged 6-18`,
    `Someone pregnant: ${answers.pregnant ? 'yes' : 'no'}`,
    `Screener matches: ${programs}`,
    result.adultsInCoverageGap ? 'Adults appear to be in the Texas coverage gap.' : '',
  ]
    .filter(Boolean)
    .join('\n');
}
