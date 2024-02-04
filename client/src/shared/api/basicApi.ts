import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

const BASE_URL = 'http://localhost:5000/api/';
const UNATHORIZED_STATUS = 401;

export const basicApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const { token } = (getState() as RootState).authReducer;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
    validateStatus: (response) => {
      // проверка не expired ли токен при запросах
      if (response.status === UNATHORIZED_STATUS) {
        window.dispatchEvent(new Event('remove-token'));
        return false;
      }

      return response.ok;
    },
  }),
  endpoints: () => ({}),
});

export function injectGetAll<T>(name: string, tag: any, route: string) {
  const extendedApi = basicApi.injectEndpoints({
    endpoints: (build) => ({
      [name]: build.query<Array<T>, void>({
        query: () => route,
        providesTags: [tag],
      }),
    }),
  });
  return extendedApi;
}

export function injectGetOne<T>(name: string, tag: any, route: string) {
  const extendedApi = basicApi.injectEndpoints({
    endpoints: (build) => ({
      [name]: build.query<T, string>({
        query: (id) => ({ url: `${route}/${id}` }),
        providesTags: [tag],
      }),
    }),
  });
  return extendedApi;
}

export function injectFind<T>(name: string, tag: any, route: string) {
  const extendedApi = basicApi.injectEndpoints({
    endpoints: (build) => ({
      [name]: build.query<Array<T>, Partial<T> | Record<string, unknown>>({
        query: (query) => ({ url: `${route}`, params: { filter: JSON.stringify(query) } }),
        providesTags: [tag],
      }),
    }),
  });
  return extendedApi;
}

export function injectCreate<T, K>(name: string, tag: any, route: string) {
  const extendedApi = basicApi.injectEndpoints({
    endpoints: (build) => ({
      [name]: build.mutation<T, K>({
        query: (newItem) => ({ url: route, method: 'POST', body: newItem }),
        invalidatesTags: [tag],
      }),
    }),
  });
  return extendedApi;
}

export function injectPatch<T, K>(name: string, tag: any, route: string) {
  const extendedApi = basicApi.injectEndpoints({
    endpoints: (build) => ({
      [name]: build.mutation<T, { id: string, newItem: Partial<K> }>({
        query: ({ id, newItem }) => ({ url: `${route}/${id}`, method: 'PATCH', body: newItem }),
        invalidatesTags: [tag],
      }),
    }),
  });
  return extendedApi;
}

export function injectDelete(name: string, tag: any, route: string) {
  const extendedApi = basicApi.injectEndpoints({
    endpoints: (build) => ({
      [name]: build.mutation<void, string>({
        query: (id) => ({ url: `${route}/${id}`, method: 'DELETE' }),
        invalidatesTags: [tag],
      }),
    }),
  });
  return extendedApi;
}
