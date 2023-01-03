import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ILessonModel } from 'shared/models/ILessonModes';

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
    createLesson: builder.mutation<IResponse<ILessonModel>, ILessonModel>({
      query: (lesson) => ({ url: 'lesson', method: 'POST', body: lesson }),
    }),
  }),
});

export const { useGetLessonsQuery, useGetLessonQuery, useCreateLessonMutation } = lessonsApi;
