import { Location } from '../../models';
import { createBasicRouterWithDefaultMiddlewares } from '../../shared/component';
import { LocationController } from './controller';
import { LocationServices } from './services';
import { checkCreateLocation } from './middlewares';
import { injectQuery } from '../../shared/middlewares';

const middlewares = {
  post: [checkCreateLocation, injectQuery(['title', 'address'])],
};

const service = new LocationServices(Location);
const controller = new LocationController(service);

const locationRouter = createBasicRouterWithDefaultMiddlewares(controller, middlewares);

export default locationRouter;
