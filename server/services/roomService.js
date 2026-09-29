import { Room } from '../models/Room.js';
import { generateRoomCode } from '../utils/generateRoomCode.js';

export const roomService = {
  // Create a new room with a guaranteed unique room code
  async createRoom(hostUser, title = 'Watch Party', movieMetadata = null, hostOnlyControls = true) {
    let roomCode = generateRoomCode();
    let codeExists = await Room.exists({ roomCode });

    // Ensure uniqueness
    while (codeExists) {
      roomCode = generateRoomCode();
      codeExists = await Room.exists({ roomCode });
    }

    const hostParticipant = {
      user: hostUser._id,
      name: hostUser.name,
      avatar: hostUser.avatar,
      isReady: false,
      fileMatched: false,
      joinedAt: new Date(),
    };

    const room = await Room.create({
      roomCode,
      title: title || `${hostUser.name}'s Party`,
      host: hostUser._id,
      participants: [hostParticipant],
      movieMetadata: movieMetadata || {},
      hostOnlyControls,
      isActive: true,
    });

    return room;
  },

  // Find room by code
  async getRoomByCode(roomCode) {
    if (!roomCode) return null;
    return await Room.findOne({
      roomCode: roomCode.toUpperCase(),
      isActive: true,
    }).populate('host', 'name email avatar');
  },

  // Add user to room participants
  async joinRoom(roomCode, user) {
    const room = await Room.findOne({
      roomCode: roomCode.toUpperCase(),
      isActive: true,
    }).populate('host', 'name email avatar');

    if (!room) {
      throw new Error('Room not found or no longer active');
    }

    // Check if user is already in participants
    const alreadyJoined = room.participants.some(
      (p) => p.user.toString() === user._id.toString()
    );

    if (!alreadyJoined) {
      room.participants.push({
        user: user._id,
        name: user.name,
        avatar: user.avatar,
        isReady: false,
        fileMatched: false,
        joinedAt: new Date(),
      });
      await room.save();
    }

    return room;
  },

  // Host updates expected movie metadata
  async setMovieMetadata(roomCode, hostUserId, metadata) {
    const room = await Room.findOne({ roomCode: roomCode.toUpperCase(), isActive: true });
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.host.toString() !== hostUserId.toString()) {
      throw new Error('Only the room host can set movie metadata');
    }

    room.movieMetadata = {
      fileName: metadata.fileName || room.movieMetadata?.fileName,
      fileSize: metadata.fileSize || room.movieMetadata?.fileSize,
      fileType: metadata.fileType || room.movieMetadata?.fileType,
      duration: metadata.duration || room.movieMetadata?.duration,
    };

    await room.save();
    return room;
  },

  // Leave or End Room
  async leaveRoom(roomCode, userId) {
    const room = await Room.findOne({ roomCode: roomCode.toUpperCase(), isActive: true });
    if (!room) return null;

    // If host leaves, room is ended
    if (room.host.toString() === userId.toString()) {
      room.isActive = false;
      await room.save();
      return { ended: true, room };
    }

    // Otherwise, remove participant
    room.participants = room.participants.filter(
      (p) => p.user.toString() !== userId.toString()
    );
    await room.save();
    return { ended: false, room };
  },

  // End room explicitly by host
  async endRoom(roomCode, hostUserId) {
    const room = await Room.findOne({ roomCode: roomCode.toUpperCase(), isActive: true });
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.host.toString() !== hostUserId.toString()) {
      throw new Error('Only the host can end the room');
    }

    room.isActive = false;
    await room.save();
    return room;
  },

  // Get active rooms for dashboard
  async getUserRooms(userId) {
    return await Room.find({
      $or: [{ host: userId }, { 'participants.user': userId }],
      isActive: true,
    })
      .sort({ updatedAt: -1 })
      .populate('host', 'name avatar');
  },
};
