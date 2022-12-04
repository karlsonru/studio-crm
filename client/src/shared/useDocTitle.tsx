import React, { useState, useEffect } from 'react';

export function useDocTitle(title: string): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [doctitle, setDocTitle] = useState(title);

  useEffect(() => {
    document.title = doctitle;
  }, [doctitle]);

  return [doctitle, setDocTitle];
}
