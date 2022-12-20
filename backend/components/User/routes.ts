import { User } from '../../models';
import { createBasicRouterWithDefaultMiddlewares } from '../../shared/component';
import { UserController } from './controller';
import { UserServices } from './services';
import { checkCreateUser } from './middlewares';
import { checkLogin, injectQuery } from '../../shared/middlewares';

const middlewares = {
  post: [checkLogin, checkCreateUser, injectQuery(['login'])],
};

const service = new UserServices(User);
const controller = new UserController(service);

const userRouter = createBasicRouterWithDefaultMiddlewares(controller, middlewares);

export default userRouter;
