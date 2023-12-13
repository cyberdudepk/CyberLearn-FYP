const mongoose = require('mongoose');

// Define the schema for a comment
const commentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Assuming you have a Course model
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model from the schema
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
