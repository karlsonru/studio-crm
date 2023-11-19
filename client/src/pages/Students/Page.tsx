import { StudentsContent } from './Content';
import { useTitle } from '../../shared/hooks/useTitle';

export function StudentsPage() {
  useTitle('Ученики');

  return <StudentsContent />;
}
