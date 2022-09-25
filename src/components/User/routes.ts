import { Router } from 'express';
import { UserController } from './controller';
import { checkCreateUser } from './middlewares';
import { loggerControllers } from '../../config/logger';
import {
  errorLogger,
  errorHandler,
  checkLogin,
  checkId,
  validationMiddleware,
} from '../../shared';

const userRouter = Router();

userRouter.get('/', UserController.getUsers);
userRouter.get('/:id', validationMiddleware([checkId]), UserController.getOneUser);
userRouter.post('/', validationMiddleware([checkLogin, checkCreateUser]), UserController.create);
userRouter.patch('/:id', validationMiddleware([checkId]), UserController.patch);
userRouter.delete('/:id', validationMiddleware([checkId]), UserController.delete);

userRouter.use(errorLogger(loggerControllers));
userRouter.use(errorHandler);

export default userRouter;
