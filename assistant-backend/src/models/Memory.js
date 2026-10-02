import mongoose from 'mongoose';

const MemorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'default-user'
  },
  key: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Avoid OverwriteModelError in Next.js hot-reloading
const Memory = mongoose.models.Memory || mongoose.model('Memory', MemorySchema);

export default Memory;
