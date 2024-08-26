import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  username: { type: String, required: true },
  isAnswer: { type: Boolean, default: false },
});

const threadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['THREAD', 'QNA'], required: true },
  creationDate: { type: Date, default: Date.now },
  comments: [commentSchema],
  username: { type: String, required: true },
  isLocked: { type: Boolean, default: false },
});

const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema)

export default Thread
