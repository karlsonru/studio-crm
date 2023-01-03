import { Lesson } from '../../models';
import { createBasicRouterWithDefaultMiddlewares } from '../../shared/component';
import { injectQuery } from '../../shared/middlewares';
import { LessonController } from './controller';
import { LessonServices } from './services';
import { checkCreateLesson } from './middlewares';

const middlewares = {
  post: [checkCreateLesson, injectQuery(['location', 'day', 'timeStart', 'teacher'])],
};

const service = new LessonServices(Lesson, [{ path: 'teacher', select: '-password' }, 'location']);
const controller = new LessonController(service);

const lessonRouter = createBasicRouterWithDefaultMiddlewares(controller, middlewares);

lessonRouter.post('/findByDay', controller.findByDay);

export default lessonRouter;
