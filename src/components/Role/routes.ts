import { Role } from '../../models';
import { createBasicRouter } from '../../shared/component';
import { RoleController } from './controller';
import { RoleServices } from './services';
import { loggerControllers } from '../../config/logger';
import { errorLogger, errorHandler, injectQuery } from '../../shared';
import { checkCreateRole } from './middlewares';
import { checkLogin, checkId, injectMiddlewares } from '../../shared/middlewares';

const middlewares = {
  injectMiddlewares,
  get: [checkId],
  post: [checkLogin, checkCreateRole, injectQuery(['value'])],
  patch: [checkId],
  delete: [checkId],
};

const handlers = {
  errorHandler,
  errorLogger,
  loggerControllers,
};

const service = new RoleServices(Role);
const controller = new RoleController(service);

const roleRouter = createBasicRouter(controller, middlewares, handlers);

export default roleRouter;
