import { z } from 'zod';

import { docRef } from '../../../services/firebase';
import { type AppEvent } from '../types';

const RegisteredEventSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  location: z.string().min(1),
  date: z.string().min(1),
});

const RegisteredEventsSchema = z.array(RegisteredEventSchema);

export const getRegisteredEventsForUser = async (userId: string): Promise<AppEvent[]> => {
  const snapshot = await docRef<Record<string, unknown>>(`users/${userId}`).get();
  if (!snapshot.exists) {
    return [];
  }

  const data = snapshot.data();
  const parsed = RegisteredEventsSchema.safeParse(data?.registeredEvents);
  return parsed.success ? parsed.data : [];
};
