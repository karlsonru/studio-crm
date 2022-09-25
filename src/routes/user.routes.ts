import { Router } from 'express';
import { errorLogger } from '../middleware';
import { loggerControllers } from '../logger';
import { UserController } from '../controllers';
import { checkLogin, checkCreateUser } from '../services';

const userRouter = Router();

userRouter.get('/', UserController.getUsers);
userRouter.get('/:id', UserController.getOneUser);
userRouter.post('/', checkLogin, checkCreateUser, UserController.create);
userRouter.patch('/:id', UserController.patch);
userRouter.delete('/:id', UserController.delete);

userRouter.use(errorLogger(loggerControllers));

export default userRouter;
