import { QrScannerScreen } from '../../src/features/onboarding';
import { RequireAuth } from '../../src/features/navigation';

export default function QrScannerRoute() {
  return (
    <RequireAuth>
      <QrScannerScreen />
    </RequireAuth>
  );
}
