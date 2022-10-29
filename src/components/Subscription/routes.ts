import { Subscription } from '../../models';
import { createBasicRouter } from '../../shared/component';
import { SubscriptionController } from './controller';
import { SubscriptionServices } from './services';
import { loggerControllers } from '../../config/logger';
import { errorLogger, errorHandler } from '../../shared';
import { checkCreateSubscription } from './middlewares';
import { checkLogin, checkId, injectMiddlewares } from '../../shared/middlewares';

const middlewares = {
  injectMiddlewares,
  get: [checkId],
  post: [checkLogin, checkCreateSubscription],
  patch: [checkId],
  delete: [checkId],
};

const handlers = {
  errorHandler,
  errorLogger,
  loggerControllers,
};

const service = new SubscriptionServices(Subscription);
const controller = new SubscriptionController(service);

const subscriptionRouter = createBasicRouter(controller, middlewares, handlers);

export default subscriptionRouter;
