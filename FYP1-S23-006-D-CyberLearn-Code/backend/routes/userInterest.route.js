import express from 'express';
import { addUserInterest } from '../controllers/userInterestController.js';

const router = express.Router();

router.post('/', addUserInterest);
router.get('/:id' , getUserInterest)

export default router;
