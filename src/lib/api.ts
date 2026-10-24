import type { Language } from '@/lib/i18n';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export type LetterExplanation = {
  isBenefitsLetter: boolean;
  program: string;
  summary: string;
  urgency: 'high' | 'medium' | 'low';
  deadline: string | null;
  steps: string[];
  documentsNeeded: string[];
  phoneNumbers: string[];
};

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? `Request failed (${response.status})`);
  return data as T;
}

export function sendChat(params: {
  messages: ChatMessage[];
  language: Language;
  household: string | null;
  letter: string | null;
}) {
  return post<{ reply: string }>('/api/chat', params);
}

export function explainLetter(params: { imageBase64: string; mimeType: string; language: Language }) {
  return post<LetterExplanation>('/api/letter', params);
}
