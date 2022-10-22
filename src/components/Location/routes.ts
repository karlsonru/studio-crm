import { Location } from '../../models';
import { createBasicRouter } from '../../shared/component';
import { LocationController } from './controller';
import { LocationServices } from './services';
import { loggerControllers } from '../../config/logger';
import { errorLogger, errorHandler, injectQuery } from '../../shared';
import { checkCreateLocation } from './middlewares';
import { checkLogin, checkId, validationMiddleware } from '../../shared/validationMiddlewares';

const middlewares = {
  validationMiddleware,
  get: [checkId],
  post: [checkLogin, checkCreateLocation],
  patch: [checkId],
  delete: [checkId],
  injectQuery,
  query: ['title', 'address'],
};

const handlers = {
  errorHandler,
  errorLogger,
  loggerControllers,
};

const service = new LocationServices(Location);
const controller = new LocationController(service);

const locationRouter = createBasicRouter(controller, middlewares, handlers);

export default locationRouter;
