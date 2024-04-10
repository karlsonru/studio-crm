import { api } from './basicApi';
import { ISubscriptionTemplateModel, ISubscriptionTemplateCreate } from '../models/ISubscriptionModel';

const tag = 'SubscriptionTemplate';
const route = 'subscription-templates';

api.addTagTypes(tag);

export const { useGetSubscriptionTemplateQuery } = api.injectGetOne<ISubscriptionTemplateModel>('getSubscriptionTemplate', tag, route);
export const { useGetSubscriptionTemplatesQuery } = api.injectGetAll<ISubscriptionTemplateModel>('getSubscriptionTemplates', tag, route);
export const { useCreateSubscriptionTemplateMutation } = api.injectCreate<ISubscriptionTemplateModel, ISubscriptionTemplateCreate>('createSubscriptionTemplate', tag, route);
export const { usePatchSubscriptionTemplateMutation } = api.injectPatch<ISubscriptionTemplateModel, ISubscriptionTemplateCreate>('patchSubscriptionTemplate', tag, route);
export const { useDeleteSubscriptionTemplateMutation } = api.injectDelete('deleteSubscriptionTemplate', tag, route);
