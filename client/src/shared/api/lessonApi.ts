import {
  basicApi, injectGetOne, injectGetAll, injectCreate, injectPatch, injectDelete,
} from './basicApi';
import { ILessonModel, ILessonModelCreate } from '../models/ILessonModel';

const tag = 'Lesson';
const route = 'lesson';

basicApi.enhanceEndpoints({ addTagTypes: [tag] });

export const { useGetLessonQuery } = injectGetOne<ILessonModel>('getLesson', tag, route);
export const { useGetLessonsQuery } = injectGetAll<ILessonModel>('getLessons', tag, route);
export const { useCreateLessonMutation } = injectCreate<ILessonModel, ILessonModelCreate>('createLesson', tag, route);
export const { usePatchLessonMutation } = injectPatch<ILessonModel, ILessonModelCreate>('patchLesson', tag, route);
export const { useDeleteLessonMutation } = injectDelete('deleteLesson', tag, route);
