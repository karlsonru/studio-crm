import { useTitle } from '../../shared/hooks/useTitle';
import { UnpaidAttendancesContent } from './Content';

export function UnpaidAttendancesPage() {
  useTitle('Неоплаченные занятия');

  return <UnpaidAttendancesContent />;
}
