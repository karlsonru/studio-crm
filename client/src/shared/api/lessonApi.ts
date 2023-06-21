import {
  basicApi, injectGetOne, injectGetAll, injectCreate, injectPatch, injectDelete, injectFind,
} from './basicApi';
import { ILessonModel, ILessonModelCreate, IVisitingStudent } from '../models/ILessonModel';

const tag = 'Lesson';
const route = 'lesson';

basicApi.enhanceEndpoints({ addTagTypes: [tag] });

export const { useGetLessonQuery } = injectGetOne<ILessonModel>('getLesson', tag, route);
export const { useGetLessonsQuery } = injectGetAll<ILessonModel>('getLessons', tag, route);
export const { useFindLessonsQuery } = injectFind<ILessonModel>('findLessons', tag, route);
export const { useCreateLessonMutation } = injectCreate<ILessonModel, ILessonModelCreate>('createLesson', tag, route);
export const { usePatchLessonMutation } = injectPatch<ILessonModel, ILessonModelCreate>('patchLesson', tag, route);
export const { useDeleteLessonMutation } = injectDelete('deleteLesson', tag, route);

interface IVisitingStudentUpdate extends Omit<IVisitingStudent, 'student'> {
  student: string;
}

interface IUpdateLessonStudents {
  students: Array<IVisitingStudentUpdate | string>;
}

export const { usePatchLessonStudentsMutation } = basicApi.injectEndpoints({
  endpoints: (build) => ({
    patchLessonStudents: build
      .mutation<ILessonModel, { id: string, action: 'add' | 'remove', newItem: IUpdateLessonStudents }>({
      query: ({ id, action, newItem }) => (
        { url: `${route}/${id}/students/${action}`, method: 'PATCH', body: newItem }
      ),
      invalidatesTags: [tag as any],
    }),
  }),
});
