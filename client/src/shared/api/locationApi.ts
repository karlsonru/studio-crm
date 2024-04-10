import { api } from './basicApi';
import { ILocationModel, ILocationModelCreate } from '../models/ILocationModel';

const tag = 'Location';
const route = 'location';

api.addTagTypes(tag);

export const { useGetLocationQuery } = api.injectGetOne<ILocationModel>('getLocation', tag, route);
export const { useGetLocationsQuery } = api.injectGetAll<ILocationModel>('getLocations', tag, route);
export const { useCreateLocationMutation } = api.injectCreate<ILocationModel, ILocationModelCreate>('createLocation', tag, route);
export const { usePatchLocationMutation } = api.injectPatch<ILocationModel, ILocationModelCreate>('patchLocation', tag, route);
export const { useDeleteLocationMutation } = api.injectDelete('deleteLocation', tag, route);
