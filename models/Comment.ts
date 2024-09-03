import mongoose from 'mongoose';

// Define the reply schema
const replySchema = new mongoose.Schema({
  content: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  username: { type: String, required: true },
  isAnswer: { type: Boolean, default: false },
});

// Define the comment schema
export const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  username: { type: String, required: true },
  isAnswer: { type: Boolean, default: false },
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true }, // Thread ID reference
  parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }, // Reference for nested comments
  replies: [replySchema], // This is the field for the replies
});

// Create or use existing Comment model
const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export default Comment;