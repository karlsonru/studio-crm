import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ILocationModel } from '../models/ILocationModel';
import { ILessonModel, ILessonModelCreate, ILessonModelUpdate } from '../models/ILessonModel';
import { IUserModel } from '../models/IUserModel';

interface IResponse<T> {
  message: string;
  payload: T;
}

const BASE_URL = 'http://localhost:5000/api/';

function ApiFactory<T, K, A>(path: string) {
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
      patch: builder.mutation<IResponse<T>, { id: string, newItem: A }>({
        query: ({ id, newItem }) => ({ url: `${path}/${id}`, method: 'PATCH', body: newItem }),
      }),
    }),
  });
}

export const lessonsApi = new (ApiFactory<ILessonModel, ILessonModelCreate, ILessonModelUpdate> as any)('lesson');

export const {
  useGetAllQuery: useGetLessonsQuery,
  useGetOneQuery: useGetLessonQuery,
  useCreateMutation: useCreateLessonMutation,
  useDeleteMutation: useDeleteLessonMutation,
  usePatchMutation: usePatchLessonMutation,
} = lessonsApi;

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getUsers: builder.query<IResponse<Array<IUserModel>>, void>({
      query: () => 'user',
    }),
    getUser: builder.query<IResponse<Array<IUserModel>>, string>({
      query: (userId) => ({ url: `user/${userId}` }),
    }),
    createUser: builder.mutation<IResponse<IUserModel>, IUserModel>({
      query: (user) => ({ url: 'user', method: 'POST', body: user }),
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery, useCreateUserMutation } = usersApi;

export const locationsApi = createApi({
  reducerPath: 'locationsApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getLocations: builder.query<IResponse<Array<ILocationModel>>, void>({
      query: () => 'location',
    }),
    getLocation: builder.query<IResponse<Array<ILocationModel>>, string>({
      query: (locationId) => ({ url: `location/${locationId}` }),
    }),
    createLocation: builder.mutation<IResponse<ILocationModel>, ILocationModel>({
      query: (location) => ({ url: 'location', method: 'POST', body: location }),
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useGetLocationQuery,
  useCreateLocationMutation,
} = locationsApi;
