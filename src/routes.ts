import { Router } from 'express';
import authRouter from './components/Auth/routes';
import userRouter from './components/User/routes';
import lessonRouter from './components/Lesson/routes';
import locationRouter from './components/Location/routes';
import { checkToken, checkAccess } from './shared/validationMiddlewares';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', checkToken, checkAccess('owners'), userRouter); // мы проверяем дступ для группы. Сюда доступ для группы "Владельцы"
router.use('/lesson', checkToken, checkAccess('owners'), lessonRouter); // мы проверяем дступ для группы. Сюда доступ для группы "Владельцы"
router.use('/location', checkToken, locationRouter); // мы проверяем дступ для группы. Сюда доступ для группы "Владельцы"

export { router };
