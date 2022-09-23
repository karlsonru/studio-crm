import { Router } from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);

export { router };
