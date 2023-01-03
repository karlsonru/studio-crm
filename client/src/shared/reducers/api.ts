import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ILocationModel } from '../models/ILocationModel';
import { ILessonModel, INewLessonModel } from '../models/ILessonModel';
import { IUserModel } from '../models/IUserModel';

interface IResponse<T> {
  message: string;
  payload: T;
}

const BASE_URL = 'http://localhost:5000/api/';

export const lessonsApi = createApi({
  reducerPath: 'lessonsApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getLessons: builder.query<IResponse<Array<ILessonModel>>, void>({
      query: () => 'lesson',
    }),
    getLesson: builder.query<IResponse<Array<ILessonModel>>, string>({
      query: (lessonId) => ({ url: `lesson/${lessonId}` }),
    }),
    createLesson: builder.mutation<IResponse<ILessonModel>, INewLessonModel>({
      query: (lesson) => ({ url: 'lesson', method: 'POST', body: lesson }),
    }),
  }),
});

export const { useGetLessonsQuery, useGetLessonQuery, useCreateLessonMutation } = lessonsApi;

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
