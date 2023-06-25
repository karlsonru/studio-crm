import { useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { setPageTitle } from '../reducers/appMenuSlice';

export function useTitle(title?: string) {
  if (!title) return;

  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = title;
    dispatch(setPageTitle(title));
  }, [title]);
}
