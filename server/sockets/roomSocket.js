import { Room } from '../models/Room.js';
import { logger } from '../utils/logger.js';

// In-memory map of roomCode -> Set of socket IDs currently in the room
const roomSockets = new Map();

export const roomSocket = (io, socket) => {
  // ─── JOIN ROOM ───────────────────────────────────────────────────────────────
  socket.on('join_room', async ({ roomCode, user }) => {
    if (!roomCode || !user) return;

    const code = roomCode.toUpperCase();
    const userId = (user.id || user._id)?.toString();
    if (!userId) return;

    try {
      const room = await Room.findOne({ roomCode: code, isActive: true })
        .populate('host', 'name avatar');

      if (!room) {
        socket.emit('room_error', { message: 'Room not found or no longer active.' });
        return;
      }

      // Join Socket.IO room
      socket.join(code);
      socket.roomCode = code;
      socket.userId = userId;
      socket.userName = user.name || 'Viewer';

      // Track this socket in the roomSockets map
      if (!roomSockets.has(code)) {
        roomSockets.set(code, new Set());
      }
      roomSockets.get(code).add(socket.id);

      // Add or update participant in DB
      const participantIndex = room.participants.findIndex(
        (p) => p.user.toString() === userId
      );

      if (participantIndex !== -1) {
        room.participants[participantIndex].socketId = socket.id;
        if (user.name) room.participants[participantIndex].name = user.name;
        if (user.avatar) room.participants[participantIndex].avatar = user.avatar;
      } else {
        room.participants.push({
          user: userId,
          name: user.name || 'Viewer',
          avatar: user.avatar || null,
          socketId: socket.id,
          isReady: false,
          fileMatched: false,
          joinedAt: new Date(),
        });
      }
      await room.save();

      logger.info(`Socket ${socket.id} (${user.name || 'Viewer'}) joined room ${code}`);

      // Build current participant list from DB
      const updatedRoom = await Room.findOne({ roomCode: code, isActive: true })
        .populate('host', 'name avatar');

      // Notify all others in the room
      socket.to(code).emit('user_joined', {
        user: { id: userId, name: user.name || 'Viewer', avatar: user.avatar || null },
        participants: updatedRoom?.participants || [],
      });

      // Send room state to the joiner
      socket.emit('room_joined', {
        room: updatedRoom,
        playbackState: updatedRoom?.playbackState || { isPlaying: false, currentTime: 0 },
      });
    } catch (err) {
      logger.error(`join_room error: ${err.message}`);
      socket.emit('room_error', { message: 'Failed to join room.' });
    }
  });

  // ─── LEAVE ROOM ──────────────────────────────────────────────────────────────
  socket.on('leave_room', async ({ roomCode, userId }) => {
    if (!roomCode) return;
    const code = roomCode.toUpperCase();

    await handleLeave(io, socket, code, userId);
  });

  // ─── DISCONNECT: auto-leave any active room ──────────────────────────────────
  socket.on('disconnect', async () => {
    const code = socket.roomCode;
    const userId = socket.userId;

    if (code && userId) {
      await handleLeave(io, socket, code, userId);
    }
  });
};

async function handleLeave(io, socket, code, userId) {
  try {
    socket.leave(code);

    if (roomSockets.has(code)) {
      roomSockets.get(code).delete(socket.id);
      if (roomSockets.get(code).size === 0) {
        roomSockets.delete(code);
      }
    }

    // Clear socketId in DB for this participant
    if (userId) {
      await Room.updateOne(
        { roomCode: code, 'participants.user': userId },
        { $set: { 'participants.$.socketId': null } }
      );
    }

    const updatedRoom = await Room.findOne({ roomCode: code, isActive: true });

    io.to(code).emit('user_left', {
      userId,
      participants: updatedRoom?.participants || [],
    });

    logger.info(`Socket ${socket.id} (user ${userId}) left room ${code}`);
  } catch (err) {
    logger.error(`handleLeave error: ${err.message}`);
  }
}
