import { ConversationStyleScreen } from '../../src/features/onboarding';
import { RequireAuth } from '../../src/features/navigation';

export default function ConversationStyleRoute() {
  return (
    <RequireAuth>
      <ConversationStyleScreen />
    </RequireAuth>
  );
}
