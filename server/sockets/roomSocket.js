import { Room } from '../models/Room.js';
import { logger } from '../utils/logger.js';

// In-memory map of roomCode -> Set of socket IDs currently in the room
// This lets us quickly look up who is in which room
const roomSockets = new Map();

export const roomSocket = (io, socket) => {
  // ─── JOIN ROOM ───────────────────────────────────────────────────────────────
  socket.on('join_room', async ({ roomCode, user }) => {
    if (!roomCode || !user) return;

    const code = roomCode.toUpperCase();

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
      socket.userId = user.id;
      socket.userName = user.name;

      // Track this socket in the roomSockets map
      if (!roomSockets.has(code)) {
        roomSockets.set(code, new Set());
      }
      roomSockets.get(code).add(socket.id);

      // Update participant socketId in DB
      await Room.updateOne(
        { roomCode: code, 'participants.user': user.id },
        { $set: { 'participants.$.socketId': socket.id } }
      );

      logger.info(`Socket ${socket.id} (${user.name}) joined room ${code}`);

      // Build current participant list from DB
      const updatedRoom = await Room.findOne({ roomCode: code, isActive: true })
        .populate('host', 'name avatar');

      // Notify all others in the room
      socket.to(code).emit('user_joined', {
        user: { id: user.id, name: user.name, avatar: user.avatar },
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
    await Room.updateOne(
      { roomCode: code, 'participants.user': userId },
      { $set: { 'participants.$.socketId': null } }
    );

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
