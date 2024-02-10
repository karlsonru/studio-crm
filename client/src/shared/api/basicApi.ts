import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

const BASE_URL = 'http://localhost:5000/api/';
const UNATHORIZED_STATUS = 401;

interface IFindQuery {
  route?: string;
  params: Record<string, unknown>;
}

class BasicApi {
  public resource;

  constructor(private readonly url: string) {
    this.resource = createApi({
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
  }

  addTagTypes(tag: string) {
    this.resource.enhanceEndpoints({ addTagTypes: [tag] });
  }

  injectGetAll<T>(name: string, tag: any, route: string) {
    const extendedApi = this.resource.injectEndpoints({
      endpoints: (build) => ({
        [name]: build.query<Array<T>, void>({
          query: () => route,
          providesTags: [tag],
        }),
      }),
    });
    return extendedApi;
  }

  injectGetOne<T>(name: string, tag: any, route: string) {
    const extendedApi = this.resource.injectEndpoints({
      endpoints: (build) => ({
        [name]: build.query<T, string>({
          query: (id) => ({ url: `${route}/${id}` }),
          providesTags: [tag],
        }),
      }),
    });
    return extendedApi;
  }

  injectFind<T>(name: string, tag: any, route: string) {
    const extendedApi = this.resource.injectEndpoints({
      endpoints: (build) => ({
        [name]: build.query<Array<T>, Partial<T> | Record<string, unknown>>({
          query: (query) => ({ url: `${route}`, params: { filter: JSON.stringify(query) } }),
          providesTags: [tag],
        }),
      }),
    });
    return extendedApi;
  }

  injectFindWithParams<T>(name: string, tag: any, basicRoute: string) {
    const extendedApi = this.resource.injectEndpoints({
      endpoints: (build) => ({
        [name]: build.query<Array<T>, IFindQuery>({
          query: ({ route, params }) => ({ url: route ? `${basicRoute}/${route}` : basicRoute, params }),
          providesTags: [tag],
        }),
      }),
    });
    return extendedApi;
  }

  injectCreate<T, K>(name: string, tag: any, route: string) {
    const extendedApi = this.resource.injectEndpoints({
      endpoints: (build) => ({
        [name]: build.mutation<T, K>({
          query: (newItem) => ({ url: route, method: 'POST', body: newItem }),
          invalidatesTags: [tag],
        }),
      }),
    });
    return extendedApi;
  }

  injectPatch<T, K>(name: string, tag: any, route: string) {
    const extendedApi = this.resource.injectEndpoints({
      endpoints: (build) => ({
        [name]: build.mutation<T, { id: string, newItem: Partial<K> }>({
          query: ({ id, newItem }) => ({ url: `${route}/${id}`, method: 'PATCH', body: newItem }),
          invalidatesTags: [tag],
        }),
      }),
    });
    return extendedApi;
  }

  injectDelete(name: string, tag: any, route: string) {
    const extendedApi = this.resource.injectEndpoints({
      endpoints: (build) => ({
        [name]: build.mutation<void, string>({
          query: (id) => ({ url: `${route}/${id}`, method: 'DELETE' }),
          invalidatesTags: [tag],
        }),
      }),
    });
    return extendedApi;
  }
}

const api = new BasicApi(BASE_URL);

export { api };
