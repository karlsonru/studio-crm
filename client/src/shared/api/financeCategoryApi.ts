import { api } from './basicApi';
import { IFinanceCategoryModel, IFinanceCategoryModelCreate } from '../models/IFinanceCategoryModel';

const tag = 'finance/categories';
const route = 'finance/categories';

api.addTagTypes(tag);

export const { useGetFinanceCategoriesQuery } = api.injectGetAll<IFinanceCategoryModel>('getFinanceCategories', tag, route);
export const { useCreateFinanceCategoryMutation } = api.injectCreate<IFinanceCategoryModel, IFinanceCategoryModelCreate>('createFinanceCategory', tag, route);
export const { useDeleteFinanceCategoryMutation } = api.injectDelete('deleteFinanceCategory', tag, route);
