import { api } from './basicApi';
import { IAttendanceModel, IAttendanceModelCreate } from '../models/IAttendanceModel';

const tag = 'Attendances';
const route = 'attendances';

api.addTagTypes(tag);

export const { useGetAttendanceQuery } = api.injectGetOne<IAttendanceModel>('getAttendance', tag, route);
export const { useGetAttendancesQuery } = api.injectGetAll<IAttendanceModel>('getAttendances', tag, route);
export const { useFindAttendancesQuery } = api.injectFind<IAttendanceModel>('findAttendances', tag, route);
export const { useFindWithParamsAttendancesQuery } = api.injectFindWithParams<IAttendanceModel>('findWithParamsAttendances', tag, route);
export const { useCreateAttendanceMutation } = api.injectCreate<IAttendanceModel, IAttendanceModelCreate>('createAttendance', tag, route);
export const { usePatchAttendanceMutation } = api.injectPatch<IAttendanceModel, IAttendanceModelCreate>('patchAttendance', tag, route);
export const { useDeleteAttendanceMutation } = api.injectDelete('deleteAttendance', tag, route);

const apiResource = api.getResource();

export const { usePatchAttendanceStudentsMutation } = apiResource.injectEndpoints({
  endpoints: (build) => ({
    patchAttendanceStudents: build
      .mutation<IAttendanceModel, { id: string, action: 'add' | 'remove', newItem: Pick<IAttendanceModelCreate, 'students'> }>({
      query: ({ id, action, newItem }) => (
        { url: `${route}/${id}/students/${action}`, method: 'PATCH', body: newItem }
      ),
      invalidatesTags: [tag as any],
    }),
  }),
});
