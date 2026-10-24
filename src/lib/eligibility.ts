const FPL_2026 = { base: 15_960, perExtraPerson: 5_680 };

export const LIMITS = {
  medicaidBaby: 203,
  medicaidYoungChild: 149,
  medicaidSchoolChild: 138,
  chip: 206,
  pregnancyMedicaid: 203,
  chipPerinatal: 207,
  parentMedicaid: 15,
  snapGross: 165,
  snapLikely: 130,
  wic: 185,
  schoolMealsFree: 130,
  schoolMealsReduced: 185,
  marketplaceMin: 100,
} as const;

export type Answers = {
  householdSize: number;
  monthlyIncome: number;
  babies: number;
  youngChildren: number;
  schoolChildren: number;
  pregnant: boolean;
  income?: IncomeDetails;
};

export type PayFrequency = 'weekly' | 'biweekly' | 'twiceMonthly' | 'monthly' | 'varies';
export type OtherIncome = 'childSupport' | 'unemployment' | 'socialSecurity' | 'disability' | 'veterans' | 'otherMoney';

export type Job = { amount: string; frequency: PayFrequency };

export type IncomeDetails = {
  hasJob: boolean | null;
  jobs: Job[];
  other: Partial<Record<OtherIncome, string>>;
  noOther: boolean;
};

const PAYCHECKS_PER_MONTH: Record<PayFrequency, number> = {
  weekly: 52 / 12,
  biweekly: 26 / 12,
  twiceMonthly: 2,
  monthly: 1,
  varies: 1,
};

function toNumber(text: string | undefined) {
  return Number((text ?? '').replace(/[^0-9.]/g, '')) || 0;
}

export function monthlyIncomeFrom(details: IncomeDetails) {
  let total = 0;
  if (details.hasJob) {
    for (const job of details.jobs) {
      total += toNumber(job.amount) * PAYCHECKS_PER_MONTH[job.frequency];
    }
  }
  for (const amount of Object.values(details.other)) {
    total += toNumber(amount);
  }
  return Math.round(total);
}

export type ProgramId =
  | 'childrenMedicaid'
  | 'chip'
  | 'pregnancy'
  | 'parentMedicaid'
  | 'snap'
  | 'wic'
  | 'schoolMeals'
  | 'marketplace';

export type Match = {
  program: ProgramId;
  level: 'likely' | 'possible';
};

export type ScreenResult = {
  percentOfPoverty: number;
  matches: Match[];
  adultsInCoverageGap: boolean;
};

export function povertyLine(householdSize: number) {
  return FPL_2026.base + FPL_2026.perExtraPerson * Math.max(0, householdSize - 1);
}

export function screen(answers: Answers): ScreenResult {
  const { householdSize, monthlyIncome, babies, youngChildren, schoolChildren, pregnant } = answers;
  const pct = ((monthlyIncome * 12) / povertyLine(householdSize)) * 100;
  const children = babies + youngChildren + schoolChildren;
  const matches: Match[] = [];

  const medicaidKids =
    (pct <= LIMITS.medicaidBaby ? babies : 0) +
    (pct <= LIMITS.medicaidYoungChild ? youngChildren : 0) +
    (pct <= LIMITS.medicaidSchoolChild ? schoolChildren : 0);
  const chipKids = pct <= LIMITS.chip ? children - medicaidKids : 0;
  if (medicaidKids > 0) {
    matches.push({ program: 'childrenMedicaid', level: 'likely' });
  }
  if (chipKids > 0) {
    matches.push({ program: 'chip', level: 'likely' });
  }

  if (pregnant && pct <= LIMITS.pregnancyMedicaid) {
    matches.push({ program: 'pregnancy', level: 'likely' });
  } else if (pregnant && pct <= LIMITS.chipPerinatal) {
    matches.push({ program: 'pregnancy', level: 'possible' });
  }

  if (children > 0 && pct <= LIMITS.parentMedicaid) {
    matches.push({ program: 'parentMedicaid', level: 'possible' });
  }

  if (pct <= LIMITS.snapLikely) {
    matches.push({ program: 'snap', level: 'likely' });
  } else if (pct <= LIMITS.snapGross) {
    matches.push({ program: 'snap', level: 'possible' });
  }

  if ((pregnant || babies + youngChildren > 0) && pct <= LIMITS.wic) {
    matches.push({ program: 'wic', level: 'likely' });
  }

  if (schoolChildren > 0 && pct <= LIMITS.schoolMealsReduced) {
    matches.push({ program: 'schoolMeals', level: 'likely' });
  }

  const parentCovered = matches.some((m) => m.program === 'parentMedicaid');
  if (pct >= LIMITS.marketplaceMin) {
    matches.push({ program: 'marketplace', level: 'possible' });
  }

  return {
    percentOfPoverty: Math.round(pct),
    matches,
    adultsInCoverageGap: pct < LIMITS.marketplaceMin && !parentCovered,
  };
}
