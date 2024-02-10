import { api } from './basicApi';
import { IUserModel, IUserModelCreate } from '../models/IUserModel';

const tag = 'User';
const route = 'user';

api.addTagTypes(tag);

interface IUserModelUpdate extends IUserModelCreate {
  newPassword?: string;
}

export const { useGetUserQuery } = api.injectGetOne<IUserModel>('getUser', tag, route);
export const { useGetUsersQuery } = api.injectGetAll<IUserModel>('getUsers', tag, route);
export const { useCreateUserMutation } = api.injectCreate<IUserModel, IUserModelCreate>('createUser', tag, route);
export const { usePatchUserMutation } = api.injectPatch<IUserModel, IUserModelUpdate>('patchUser', tag, route);
export const { useDeleteUserMutation } = api.injectDelete('deleteUser', tag, route);
