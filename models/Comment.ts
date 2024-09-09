import mongoose from 'mongoose'

const replySchema = new mongoose.Schema({
  content: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  username: { type: String, required: true },
  isAnswer: { type: Boolean, default: false },
  isCensored: { type: Boolean, default: false }
});

export const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  username: { type: String, required: true },
  isAnswer: { type: Boolean, default: false },
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true }, 
  parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }, 
  replies: [replySchema], 
})

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema)

export default Comment