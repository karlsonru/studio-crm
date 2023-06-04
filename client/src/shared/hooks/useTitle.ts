import { useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { setPageTitle } from '../reducers/appMenuSlice';

export function useTitle(title: string) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = title;
    dispatch(setPageTitle(title));
  }, [title]);
}
