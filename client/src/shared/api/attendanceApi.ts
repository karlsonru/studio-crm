import {
  basicApi,
  injectGetOne,
  injectGetAll,
  injectCreate,
  injectPatch,
  injectDelete,
  injectFind,
} from './basicApi';
import { IAttendanceModel, IAttendanceModelCreate } from '../models/IAttendanceModel';

const tag = 'Attendances';
const route = 'attendances';

basicApi.enhanceEndpoints({ addTagTypes: [tag] });

export const { useGetAttendanceQuery } = injectGetOne<IAttendanceModel>('getAttendance', tag, route);
export const { useGetAttendancesQuery } = injectGetAll<IAttendanceModel>('getAttendances', tag, route);
export const { useFindAttendancesQuery } = injectFind<IAttendanceModel>('findAttendances', tag, route);
export const { useCreateAttendanceMutation } = injectCreate<IAttendanceModel, IAttendanceModelCreate>('createAttendance', tag, route);
export const { usePatchAttendanceMutation } = injectPatch<IAttendanceModel, IAttendanceModelCreate>('patchAttendance', tag, route);
export const { useDeleteAttendanceMutation } = injectDelete('deleteAttendance', tag, route);
