import { useState, useEffect } from 'react';

export function useFetch<T, K>(url: string, method: string | undefined, body: K) {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const baseUrl = 'http://localhost:5000/api';
  const headers = {
    'Content-Type': 'application/json;charset=utf-8',
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);

        const request = await fetch(baseUrl + url, {
          method: method || 'GET',
          headers,
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        const receviedData = await request.json();

        setData(receviedData);
      } catch (e) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url, method]);

  return { isLoading, data, error };
}
