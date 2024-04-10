import { api } from './basicApi';

interface IAuthLogin {
  login: string;
  password: string;
}

interface IAuthToken {
  token: string;
}

const tag = 'auth';
// const route = 'auth';

api.addTagTypes(tag);

export const { useLoginMutation } = api.injectCreate<IAuthToken, IAuthLogin>('login', tag, 'auth/login');
