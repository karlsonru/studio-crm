import { Router } from 'express';
import authRouter from './Auth/routes';
import userRouter from './User/routes';
import { checkToken, checkAccess } from './shared';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', checkToken, checkAccess('owner'), userRouter);

export { router };
