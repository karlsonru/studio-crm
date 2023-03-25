import { useMemo } from 'react';
import { bindActionCreators, ActionCreatorsMapObject } from '@reduxjs/toolkit';
import { useAppDispatch } from './useAppDispatch';

export const useActionCreators = <Actions extends ActionCreatorsMapObject>(actions: Actions) => {
  const dispatch = useAppDispatch();

  return useMemo(() => bindActionCreators(actions, dispatch), []);
};
