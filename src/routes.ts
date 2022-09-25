import { Router } from 'express';
import authRouter from './components/Auth/routes';
import userRouter from './components/User/routes';
import { checkToken, checkAccess } from './shared';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', checkToken, checkAccess('owner'), userRouter);

export { router };
