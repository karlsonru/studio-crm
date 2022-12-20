import { useEffect } from 'react';
import { LessonsHeader } from './LessonsHeader';
import { LessonsContent } from './LessonsContent';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { setPageTitle } from '../../shared/reducers/appMenuSlice';

export function LessonsPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageTitle('Занятия'));
  }, []);

  return (
    <>
      <LessonsHeader />
      <LessonsContent />
    </>
  );
}
