import mongoose from 'mongoose'

export const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  username: { type: String, required: true },
  isAnswer: { type: Boolean, default: false },
})

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema)
export default Comment
