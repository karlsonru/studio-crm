import {
  basicApi,
  injectGetOne,
  injectGetAll,
  injectCreate,
  injectPatch,
  injectDelete,
  injectFind,
} from './basicApi';
import { IStudentModel, IStudentModalCreate } from '../models/IStudentModel';

const tag = 'Student';
const route = 'student';

basicApi.enhanceEndpoints({ addTagTypes: [tag] });

export const { useGetStudentQuery } = injectGetOne<IStudentModel>('getStudent', tag, route);
export const { useGetStudentsQuery } = injectGetAll<IStudentModel>('getStudents', tag, route);
export const { useFindStudentsQuery } = injectFind<IStudentModel>('findStudents', tag, route);
export const { useCreateStudentMutation } = injectCreate<IStudentModel, IStudentModalCreate>('createStudent', tag, route);
export const { usePatchStudentMutation } = injectPatch<IStudentModel, IStudentModalCreate>('patchStudent', tag, route);
export const { useDeleteStudentMutation } = injectDelete('deleteStudent', tag, route);
