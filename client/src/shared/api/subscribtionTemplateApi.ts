import {
  basicApi, injectGetOne, injectGetAll, injectCreate, injectPatch, injectDelete,
} from './basicApi';
import { ISubscribtionTemplateModel, ISubscribtionTemplateCreate } from '../models/ISubscribtionModel';

const tag = 'SubscribtionTemplate';
const route = 'subscribtion/template';

basicApi.enhanceEndpoints({ addTagTypes: [tag] });

export const { useGetSubscribtionTemplateQuery } = injectGetOne<ISubscribtionTemplateModel>('getSubscribtionTemplate', tag, route);
export const { useGetSubscribtionTemplatesQuery } = injectGetAll<ISubscribtionTemplateModel>('getSubscribtionTemplates', tag, route);
export const { useCreateSubscribtionTemplateMutation } = injectCreate<ISubscribtionTemplateModel, ISubscribtionTemplateCreate>('createSubscribtionTemplate', tag, route);
export const { usePatchSubscribtionTemplateMutation } = injectPatch<ISubscribtionTemplateModel, ISubscribtionTemplateCreate>('patchSubscribtionTemplate', tag, route);
export const { useDeleteSubscribtionTemplateMutation } = injectDelete('deleteSubscribtionTemplate', tag, route);
