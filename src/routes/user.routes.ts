import { Router } from 'express';
import { errorLogger } from '../middleware';
import { loggerControllers } from '../logger';
import { UserController } from '../controllers';

const userRouter = Router();

userRouter.get('/', UserController.getUsers);
userRouter.get('/:id', UserController.getOneUser);
userRouter.post('/', UserController.create);
userRouter.patch('/:id', UserController.patch);
userRouter.delete('/:id', UserController.delete);

userRouter.use(errorLogger(loggerControllers));

export default userRouter;
