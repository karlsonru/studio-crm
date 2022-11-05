import { VisitStatus } from '../../models';
import { createBasicRouterWithDefaultMiddlewares } from '../../shared/component';
import { VisitStatusController } from './controller';
import { VisitStatusServices } from './services';
import { checkCreateVisitStatus } from './middlewares';
import { injectQuery } from '../../shared/middlewares';

const middlewares = {
  post: [checkCreateVisitStatus, injectQuery(['title'])],
};

const service = new VisitStatusServices(VisitStatus);
const controller = new VisitStatusController(service);

const visitStatusRouter = createBasicRouterWithDefaultMiddlewares(controller, middlewares);

export default visitStatusRouter;
