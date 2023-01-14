import { useEffect } from 'react';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { setPageTitle } from '../../shared/reducers/appMenuSlice';
import { StudentsPageHeader } from './StudentsPageHeader';

export function StudentsPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageTitle('Ученики'));
  }, []);

  return <StudentsPageHeader />;
}
