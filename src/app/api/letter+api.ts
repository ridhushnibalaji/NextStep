import type { Language } from '@/lib/i18n';
import {
  client,
  errorResponse,
  LETTER_SCHEMA,
  letterSystemPrompt,
  missingKeyResponse,
  MODEL,
  textOf,
} from '@/server/claude';

type LetterRequest = { imageBase64: string; mimeType: string; language: Language };

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;
type ImageType = (typeof IMAGE_TYPES)[number];

export async function POST(request: Request) {
  const missingKey = missingKeyResponse();
  if (missingKey) return missingKey;

  const { imageBase64, mimeType, language } = (await request.json()) as LetterRequest;
  if (!imageBase64) return Response.json({ error: 'No image sent.' }, { status: 400 });
  const mediaType: ImageType = IMAGE_TYPES.includes(mimeType as ImageType) ? (mimeType as ImageType) : 'image/jpeg';

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      output_config: {
        effort: 'medium',
        format: { type: 'json_schema', schema: LETTER_SCHEMA },
      },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: letterSystemPrompt(language),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
            { type: 'text', text: 'Explain this letter.' },
          ],
        },
      ],
    });

    if (response.stop_reason === 'refusal') {
      return Response.json({ error: 'This letter could not be read.' }, { status: 422 });
    }
    return Response.json(JSON.parse(textOf(response.content)));
  } catch (error) {
    return errorResponse(error);
  }
}
