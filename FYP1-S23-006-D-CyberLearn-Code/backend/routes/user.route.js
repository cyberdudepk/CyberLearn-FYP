import { Router } from 'express';
const router = Router();
import userRoutes from '../controllers/user.js';

router.post('/signup', userRoutes.signup);
router.post('/login', userRoutes.login);
router.post('/enroll', userRoutes.enroll)
router.post('/connectvm', userRoutes.ConnectWindows)
router.post('/connectkalivm', userRoutes.ConnectKali)
export default router;
