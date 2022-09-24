import { Router } from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import { checkToken, checkAccess } from '../middleware';

const router = Router();

router.use('/auth', authRouter);

router.use('/user', checkToken, checkAccess('owner'), userRouter);

export { router };
