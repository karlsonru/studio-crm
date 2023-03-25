import {
  basicApi, injectGetOne, injectGetAll, injectCreate, injectPatch, injectDelete, injectFind,
} from './basicApi';
import { IVisitModel, IVisitModelCreate } from '../models/IVisitModel';

const tag = 'Visits';
const route = 'visits';

basicApi.enhanceEndpoints({ addTagTypes: [tag] });

export const { useGetVisitQuery } = injectGetOne<IVisitModel>('getVisit', tag, route);
export const { useGetVisitsQuery } = injectGetAll<IVisitModel>('getVisits', tag, route);
export const { useFindVisitsQuery } = injectFind<IVisitModel>('findVisits', tag, route);
export const { useCreateVisitMutation } = injectCreate<IVisitModel, IVisitModelCreate>('createVisit', tag, route);
export const { usePatchVisitMutation } = injectPatch<IVisitModel, IVisitModelCreate>('patchVisit', tag, route);
export const { useDeleteVisitMutation } = injectDelete('deleteVisit', tag, route);
