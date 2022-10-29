import { RolesGroup } from '../../models';
import { createBasicRouter } from '../../shared/component';
import { RolesGroupController } from './controller';
import { RolesGroupServices } from './services';
import { loggerControllers } from '../../config/logger';
import { errorLogger, errorHandler, injectQuery } from '../../shared';
import { checkCreateRolesGroup } from './middlewares';
import { checkLogin, checkId, injectMiddlewares } from '../../shared/middlewares';

const middlewares = {
  injectMiddlewares,
  get: [checkId],
  post: [checkLogin, checkCreateRolesGroup, injectQuery(['title'])],
  patch: [checkId],
  delete: [checkId],
};

const handlers = {
  errorHandler,
  errorLogger,
  loggerControllers,
};

const service = new RolesGroupServices(RolesGroup);
const controller = new RolesGroupController(service);

const rolesGroupRouter = createBasicRouter(controller, middlewares, handlers);

export default rolesGroupRouter;
