import {
  basicApi, injectCreate,
} from './basicApi';

interface IAuthLogin {
  login: string;
  password: string;
}

interface IAuthToken {
  token: string;
}

const tag = 'auth';
// const route = 'auth';

basicApi.enhanceEndpoints({ addTagTypes: [tag] });

export const { useLoginMutation } = injectCreate<IAuthToken, IAuthLogin>('login', tag, 'auth/login');
