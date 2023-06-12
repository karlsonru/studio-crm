import {
  basicApi, injectGetOne, injectGetAll, injectCreate, injectPatch, injectDelete, injectFind,
} from './basicApi';
import { IFinanceModel, IFinanceModelCreate } from '../models/IFinanceModel';

const tag = 'Finance';
const route = 'finance';

basicApi.enhanceEndpoints({ addTagTypes: [tag] });

export const { useGetFinanceQuery } = injectGetOne<IFinanceModel>('getFinance', tag, route);
export const { useGetFinancesQuery } = injectGetAll<IFinanceModel>('getFinances', tag, route);
export const { useFindFinancesQuery } = injectFind<IFinanceModel>('findFinances', tag, route);
export const { useCreateFinanceMutation } = injectCreate<IFinanceModel, IFinanceModelCreate>('createFinance', tag, route);
export const { usePatchFinanceMutation } = injectPatch<IFinanceModel, IFinanceModelCreate>('patchFinance', tag, route);
export const { useDeleteFinanceMutation } = injectDelete('deleteFinance', tag, route);
