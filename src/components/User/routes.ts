import { Router } from 'express';
import { UserController } from './controller';
import { checkCreateUser } from './middlewares';
import { loggerControllers } from '../config/logger';
import { errorLogger, checkLogin } from '../shared';

const userRouter = Router();

userRouter.get('/', UserController.getUsers);
userRouter.get('/:id', UserController.getOneUser);
userRouter.post('/', checkLogin, checkCreateUser, UserController.create);
userRouter.patch('/:id', UserController.patch);
userRouter.delete('/:id', UserController.delete);

userRouter.use(errorLogger(loggerControllers));

export default userRouter;
