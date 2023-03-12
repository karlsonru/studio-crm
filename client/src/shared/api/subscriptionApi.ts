import {
  basicApi, injectGetOne, injectGetAll, injectCreate, injectPatch, injectDelete, injectFind,
} from './basicApi';
import { ISubscriptionModel, ISubscriptionCreate } from '../models/ISubscriptionModel';

const tag = 'Subscription';
const route = 'subscription';

basicApi.enhanceEndpoints({ addTagTypes: [tag] });

export const { useGetSubscriptionQuery } = injectGetOne<ISubscriptionModel>('getSubscription', tag, route);
export const { useGetSubscriptionsQuery } = injectGetAll<ISubscriptionModel>('getSubscriptions', tag, route);
export const { useFindSubscriptionsQuery } = injectFind<ISubscriptionModel>('findSubscriptions', tag, route);
export const { useCreateSubscriptionMutation } = injectCreate<ISubscriptionModel, ISubscriptionCreate>('createSubscription', tag, route);
export const { usePatchSubscriptionMutation } = injectPatch<ISubscriptionModel, ISubscriptionCreate>('patchSubscription', tag, route);
export const { useDeleteSubscriptionMutation } = injectDelete('deleteSubscription', tag, route);
