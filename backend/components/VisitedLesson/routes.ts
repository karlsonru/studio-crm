import { VisitedLesson } from '../../models';
import { createBasicRouterWithDefaultMiddlewares } from '../../shared/component';
import { VisitStatusController } from './controller';
import { VisitStatusServices } from './services';
import { checkCreateVisitStatus } from './middlewares';
import { injectQuery } from '../../shared/middlewares';

const middlewares = {
  post: [checkCreateVisitStatus, injectQuery(['title'])],
};

const service = new VisitStatusServices(VisitedLesson);
const controller = new VisitStatusController(service);

const visitedLessonRouter = createBasicRouterWithDefaultMiddlewares(controller, middlewares);

export default visitedLessonRouter;
