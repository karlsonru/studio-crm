import {
  basicApi, injectGetOne, injectGetAll, injectCreate, injectPatch, injectDelete,
} from './basicApi';
import { ISubscriptionTemplateModel, ISubscriptionTemplateCreate } from '../models/ISubscriptionModel';

const tag = 'SubscriptionTemplate';
const route = 'subscription-templates';

basicApi.enhanceEndpoints({ addTagTypes: [tag] });

export const { useGetSubscriptionTemplateQuery } = injectGetOne<ISubscriptionTemplateModel>('getSubscriptionTemplate', tag, route);
export const { useGetSubscriptionTemplatesQuery } = injectGetAll<ISubscriptionTemplateModel>('getSubscriptionTemplates', tag, route);
export const { useCreateSubscriptionTemplateMutation } = injectCreate<ISubscriptionTemplateModel, ISubscriptionTemplateCreate>('createSubscriptionTemplate', tag, route);
export const { usePatchSubscriptionTemplateMutation } = injectPatch<ISubscriptionTemplateModel, ISubscriptionTemplateCreate>('patchSubscriptionTemplate', tag, route);
export const { useDeleteSubscriptionTemplateMutation } = injectDelete('deleteSubscriptionTemplate', tag, route);
