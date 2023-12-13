import Comment from '../models/commentModel.js';

export async function addComment(req, res) {
  try {
    const { username, comment, rating, courseId } = req.body;
    const newComment = new Comment({
      username,
      comment,
      rating,
      courseId
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

export async function getCommentsByCourse(req, res)  {
    try {
      const courseId = req.params.courseId;
      const comments = await Comment.find({ courseId }).sort({ createdAt: -1 });
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving comments", error: error.message });
    }
  };
  
