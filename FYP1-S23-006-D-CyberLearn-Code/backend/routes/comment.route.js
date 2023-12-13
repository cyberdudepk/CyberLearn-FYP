import express from 'express';
import * as commentController from '../controllers/comment.js';

const router = express.Router();

router.post('/comments', commentController.addComment);
router.get('/comments/:courseId', commentController.getCommentsByCourse);

export default router;