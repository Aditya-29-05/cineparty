import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    socketId: {
      type: String,
      default: null,
    },
    isReady: {
      type: Boolean,
      default: false,
    },
    fileMatched: {
      type: Boolean,
      default: false,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const movieMetadataSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      default: null,
    },
    fileSize: {
      type: Number,
      default: null,
    },
    fileType: {
      type: String,
      default: null,
    },
    duration: {
      type: Number,
      default: null,
    },
  },
  { _id: false }
);

const playbackStateSchema = new mongoose.Schema(
  {
    isPlaying: {
      type: Boolean,
      default: false,
    },
    currentTime: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      default: 'Watch Party',
      trim: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [participantSchema],
    movieMetadata: {
      type: movieMetadataSchema,
      default: () => ({}),
    },
    playbackState: {
      type: playbackStateSchema,
      default: () => ({}),
    },
    hostOnlyControls: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Room = mongoose.model('Room', roomSchema);
