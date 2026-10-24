import type { ChatMessage } from '@/lib/api';
import type { Language } from '@/lib/i18n';
import { chatSystemPrompt, client, errorResponse, missingKeyResponse, MODEL, textOf } from '@/server/claude';

type ChatRequest = {
  messages: ChatMessage[];
  language: Language;
  household: string | null;
  letter: string | null;
};

const REFUSAL_REPLY = {
  en: 'Sorry, I can’t help with that. For benefits questions, you can also call 2-1-1.',
  es: 'Lo siento, no puedo ayudar con eso. Para preguntas sobre beneficios, también puede llamar al 2-1-1.',
};

export async function POST(request: Request) {
  const missingKey = missingKeyResponse();
  if (missingKey) return missingKey;

  const { messages, language, household, letter } = (await request.json()) as ChatRequest;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'No messages sent.' }, { status: 400 });
  }

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      output_config: { effort: 'medium' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: chatSystemPrompt(language, household, letter),
      messages: messages.slice(-20),
    });

    if (response.stop_reason === 'refusal') {
      return Response.json({ reply: REFUSAL_REPLY[language] ?? REFUSAL_REPLY.en });
    }
    return Response.json({ reply: textOf(response.content) });
  } catch (error) {
    return errorResponse(error);
  }
}
