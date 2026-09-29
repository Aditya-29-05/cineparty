import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderAvatar: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model('Message', messageSchema);
