import {
  basicApi, injectGetOne, injectGetAll, injectCreate, injectPatch, injectDelete,
} from './basicApi';
import { IUserModel, IUserModelCreate } from '../models/IUserModel';

const tag = 'User';
const route = 'user';

basicApi.enhanceEndpoints({ addTagTypes: [tag] });

interface IUserModelUpdate extends IUserModelCreate {
  newPassword?: string;
}

export const { useGetUserQuery } = injectGetOne<IUserModel>('getUser', tag, route);
export const { useGetUsersQuery } = injectGetAll<IUserModel>('getUsers', tag, route);
export const { useCreateUserMutation } = injectCreate<IUserModel, IUserModelCreate>('createUser', tag, route);
export const { usePatchUserMutation } = injectPatch<IUserModel, IUserModelUpdate>('patchUser', tag, route);
export const { useDeleteUserMutation } = injectDelete('deleteUser', tag, route);
