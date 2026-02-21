export type ProfileData = {
  displayName?: string;
  linkedin?: {
    name?: string;
    headline?: string;
    picture?: string;
    email?: string;
    positions?: unknown[];
    educations?: unknown[];
  };
  onboardingAnswers?: {
    primaryGoal?: string;
    conversationStyle?: string;
    favoriteTopics?: string[];
  };
  primaryGoal?: string;
  conversationStyle?: string[];
  networkingGoal?: string;
  registeredEvents?: unknown[];
  createdAt?: unknown;
};
