import { z } from 'zod';

const AiConfigSchema = z.object({
  EXPO_PUBLIC_AI_SESSION_ENDPOINT: z
    .string()
    .url()
    .optional()
    .default(''),
  EXPO_PUBLIC_AI_REALTIME_MODEL: z.string().min(1).optional().default('gpt-realtime'),
  EXPO_PUBLIC_OPENAI_API_KEY: z.string().optional().default(''),
});

export const aiConfig = AiConfigSchema.parse({
  EXPO_PUBLIC_AI_SESSION_ENDPOINT: process.env.EXPO_PUBLIC_AI_SESSION_ENDPOINT,
  EXPO_PUBLIC_AI_REALTIME_MODEL: process.env.EXPO_PUBLIC_AI_REALTIME_MODEL,
  EXPO_PUBLIC_OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});
