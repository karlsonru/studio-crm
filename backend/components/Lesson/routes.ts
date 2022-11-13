import { Lesson } from '../../models';
import { createBasicRouterWithDefaultMiddlewares } from '../../shared/component';
import { LessonController } from './controller';
import { LessonServices } from './services';
import { checkCreateLesson } from './middlewares';

const middlewares = {
  post: [checkCreateLesson],
};

const service = new LessonServices(Lesson);
const controller = new LessonController(service);

const lessonRouter = createBasicRouterWithDefaultMiddlewares(controller, middlewares);

lessonRouter.post('/findByDay', controller.findByDay);

export default lessonRouter;
