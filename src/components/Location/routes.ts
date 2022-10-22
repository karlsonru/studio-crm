import { Router } from 'express';
import { LocationController } from './controller';
import { checkCreateLesson } from './middlewares';
import { loggerControllers } from '../../config/logger';
import {
  errorLogger,
  errorHandler,
  checkLogin,
  checkId,
  validationMiddleware,
} from '../../shared';

const locationRouter = Router();

locationRouter.get('/', LocationController.getLocations);
locationRouter.get('/:id', validationMiddleware([checkId]), LocationController.getLocation);
locationRouter.post('/', validationMiddleware([checkLogin, checkCreateLesson]), LocationController.create);
locationRouter.patch('/:id', validationMiddleware([checkId]), LocationController.patch);
locationRouter.delete('/:id', validationMiddleware([checkId]), LocationController.delete);

locationRouter.use(errorLogger(loggerControllers));
locationRouter.use(errorHandler);

export default locationRouter;
