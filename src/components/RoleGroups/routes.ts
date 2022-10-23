import { RolesGroup } from '../../models';
import { createBasicRouter } from '../../shared/component';
import { RolesGroupController } from './controller';
import { RolesGroupServices } from './services';
import { loggerControllers } from '../../config/logger';
import { errorLogger, errorHandler, injectQuery } from '../../shared';
import { checkCreateRolesGroup } from './middlewares';
import { checkLogin, checkId, validationMiddleware } from '../../shared/validationMiddlewares';

const middlewares = {
  validationMiddleware,
  get: [checkId],
  post: [checkLogin, checkCreateRolesGroup],
  patch: [checkId],
  delete: [checkId],
  injectQuery,
  query: ['title'],
};

const handlers = {
  errorHandler,
  errorLogger,
  loggerControllers,
};

const service = new RolesGroupServices(RolesGroup);
const controller = new RolesGroupController(service);

const roleRouter = createBasicRouter(controller, middlewares, handlers);

export default roleRouter;
