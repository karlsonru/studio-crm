import { Router } from 'express';
import { UserController } from '../controllers';

const userRouter = Router();

userRouter.get('/', UserController.getUsers);
userRouter.get('/:id', UserController.getOneUser);
userRouter.post('/', UserController.create);
userRouter.patch('/:id', UserController.patch);
userRouter.delete('/:id', UserController.delete);

export default userRouter;
