import { AiListeningEngineScreen } from '../../src/features/onboarding';
import { RequireAuth } from '../../src/features/navigation';

export default function AiListeningEngineRoute() {
  return (
    <RequireAuth>
      <AiListeningEngineScreen />
    </RequireAuth>
  );
}
