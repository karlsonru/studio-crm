import { api } from './basicApi';
import { ISubscriptionModel, ISubscriptionCreate } from '../models/ISubscriptionModel';

const tag = 'Subscription';
const route = 'subscription';

api.addTagTypes(tag);

export const { useGetSubscriptionQuery } = api.injectGetOne<ISubscriptionModel>('getSubscription', tag, route);
export const { useGetSubscriptionsQuery } = api.injectGetAll<ISubscriptionModel>('getSubscriptions', tag, route);
export const { useFindSubscriptionsQuery } = api.injectFind<ISubscriptionModel>('findSubscriptions', tag, route);
export const { useFindWithParamsSubscriptionsQuery } = api.injectFindWithParams<ISubscriptionModel>('findWithParamsSubscriptions', tag, route);
export const { useCreateSubscriptionMutation } = api.injectCreate<ISubscriptionModel, ISubscriptionCreate>('createSubscription', tag, route);
export const { usePatchSubscriptionMutation } = api.injectPatch<ISubscriptionModel, ISubscriptionCreate>('patchSubscription', tag, route);
export const { useDeleteSubscriptionMutation } = api.injectDelete('deleteSubscription', tag, route);
