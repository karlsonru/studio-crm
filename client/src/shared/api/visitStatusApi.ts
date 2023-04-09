import {
  basicApi, injectGetOne, injectGetAll, injectCreate, injectPatch, injectDelete, injectFind,
} from './basicApi';
import { IVisitModel, IVisitModelCreate } from '../models/IVisitModel';

const tag = 'VisitsStatus';
const route = 'visitstatus';

basicApi.enhanceEndpoints({ addTagTypes: [tag] });

export const { useGetVisitStatusQuery } = injectGetOne<IVisitModel>('getVisitStatus', tag, route);
export const { useGetVisitStatusesQuery } = injectGetAll<IVisitModel>('getVisitStatuses', tag, route);
export const { useFindVisitStatusQuery } = injectFind<IVisitModel>('findVisitStatus', tag, route);
export const { useCreateVisitStatusMutation } = injectCreate<IVisitModel, IVisitModelCreate>('createVisitStatus', tag, route);
export const { usePatchVisitStatusMutation } = injectPatch<IVisitModel, IVisitModelCreate>('patchVisitStatus', tag, route);
export const { useDeleteVisitStatusMutation } = injectDelete('deleteVisitStatus', tag, route);
