import { useState, useEffect } from 'react';

interface IUseFetch {
  url: string;
  method?: string;
  body?: {
    [key: string]: string | number | boolean;
  } | any;
}

interface IReply {
  message: string;
  payload: [{
    [index: string]: string | number;
  }];
}

export default function useFetch({ url, method, body }: IUseFetch) {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<IReply | null>(null);
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
  }, []);

  return { isLoading, data, error };
}
