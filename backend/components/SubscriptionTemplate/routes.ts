import { SubscriptionTemplate } from '../../models';
import { createBasicRouterWithDefaultMiddlewares } from '../../shared/component';
import { SubscriptionTemplateController } from './controller';
import { SubscriptionTemplateServices } from './services';
import { checkCreateSubscriptionTemplate } from './middlewares';
import { injectQuery } from '../../shared/middlewares';

const middlewares = {
  post: [checkCreateSubscriptionTemplate, injectQuery(['title', 'price', 'visits', 'duration'])],
};

const service = new SubscriptionTemplateServices(SubscriptionTemplate);
const controller = new SubscriptionTemplateController(service);

const subscriptionTemplateRouter = createBasicRouterWithDefaultMiddlewares(controller, middlewares);

export default subscriptionTemplateRouter;
