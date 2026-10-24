import { createContext, useContext, useState, type ReactNode } from 'react';

import type { ProgramId } from '@/lib/eligibility';

export type Language = 'en' | 'es';

type ProgramText = {
  name: string;
  covers: string;
  howToApply: string;
  applyUrl: string;
};

const en = {
  appName: 'Next Step',
  notGovernment: 'Next Step is not a government website. Need help now? Call 2-1-1.',
  welcome: {
    title: 'Find out what help your family can get.',
    promises: ['Takes 2 minutes', 'No Social Security number', 'Nothing is saved'],
    start: 'Start',
  },
  home: {
    heroTitle: 'What help can your Texas family get?',
    statNumber: '56%',
    statBody: 'of uninsured Texans qualify for free or low-cost health coverage.',
    checkCta: 'Check what you qualify for',
    seeResults: 'See my results',
    redo: 'Start over',
    askTitle: 'Ask a Question',
    askBody: 'Get answers about Medicaid, SNAP, WIC, and renewals.',
    mailTitle: 'Understand Your Mail',
    mailBody: 'Take a photo of a letter, bill, or form to learn what it means and what to do.',
  },
  tabs: {
    home: 'Home',
    ask: 'Ask',
    mail: 'Mail',
    nearby: 'Nearby',
  },
  screener: {
    title: 'Quick Check',
    sizeQ: 'How many people live in your home?',
    people: 'People',
    kidsQ: 'How many children in your home are…',
    kidsHint: 'Count children under 19 only.',
    babies: 'Under 1 year old',
    young: '1 to 5 years old',
    school: '6 to 18 years old',
    pregnantQ: 'Is anyone in your home pregnant?',
    sizeWhatIf: 'Shared custody, relatives, or roommates?',
    sizeWhatIfItems: [
      'Shared custody: count a child who lives with you at least half the time.',
      'Grandparents or other relatives: count them if you share food and money.',
      'Roommates: don’t count them if you keep your money and food separate.',
    ],
    workQ: 'Does anyone in your home have a job?',
    jobsQ: 'How much is each paycheck?',
    jobLabel: (n: number) => `Job ${n}`,
    payAmount: 'Amount per paycheck',
    howOften: 'How often is it paid?',
    freq: {
      weekly: 'Every week',
      biweekly: 'Every 2 weeks',
      twiceMonthly: 'Twice a month',
      monthly: 'Once a month',
      varies: 'It changes',
    },
    variesHint: 'Enter a normal month’s total.',
    addJob: '+ Add another job',
    removeJob: 'Remove',
    otherQ: 'Does your home get any other money?',
    otherHint: 'Tap all that apply.',
    other: {
      childSupport: 'Child support',
      unemployment: 'Unemployment',
      socialSecurity: 'Social Security or SSI',
      disability: 'Disability',
      veterans: 'Veterans’ benefits',
      otherMoney: 'Other money',
    },
    noneOfThese: 'None of these',
    perMonth: 'a month',
    total: (amount: string) => `Total: about ${amount} a month`,
    yes: 'Yes',
    no: 'No',
    back: 'Back',
    next: 'Continue',
    finish: 'See results',
    tooManyKids: 'The number of children is more than the number of people in your home.',
  },
  results: {
    title: 'Your Results',
    summary: (n: number) =>
      n === 1 ? 'Your family may qualify for 1 program.' : `Your family may qualify for ${n} programs.`,
    none: 'We didn’t find a match from your answers, but rules have many exceptions. You can still apply, or call 2-1-1 to talk to someone.',
    likely: 'Likely',
    possible: 'Possible',
    gapTitle: 'Health Coverage for Adults',
    gapBody:
      'Texas didn’t expand Medicaid, so many adults with very low income can’t get coverage. Community health centers charge based on income. Call 2-1-1 to find one.',
    askAbout: 'Ask questions about my results',
    nextTitle: 'What to Do Now',
    step1Title: 'Get Your Papers Ready',
    step2Title: 'Apply for Free',
    step2Body: 'One application at Your Texas Benefits covers most of these. You can also call 2-1-1.',
    step2Cta: 'Open Your Texas Benefits',
    step3Title: 'Answer the Interview Call',
    step3Body:
      'HHSC calls for a short SNAP interview. If you miss it, call back. A missed interview can mean a denial.',
    step4Title: 'Keep Your Benefits',
    step4Body: 'Most programs must be renewed. When a letter comes, take a photo of it in Next Step.',
    step4Cta: 'Understand your mail',
  },
  programs: {
    childrenMedicaid: {
      name: 'Children’s Medicaid',
      covers: 'Free health coverage: checkups, doctor visits, medicine, dental, and vision.',
      howToApply: 'Apply online at Your Texas Benefits, by phone at 2-1-1, or by mail.',
      applyUrl: 'https://www.yourtexasbenefits.com',
    },
    chip: {
      name: 'CHIP (Children’s Health Insurance Program)',
      covers: 'Low-cost health coverage for children. Yearly fees are $50 or less per family.',
      howToApply: 'Same application as Medicaid at Your Texas Benefits.',
      applyUrl: 'https://www.yourtexasbenefits.com',
    },
    pregnancy: {
      name: 'Medicaid / CHIP for pregnancy',
      covers: 'Prenatal care, delivery, and care after birth (up to 12 months).',
      howToApply: 'Apply at Your Texas Benefits as soon as you know you’re pregnant.',
      applyUrl: 'https://www.yourtexasbenefits.com',
    },
    parentMedicaid: {
      name: 'Medicaid for parents',
      covers: 'Health coverage for parents and caretakers with very low income.',
      howToApply: 'Apply at Your Texas Benefits.',
      applyUrl: 'https://www.yourtexasbenefits.com',
    },
    snap: {
      name: 'SNAP (food benefits)',
      covers: 'Money every month on a Lone Star Card to buy groceries.',
      howToApply: 'Apply at Your Texas Benefits. You’ll have a short interview, usually by phone.',
      applyUrl: 'https://www.yourtexasbenefits.com',
    },
    wic: {
      name: 'WIC',
      covers: 'Healthy foods, formula, and breastfeeding help for pregnant women and children under 5.',
      howToApply: 'Find a WIC clinic near you and make an appointment.',
      applyUrl: 'https://texaswic.org',
    },
    schoolMeals: {
      name: 'Free or reduced-price school meals',
      covers: 'Breakfast and lunch at school.',
      howToApply:
        'Ask your child’s school for a meal application. If you get SNAP, your kids usually qualify automatically.',
      applyUrl: 'https://squaremeals.org',
    },
    marketplace: {
      name: 'Health Insurance Marketplace',
      covers: 'Health plans for adults, with tax credits that lower the monthly cost based on income.',
      howToApply: 'Compare plans at HealthCare.gov. Free local helpers (“navigators”) can walk you through it.',
      applyUrl: 'https://www.healthcare.gov',
    },
  } satisfies Record<ProgramId, ProgramText>,
  docs: {
    id: 'Photo ID for the adult applying (driver’s license, state ID, or passport)',
    income: 'Proof of income from the last 30 days (pay stubs, employer letter)',
    address: 'Proof of where you live (lease, utility bill, or mail)',
    ssn: 'Social Security numbers, only for the people who are applying',
    immigration: 'Immigration papers, only for applicants who aren’t U.S. citizens',
    bills: 'Rent, utility, and child care bills (these can raise your SNAP amount)',
    pregnancy: 'Proof of pregnancy from a clinic or doctor',
    kids: 'Birth certificates for children',
  },
  ask: {
    title: 'Ask a Question',
    placeholder: 'Type your question…',
    send: 'Send',
    thinking: 'Thinking…',
    intro: 'Questions about Medicaid, CHIP, SNAP, WIC, or mail you got.',
    suggestions: [
      'My Medicaid renewal letter came. What do I do?',
      'Can my kids get Medicaid if I’m not a citizen?',
      'How do I apply for SNAP?',
    ],
    disclaimer: 'Answers can have mistakes. Check important details with HHSC or 2-1-1.',
    error: 'Something went wrong. Please try again.',
  },
  nearby: {
    title: 'Help Near You',
    intro: 'Only Dallas supported right now.',
    filters: {
      all: 'All',
      wic: 'WIC',
      clinic: 'Clinics',
      food: 'Food',
      benefits: 'Benefits help',
    },
    types: {
      wic: 'WIC clinic',
      clinic: 'Health center',
      food: 'Food pantry',
      benefits: 'Benefits help',
    },
    call: 'Call',
    directions: 'Directions',
    website: 'Website',
    checked: 'Checked against official websites in October 2026.',
  },
  mail: {
    title: 'Understand Your Mail',
    body: 'Take a clear photo of a letter, bill, or form. We’ll explain what it says and what to do.',
    privacy: 'Your photo isn’t saved.',
    takePhoto: 'Take a photo',
    choosePhoto: 'Choose a photo',
    reading: 'Reading your mail…',
    deadline: 'Deadline',
    steps: 'What to Do',
    documents: 'What to Send',
    contacts: 'Phone Numbers',
    urgency: {
      high: 'Act soon',
      medium: 'Action needed',
      low: 'For your information',
    },
    notALetter: 'We couldn’t find a letter, bill, or form in this photo. Try another photo.',
    askFollowUp: 'Ask a question about this',
    tryAnother: 'Try another photo',
    error: 'We couldn’t read that photo. Try again with better lighting.',
  },
};
export type Strings = typeof en;

const es: Strings = {
  appName: 'Next Step',
  notGovernment: 'Next Step no es un sitio del gobierno. ¿Necesita ayuda ahora? Llame al 2-1-1.',
  welcome: {
    title: 'Vea qué ayuda puede recibir su familia.',
    promises: ['Toma unos 2 minutos', 'Sin número de Seguro Social', 'No se guarda nada'],
    start: 'Empezar',
  },
  home: {
    heroTitle: '¿Qué ayuda puede recibir su familia en Texas?',
    statNumber: '56%',
    statBody: 'de los texanos sin seguro califican para cobertura médica gratis o de bajo costo.',
    checkCta: 'Revisar para qué califica',
    seeResults: 'Ver mis resultados',
    redo: 'Empezar de nuevo',
    askTitle: 'Haga una pregunta',
    askBody: 'Respuestas sobre Medicaid, SNAP, WIC y renovaciones.',
    mailTitle: 'Entienda su correo',
    mailBody: 'Tome una foto de una carta, factura o formulario para saber qué significa y qué hacer.',
  },
  tabs: {
    home: 'Inicio',
    ask: 'Preguntar',
    mail: 'Correo',
    nearby: 'Cerca',
  },
  screener: {
    title: 'Revisión rápida',
    sizeQ: '¿Cuántas personas viven en su casa?',
    people: 'Personas',
    kidsQ: '¿Cuántos niños en su casa tienen…',
    kidsHint: 'Cuente solo a menores de 19 años.',
    babies: 'Menos de 1 año',
    young: 'De 1 a 5 años',
    school: 'De 6 a 18 años',
    pregnantQ: '¿Hay alguien embarazada en su casa?',
    sizeWhatIf: '¿Custodia compartida, parientes o compañeros de casa?',
    sizeWhatIfItems: [
      'Custodia compartida: cuente a un niño que vive con usted al menos la mitad del tiempo.',
      'Abuelos u otros parientes: cuéntelos si comparten la comida y el dinero.',
      'Compañeros de casa: no los cuente si su dinero y comida son aparte.',
    ],
    workQ: '¿Alguien en su casa tiene trabajo?',
    jobsQ: '¿Cuánto es cada cheque de pago?',
    jobLabel: (n) => `Trabajo ${n}`,
    payAmount: 'Cantidad por cheque',
    howOften: '¿Cada cuánto le pagan?',
    freq: {
      weekly: 'Cada semana',
      biweekly: 'Cada 2 semanas',
      twiceMonthly: 'Dos veces al mes',
      monthly: 'Una vez al mes',
      varies: 'Cambia',
    },
    variesHint: 'Escriba el total de un mes normal.',
    addJob: '+ Agregar otro trabajo',
    removeJob: 'Quitar',
    otherQ: '¿Su casa recibe otro dinero?',
    otherHint: 'Toque todos los que apliquen.',
    other: {
      childSupport: 'Manutención de hijos',
      unemployment: 'Desempleo',
      socialSecurity: 'Seguro Social o SSI',
      disability: 'Discapacidad',
      veterans: 'Beneficios de veteranos',
      otherMoney: 'Otro dinero',
    },
    noneOfThese: 'Ninguno',
    perMonth: 'al mes',
    total: (amount) => `Total: unos ${amount} al mes`,
    yes: 'Sí',
    no: 'No',
    back: 'Atrás',
    next: 'Continuar',
    finish: 'Ver resultados',
    tooManyKids: 'El número de niños es mayor que el número de personas en su casa.',
  },
  results: {
    title: 'Sus resultados',
    summary: (n) =>
      n === 1 ? 'Su familia podría calificar para 1 programa.' : `Su familia podría calificar para ${n} programas.`,
    none: 'No encontramos un programa según sus respuestas, pero las reglas tienen muchas excepciones. Aún puede solicitar, o llame al 2-1-1 para hablar con alguien.',
    likely: 'Probable',
    possible: 'Posible',
    gapTitle: 'Seguro médico para adultos',
    gapBody:
      'Texas no expandió Medicaid, así que muchos adultos con ingresos muy bajos no pueden obtener cobertura. Los centros de salud comunitarios cobran según sus ingresos. Llame al 2-1-1 para encontrar uno.',
    askAbout: 'Hacer preguntas sobre mis resultados',
    nextTitle: 'Qué hacer ahora',
    step1Title: 'Tenga sus papeles listos',
    step2Title: 'Solicite gratis',
    step2Body: 'Una sola solicitud en Your Texas Benefits cubre la mayoría. También puede llamar al 2-1-1.',
    step2Cta: 'Abrir Your Texas Benefits',
    step3Title: 'Conteste la llamada de entrevista',
    step3Body:
      'HHSC le llama para una entrevista corta de SNAP. Si no contesta, devuelva la llamada. Perder la entrevista puede significar una negación.',
    step4Title: 'Mantenga sus beneficios',
    step4Body: 'La mayoría de los programas se renuevan. Cuando llegue una carta, tómele una foto en Next Step.',
    step4Cta: 'Entender su correo',
  },
  programs: {
    childrenMedicaid: {
      name: 'Medicaid para niños',
      covers: 'Cobertura médica gratis: chequeos, visitas al doctor, medicinas, dental y visión.',
      howToApply: 'Solicite en línea en Your Texas Benefits, por teléfono al 2-1-1, o por correo.',
      applyUrl: 'https://www.yourtexasbenefits.com',
    },
    chip: {
      name: 'CHIP (Programa de Seguro Médico para Niños)',
      covers: 'Cobertura médica de bajo costo para niños. La cuota anual es de $50 o menos por familia.',
      howToApply: 'Es la misma solicitud que Medicaid, en Your Texas Benefits.',
      applyUrl: 'https://www.yourtexasbenefits.com',
    },
    pregnancy: {
      name: 'Medicaid / CHIP durante el embarazo',
      covers: 'Cuidado prenatal, el parto y cuidado después del nacimiento (hasta 12 meses).',
      howToApply: 'Solicite en Your Texas Benefits en cuanto sepa que está embarazada.',
      applyUrl: 'https://www.yourtexasbenefits.com',
    },
    parentMedicaid: {
      name: 'Medicaid para padres',
      covers: 'Cobertura médica para padres y cuidadores con ingresos muy bajos.',
      howToApply: 'Solicite en Your Texas Benefits.',
      applyUrl: 'https://www.yourtexasbenefits.com',
    },
    snap: {
      name: 'SNAP (beneficios de comida)',
      covers: 'Dinero cada mes en una tarjeta Lone Star para comprar comida.',
      howToApply: 'Solicite en Your Texas Benefits. Tendrá una entrevista corta, casi siempre por teléfono.',
      applyUrl: 'https://www.yourtexasbenefits.com',
    },
    wic: {
      name: 'WIC',
      covers: 'Alimentos saludables, fórmula y apoyo para la lactancia para embarazadas y niños menores de 5 años.',
      howToApply: 'Busque una clínica de WIC cerca y haga una cita.',
      applyUrl: 'https://texaswic.org/es',
    },
    schoolMeals: {
      name: 'Comidas escolares gratis o a precio reducido',
      covers: 'Desayuno y almuerzo en la escuela.',
      howToApply:
        'Pida una solicitud de comidas en la escuela de su hijo. Si recibe SNAP, sus hijos casi siempre califican automáticamente.',
      applyUrl: 'https://squaremeals.org',
    },
    marketplace: {
      name: 'Mercado de Seguros Médicos',
      covers: 'Planes de salud para adultos, con créditos fiscales que bajan el costo mensual según sus ingresos.',
      howToApply:
        'Compare planes en CuidadoDeSalud.gov. Hay ayudantes locales gratis (“navegadores”) que le pueden ayudar.',
      applyUrl: 'https://www.cuidadodesalud.gov/es/',
    },
  },
  docs: {
    id: 'Identificación con foto del adulto que solicita (licencia, ID estatal o pasaporte)',
    income: 'Prueba de ingresos de los últimos 30 días (talones de pago, carta del empleador)',
    address: 'Prueba de dónde vive (contrato de renta, recibo de luz o correo)',
    ssn: 'Números de Seguro Social, solo de las personas que solicitan',
    immigration: 'Documentos de inmigración, solo de solicitantes que no son ciudadanos',
    bills: 'Recibos de renta, servicios y guardería (pueden aumentar su SNAP)',
    pregnancy: 'Prueba de embarazo de una clínica o doctor',
    kids: 'Actas de nacimiento de los niños',
  },
  ask: {
    title: 'Haga una pregunta',
    placeholder: 'Escriba su pregunta…',
    send: 'Enviar',
    thinking: 'Pensando…',
    intro: 'Preguntas sobre Medicaid, CHIP, SNAP, WIC o correo que recibió.',
    suggestions: [
      'Me llegó la carta de renovación de Medicaid. ¿Qué hago?',
      '¿Mis hijos pueden tener Medicaid si yo no soy ciudadano?',
      '¿Cómo solicito SNAP?',
    ],
    disclaimer: 'Las respuestas pueden tener errores. Confirme lo importante con HHSC o el 2-1-1.',
    error: 'Algo salió mal. Intente de nuevo.',
  },
  nearby: {
    title: 'Ayuda cerca de usted',
    intro: 'Lugares gratis o de bajo costo en Dallas. Los horarios pueden cambiar, así que llame antes de ir.',
    filters: {
      all: 'Todos',
      wic: 'WIC',
      clinic: 'Clínicas',
      food: 'Comida',
      benefits: 'Ayuda con beneficios',
    },
    types: {
      wic: 'Clínica de WIC',
      clinic: 'Centro de salud',
      food: 'Despensa de comida',
      benefits: 'Ayuda con beneficios',
    },
    call: 'Llamar',
    directions: 'Cómo llegar',
    website: 'Sitio web',
    checked: 'Revisado con sitios web oficiales en octubre de 2026.',
  },
  mail: {
    title: 'Entienda su correo',
    body: 'Tome una foto clara de una carta, factura o formulario. Le explicaremos qué dice y qué hacer.',
    privacy: 'Su foto no se guarda.',
    takePhoto: 'Tomar una foto',
    choosePhoto: 'Elegir una foto',
    reading: 'Leyendo su correo…',
    deadline: 'Fecha límite',
    steps: 'Qué hacer',
    documents: 'Qué enviar',
    contacts: 'Teléfonos',
    urgency: {
      high: 'Actúe pronto',
      medium: 'Necesita hacer algo',
      low: 'Solo información',
    },
    notALetter: 'No encontramos una carta, factura o formulario en esta foto. Intente con otra foto.',
    askFollowUp: 'Hacer una pregunta sobre esto',
    tryAnother: 'Probar otra foto',
    error: 'No pudimos leer esa foto. Intente de nuevo con mejor luz.',
  },
};

const STRINGS: Record<Language, Strings> = { en, es };

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Strings;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: STRINGS[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be used inside LanguageProvider');
  return value;
}
