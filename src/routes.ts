import { Router } from 'express';
import authRouter from './components/Auth/routes';
import userRouter from './components/User/routes';
import lessonRouter from './components/Lesson/routes';
import { checkToken, checkAccess } from './shared';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', checkToken, checkAccess('owners'), userRouter); // мы проверяем дступ для группы. Сюда доступ для группы "Владельцы"
router.use('/lesson', checkToken, checkAccess('owners'), lessonRouter); // мы проверяем дступ для группы. Сюда доступ для группы "Владельцы"

export { router };
