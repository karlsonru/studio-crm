import { SubscriptionTemplate } from '../../models';
import { createBasicRouter } from '../../shared/component';
import { SubscriptionTemplateController } from './controller';
import { SubscriptionTemplateServices } from './services';
import { loggerControllers } from '../../config/logger';
import { errorLogger, errorHandler, injectQuery } from '../../shared';
import { checkCreateSubscriptionTemplate } from './middlewares';
import { checkLogin, checkId, injectMiddlewares } from '../../shared/middlewares';

const middlewares = {
  injectMiddlewares,
  get: [checkId],
  post: [checkLogin, checkCreateSubscriptionTemplate, injectQuery(['title', 'price', 'visits', 'duration'])],
  patch: [checkId],
  delete: [checkId],
};

const handlers = {
  errorHandler,
  errorLogger,
  loggerControllers,
};

const service = new SubscriptionTemplateServices(SubscriptionTemplate);
const controller = new SubscriptionTemplateController(service);

const subscriptionTemplateRouter = createBasicRouter(controller, middlewares, handlers);

export default subscriptionTemplateRouter;
