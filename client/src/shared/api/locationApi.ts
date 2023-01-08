import {
  basicApi, injectGetOne, injectGetAll, injectCreate, injectPatch, injectDelete,
} from './basicApi';
import { ILocationModel, ILocationModelCreate } from '../models/ILocationModel';

const tag = 'Location';
const route = 'location';

basicApi.enhanceEndpoints({ addTagTypes: [tag] });

export const { useGetLocationQuery } = injectGetOne<ILocationModel>('getLocation', tag, route);
export const { useGetLocationsQuery } = injectGetAll<ILocationModel>('getLocations', tag, route);
export const { useCreateLocationMutation } = injectCreate<ILocationModel, ILocationModelCreate>('createLocation', tag, route);
export const { usePatchLocationMutation } = injectPatch<ILocationModel, ILocationModelCreate>('patchLocation', tag, route);
export const { useDeleteLocationMutation } = injectDelete('deleteLocation', tag, route);
