import { Subscription } from '../../models';
import { createBasicRouterWithDefaultMiddlewares } from '../../shared/component';
import { SubscriptionController } from './controller';
import { SubscriptionServices } from './services';
import { checkCreateSubscription } from './middlewares';
import { injectQuery } from '../../shared/middlewares/injectQuery';

const middlewares = {
  post: [checkCreateSubscription, injectQuery(['_id'])],
};

const service = new SubscriptionServices(Subscription, ['student']);
const controller = new SubscriptionController(service);

const subscriptionRouter = createBasicRouterWithDefaultMiddlewares(controller, middlewares);

export default subscriptionRouter;
