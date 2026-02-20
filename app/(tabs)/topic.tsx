import { TopicScreen } from '../../src/features/onboarding';
import { RequireAuth } from '../../src/features/navigation';

export default function TopicRoute() {
  return (
    <RequireAuth>
      <TopicScreen />
    </RequireAuth>
  );
}
