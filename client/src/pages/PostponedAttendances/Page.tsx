import { useTitle } from '../../shared/hooks/useTitle';
import { PostponedAttendancesContent } from './Content';

export function PostponedAttendancesPage() {
  useTitle('Отработки');

  return <PostponedAttendancesContent />;
}
