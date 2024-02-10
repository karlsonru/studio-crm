import { api } from './basicApi';
import { IFinanceModel, IFinanceModelCreate } from '../models/IFinanceModel';

const tag = 'Finance';
const route = 'finance';

api.enhanceEndpoints(tag);

export const { useGetFinanceQuery } = api.injectGetOne<IFinanceModel>('getFinance', tag, route);
export const { useGetFinancesQuery } = api.injectGetAll<IFinanceModel>('getFinances', tag, route);
export const { useFindFinancesQuery } = api.injectFind<IFinanceModel>('findFinances', tag, route);
export const { useCreateFinanceMutation } = api.injectCreate<IFinanceModel, IFinanceModelCreate>('createFinance', tag, route);
export const { usePatchFinanceMutation } = api.injectPatch<IFinanceModel, IFinanceModelCreate>('patchFinance', tag, route);
export const { useDeleteFinanceMutation } = api.injectDelete('deleteFinance', tag, route);
