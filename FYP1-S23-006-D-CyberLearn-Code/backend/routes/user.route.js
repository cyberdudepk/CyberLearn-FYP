import { Router } from 'express';
import userRoutes from '../controllers/user.js';

const router = Router();

router.post('/signup', userRoutes.signup);
router.post('/login', userRoutes.login);
router.post('/enroll', userRoutes.enroll);
router.post('/connectvm', userRoutes.ConnectWindows);
router.post('/connectkalivm', userRoutes.ConnectKali);
router.get('/isEnrolled', userRoutes.isEnrolled);
router.get('/getEnrolledCourses', userRoutes.getEnrolledCourses);
router.post('/unenroll', userRoutes.unenroll);

export default router;
