import { useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { setPageTitle } from '../reducers/appMenuSlice';

export function usePageTitle(title: string) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageTitle(title));
  }, []);
}
