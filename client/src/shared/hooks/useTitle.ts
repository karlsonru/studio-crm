import { useEffect } from 'react';
import { useActionCreators } from './useActionCreators';
import { appMenuActions } from '../reducers/appMenuSlice';

export function useTitle(title?: string) {
  const actions = useActionCreators(appMenuActions);

  useEffect(() => {
    if (!title) return;

    document.title = title;
    actions.setPageTitle(title);
  }, [title]);
}
