import { api } from './basicApi';
import { IStudentModel, IStudentModalCreate } from '../models/IStudentModel';

const tag = 'Student';
const route = 'student';

api.addTagTypes(tag);

export const { useGetStudentQuery } = api.injectGetOne<IStudentModel>('getStudent', tag, route);
export const { useGetStudentsQuery } = api.injectGetAll<IStudentModel>('getStudents', tag, route);
export const { useFindStudentsQuery } = api.injectFind<IStudentModel>('findStudents', tag, route);
export const { useFindStudentsClosestBirthdaysQuery } = api.injectFind<IStudentModel>('findStudentsClosestBirthdays', tag, `${route}/closest-birthdays`);
export const { useCreateStudentMutation } = api.injectCreate<IStudentModel, IStudentModalCreate>('createStudent', tag, route);
export const { usePatchStudentMutation } = api.injectPatch<IStudentModel, IStudentModalCreate>('patchStudent', tag, route);
export const { useDeleteStudentMutation } = api.injectDelete('deleteStudent', tag, route);
