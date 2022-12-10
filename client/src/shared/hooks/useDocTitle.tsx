import { useEffect } from 'react';

export function useDocTitle(title?: string) {
  if (!title) return document.title;

  useEffect(() => {
    document.title = title;
  }, [title]);

  return title;
}
