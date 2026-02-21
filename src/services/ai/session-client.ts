import { z } from 'zod';

import { aiConfig } from '../../config/ai';
import type { AiSessionCredentials } from './types';

const BackendSessionResponseSchema = z
  .object({
    client_secret: z
      .object({
        value: z.string().min(1),
        expires_at: z.number().int().optional(),
      })
      .optional(),
    ephemeralApiKey: z.string().min(1).optional(),
    token: z.string().min(1).optional(),
    model: z.string().optional(),
  })
  .refine(
    (value) => Boolean(value.client_secret?.value || value.ephemeralApiKey || value.token),
    'Missing ephemeral key in session response.',
  );

const DirectOpenAiSessionResponseSchema = z.object({
  value: z.string().min(1),
  expires_at: z.number().int().optional(),
});

const fetchViaBackend = async (authToken?: string): Promise<AiSessionCredentials> => {
  if (!aiConfig.EXPO_PUBLIC_AI_SESSION_ENDPOINT) {
    throw new Error(
      '[AI] Missing session bootstrap config. Set EXPO_PUBLIC_OPENAI_API_KEY or EXPO_PUBLIC_AI_SESSION_ENDPOINT.',
    );
  }

  const response = await fetch(aiConfig.EXPO_PUBLIC_AI_SESSION_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify({
      model: aiConfig.EXPO_PUBLIC_AI_REALTIME_MODEL,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(
      `[AI] Session bootstrap failed (${response.status} ${response.statusText}): ${responseText}`,
    );
  }

  const parsed = BackendSessionResponseSchema.parse(await response.json());
  const ephemeralApiKey =
    parsed.client_secret?.value ?? parsed.ephemeralApiKey ?? parsed.token ?? '';

  return {
    ephemeralApiKey,
    expiresAt: parsed.client_secret?.expires_at ?? null,
    model: parsed.model ?? aiConfig.EXPO_PUBLIC_AI_REALTIME_MODEL,
  };
};

const fetchDirectFromOpenAi = async (): Promise<AiSessionCredentials> => {
  const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${aiConfig.EXPO_PUBLIC_OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session: {
        type: 'realtime',
        model: aiConfig.EXPO_PUBLIC_AI_REALTIME_MODEL,
      },
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(
      `[AI] Direct OpenAI session bootstrap failed (${response.status} ${response.statusText}): ${responseText}`,
    );
  }

  const parsed = DirectOpenAiSessionResponseSchema.parse(await response.json());

  return {
    ephemeralApiKey: parsed.value,
    expiresAt: parsed.expires_at ?? null,
    model: aiConfig.EXPO_PUBLIC_AI_REALTIME_MODEL,
  };
};

export const fetchAiSessionCredentials = async (
  authToken?: string,
): Promise<AiSessionCredentials> => {
  if (aiConfig.EXPO_PUBLIC_OPENAI_API_KEY) {
    return fetchDirectFromOpenAi();
  }

  return fetchViaBackend(authToken);
};
