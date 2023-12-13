import express from 'express';
import { addUserInterest } from '../controllers/userInterestController.js';

const router = express.Router();

router.post('/', addUserInterest);

export default router;
