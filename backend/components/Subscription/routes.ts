import { Subscription } from '../../models';
import { createBasicRouterWithDefaultMiddlewares } from '../../shared/component';
import { SubscriptionController } from './controller';
import { SubscriptionServices } from './services';
import { checkCreateSubscription } from './middlewares';

const middlewares = {
  post: [checkCreateSubscription],
};

const service = new SubscriptionServices(Subscription);
const controller = new SubscriptionController(service);

const subscriptionRouter = createBasicRouterWithDefaultMiddlewares(controller, middlewares);

export default subscriptionRouter;
