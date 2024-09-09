import mongoose from 'mongoose'
import { commentSchema } from './Comment'

const threadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['THREAD', 'QNA'], required: true },
  creationDate: { type: Date, default: Date.now },
  comments: [commentSchema], 
  username: { type: String, required: true },
  isLocked: { type: Boolean, default: false },
  isCensored: { type: Boolean, default: false }
})

const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema)
export default Thread
