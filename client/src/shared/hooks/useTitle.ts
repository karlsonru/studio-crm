import { useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { setPageTitle } from '../reducers/appMenuSlice';

export function useTitle(title?: string) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!title) return;

    document.title = title;
    dispatch(setPageTitle(title));
  }, [title]);
}
