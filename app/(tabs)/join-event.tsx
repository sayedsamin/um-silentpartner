import { JoinEventScreen } from '../../src/features/onboarding';
import { RequireAuth } from '../../src/features/navigation';

export default function JoinEventRoute() {
  return (
    <RequireAuth>
      <JoinEventScreen />
    </RequireAuth>
  );
}
