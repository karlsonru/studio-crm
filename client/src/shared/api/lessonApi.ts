import { api } from './basicApi';
import { ILessonModel, ILessonModelCreate, IVisitingStudent } from '../models/ILessonModel';

const tag = 'Lesson';
const route = 'lesson';

api.addTagTypes(tag);

export const { useGetLessonQuery } = api.injectGetOne<ILessonModel>('getLesson', tag, route);
export const { useGetLessonsQuery } = api.injectGetAll<ILessonModel>('getLessons', tag, route);
export const { useFindLessonsQuery } = api.injectFind<ILessonModel>('findLessons', tag, route);
export const { useCreateLessonMutation } = api.injectCreate<ILessonModel, ILessonModelCreate>('createLesson', tag, route);
export const { usePatchLessonMutation } = api.injectPatch<ILessonModel, ILessonModelCreate>('patchLesson', tag, route);
export const { useDeleteLessonMutation } = api.injectDelete('deleteLesson', tag, route);

interface IVisitingStudentUpdate extends Omit<IVisitingStudent, 'student'> {
  student: string;
}

interface IUpdateLessonStudents {
  students: Array<IVisitingStudentUpdate | string>;
}

export const { usePatchLessonStudentsMutation } = api.resource.injectEndpoints({
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
