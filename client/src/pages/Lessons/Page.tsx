import { LessonsContent } from './Content';
import { useTitle } from '../../shared/hooks/useTitle';

export function LessonsPage() {
  useTitle('Занятия');

  return <LessonsContent />;
}
