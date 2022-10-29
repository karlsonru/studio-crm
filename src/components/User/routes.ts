import { User } from '../../models';
import { createBasicRouter } from '../../shared/component';
import { UserController } from './controller';
import { UserServices } from './services';
import { loggerControllers } from '../../config/logger';
import { errorLogger, errorHandler, injectQuery } from '../../shared';
import { checkCreateUser } from './middlewares';
import { checkLogin, checkId, injectMiddlewares } from '../../shared/middlewares';

const middlewares = {
  injectMiddlewares,
  get: [checkId],
  post: [checkLogin, checkCreateUser, injectQuery(['login'])],
  patch: [checkId],
  delete: [checkId],
};

const handlers = {
  errorHandler,
  errorLogger,
  loggerControllers,
};

const service = new UserServices(User);
const controller = new UserController(service);

const locationRouter = createBasicRouter(controller, middlewares, handlers);

export default locationRouter;
