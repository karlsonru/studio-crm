import { useEffect } from 'react';
import { LessonsHeader } from './LessonsHeader';
import { LessonsContent } from './LessonsContent';
import { useAppDispatch } from '../../shared/useAppDispatch';
import { setPageTitle } from '../../store/slices/appMenuSlice';

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
