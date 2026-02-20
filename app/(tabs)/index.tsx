import { ProfessionalIdentityScreen } from '../../src/features/onboarding';
import { RequireAuth } from '../../src/features/navigation';

export default function ProfessionalIdentityRoute() {
  return (
    <RequireAuth>
      <ProfessionalIdentityScreen />
    </RequireAuth>
  );
}
