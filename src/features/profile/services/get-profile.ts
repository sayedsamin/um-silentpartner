import { z } from 'zod';

import { docRef } from '../../../services/firebase';
import { type ProfileData } from '../types';

const LinkedInSchema = z.object({
  name: z.string().optional(),
  headline: z.string().optional(),
  picture: z.string().optional(),
  email: z.string().optional(),
  positions: z.array(z.unknown()).optional(),
  educations: z.array(z.unknown()).optional(),
});

const OnboardingAnswersSchema = z.object({
  primaryGoal: z.string().optional(),
  conversationStyle: z.string().optional(),
  favoriteTopics: z.array(z.string()).optional(),
});

const ProfileDataSchema = z.object({
  displayName: z.string().optional(),
  linkedin: LinkedInSchema.optional(),
  onboardingAnswers: OnboardingAnswersSchema.optional(),
  primaryGoal: z.string().optional(),
  conversationStyle: z.array(z.string()).optional(),
  networkingGoal: z.string().optional(),
  registeredEvents: z.array(z.unknown()).optional(),
  createdAt: z.unknown().optional(),
});

export const getProfileForUser = async (userId: string): Promise<ProfileData> => {
  const snap = await docRef<Record<string, unknown>>(`users/${userId}`).get();
  if (!snap.exists) {
    return {};
  }

  const parsed = ProfileDataSchema.safeParse(snap.data() ?? {});
  return parsed.success ? parsed.data : {};
};
