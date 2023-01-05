import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ILocationModel, ILocationModelCreate } from '../models/ILocationModel';
import { ILessonModel, ILessonModelCreate } from '../models/ILessonModel';
import { IUserModel, IUserModelCreate } from '../models/IUserModel';

interface IResponse<T> {
  message: string;
  payload: T;
}

const BASE_URL = 'http://localhost:5000/api/';

function ApiFactory<T, K>(path: string) {
  return createApi({
    reducerPath: `${path}Api`,
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
      getAll: builder.query<IResponse<Array<T>>, void>({
        query: () => path,
      }),
      getOne: builder.query<IResponse<Array<T>>, string>({
        query: (id) => ({ url: `${path}/${id}` }),
      }),
      create: builder.mutation<IResponse<T>, K>({
        query: (newItem) => ({ url: path, method: 'POST', body: newItem }),
      }),
      delete: builder.mutation<void, string>({
        query: (id) => ({ url: `${path}/${id}`, method: 'DELETE' }),
      }),
      patch: builder.mutation<IResponse<T>, { id: string, newItem: Partial<K> }>({
        query: ({ id, newItem }) => ({ url: `${path}/${id}`, method: 'PATCH', body: newItem }),
      }),
    }),
  });
}

export const lessonsApi = new (ApiFactory<ILessonModel, ILessonModelCreate> as any)('lesson');

export const {
  useGetAllQuery: useGetLessonsQuery,
  useGetOneQuery: useGetLessonQuery,
  useCreateMutation: useCreateLessonMutation,
  useDeleteMutation: useDeleteLessonMutation,
  usePatchMutation: usePatchLessonMutation,
} = lessonsApi;

export const usersApi = new (ApiFactory<IUserModel, IUserModelCreate> as any)('user');

export const {
  useGetAllQuery: useGetUsersQuery,
  useGetOneQuery: useGetUserQuery,
  useCreateMutation: useCreateUserMutation,
  useDeleteMutation: useDeleteUserMutation,
  usePatchMutation: usePatchUserMutation,
} = usersApi;

export const locationsApi = new (ApiFactory<ILocationModel, ILocationModelCreate> as any)('location');

export const {
  useGetAllQuery: useGetLocationsQuery,
  useGetOneQuery: useGetLocationQuery,
  useCreateMutation: useCreateLocationMutation,
  useDeleteMutation: useDeleteLocationMutation,
  usePatchMutation: usePatchLocationMutation,
} = locationsApi;
