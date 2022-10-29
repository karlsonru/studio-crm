import { Location } from '../../models';
import { createBasicRouter } from '../../shared/component';
import { LocationController } from './controller';
import { LocationServices } from './services';
import { loggerControllers } from '../../config/logger';
import { errorLogger, errorHandler, injectQuery } from '../../shared';
import { checkCreateLocation } from './middlewares';
import { checkLogin, checkId, injectMiddlewares } from '../../shared/middlewares';

const middlewares = {
  injectMiddlewares,
  get: [checkId],
  post: [checkLogin, checkCreateLocation, injectQuery(['title', 'address'])],
  patch: [checkId],
  delete: [checkId],
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
