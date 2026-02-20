import { PrimaryGoalScreen } from '../../src/features/onboarding';
import { RequireAuth } from '../../src/features/navigation';

export default function PrimaryGoalRoute() {
  return (
    <RequireAuth>
      <PrimaryGoalScreen />
    </RequireAuth>
  );
}
