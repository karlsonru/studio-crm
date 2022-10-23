import { Router } from 'express';
import authRouter from './components/Auth/routes';
import userRouter from './components/User/routes';
import lessonRouter from './components/Lesson/routes';
import locationRouter from './components/Location/routes';
import roleRouter from './components/Role/routes';
import { checkToken, checkAccess } from './shared/validationMiddlewares';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', checkToken, checkAccess('owners'), userRouter); // мы проверяем дступ для группы. Сюда доступ для группы "Владельцы"
router.use('/lesson', checkToken, checkAccess('owners'), lessonRouter);
router.use('/location', checkToken, locationRouter);
router.use('/role', checkToken, roleRouter);

export { router };
