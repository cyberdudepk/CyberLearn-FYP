import express from 'express';
import { addUserInterest } from '../controllers/userInterestController.js';
import { getUserInterest } from '../controllers/userInterestController.js';

const router = express.Router();

router.post('/', addUserInterest);
router.get('/:username', getUserInterest);


export default router;
