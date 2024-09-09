import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  clerkId: { type: String, required: true, unique: true },
  isModerator: { type: Boolean, default: false },
})

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User