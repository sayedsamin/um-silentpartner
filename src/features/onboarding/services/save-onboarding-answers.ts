import { z } from 'zod';

import { docRef } from '../../../services/firebase';

const SaveOnboardingAnswersSchema = z.object({
  personalityTraits: z.array(z.string()).min(1),
  primaryGoal: z.string().min(1),
  conversationStyle: z.string().min(1),
  favoriteTopics: z.array(z.string()).min(1),
});

export type SaveOnboardingAnswersInput = z.infer<typeof SaveOnboardingAnswersSchema>;

export const saveOnboardingAnswers = async (
  userId: string,
  input: SaveOnboardingAnswersInput,
): Promise<void> => {
  const parsed = SaveOnboardingAnswersSchema.parse(input);

  await docRef(`users/${userId}`).set(
    {
      onboardingAnswers: parsed,
      onboardingComplete: true,
    },
    { merge: true },
  );
};
