import { useEffect } from 'react';
import { LessonsContent } from './Content';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { setPageTitle } from '../../shared/reducers/appMenuSlice';

export function LessonsPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageTitle('Занятия'));
  }, []);

  return <LessonsContent />;
}
