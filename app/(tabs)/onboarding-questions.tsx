import { OnboardingQuestionsScreen } from '../../src/features/onboarding';
import { RequireAuth } from '../../src/features/navigation';

export default function OnboardingQuestionsRoute() {
  return (
    <RequireAuth>
      <OnboardingQuestionsScreen />
    </RequireAuth>
  );
}
