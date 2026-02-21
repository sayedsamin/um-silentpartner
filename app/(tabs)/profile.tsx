import { ProfileScreen } from '../../src/features/profile';
import { RequireAuth } from '../../src/features/navigation';

export default function ProfileRoute() {
  return (
    <RequireAuth>
      <ProfileScreen />
    </RequireAuth>
  );
}
