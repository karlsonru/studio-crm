import { useState, useEffect } from 'react';

interface IUseFetch {
  url: string;
  method?: string;
  body?: {
    [key: string]: string | number | boolean;
  } | any;
}

export default function useFetch({ url, method, body }: IUseFetch) {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState<Error | null>(null);

  const baseUrl = 'http://localhost:5000/api';
  const headers = {
    'Content-Type': 'application/json;charset=utf-8',
  };

  const makeRequest = async () => {
    try {
      setLoading(true);

      const request = await fetch(baseUrl + url, {
        method: method || 'GET',
        headers,
        body: JSON.stringify(body),
      });

      const receviedData = await request.json();

      setData(receviedData);
    } catch (e) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    makeRequest();
  }, []);

  return { isLoading, data, error };
}
