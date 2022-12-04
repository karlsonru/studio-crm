import { useDocTitle } from 'shared/useDocTitle';
import { LessonsHeader } from './LessonsHeader';
import { LessonsContent } from './LessonsContent';

export function LessonsPage() {
  useDocTitle('Занятия');

  return (
    <>
      <LessonsHeader />
      <LessonsContent />
    </>
  );
}
