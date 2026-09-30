import { Message } from '../models/Message.js';
import { Room } from '../models/Room.js';
import { logger } from '../utils/logger.js';

export const chatSocket = (io, socket) => {
  // ─── SEND MESSAGE ──────────────────────────────────────────────────────────
  socket.on('send_message', async ({ roomCode, text, userId, userName, userAvatar }) => {
    if (!roomCode || !text?.trim() || !userId) return;

    const code = roomCode.toUpperCase();

    try {
      // Verify room is active
      const room = await Room.findOne({ roomCode: code, isActive: true });
      if (!room) {
        socket.emit('chat_error', { message: 'Room not found or no longer active.' });
        return;
      }

      // Ensure user is registered as a participant if not already present
      const isHost = room.host.toString() === userId.toString();
      const existingParticipant = room.participants.find(
        (p) => p.user.toString() === userId.toString()
      );

      if (!isHost && !existingParticipant) {
        room.participants.push({
          user: userId,
          name: userName || 'Viewer',
          avatar: userAvatar || null,
          socketId: socket.id,
          isReady: false,
          fileMatched: false,
          joinedAt: new Date(),
        });
        await room.save();
      }

      // Ensure this socket has joined the Socket.IO room channel
      if (!socket.rooms.has(code)) {
        socket.join(code);
      }

      // Persist message
      const savedMessage = await Message.create({
        roomCode: code,
        sender: userId,
        senderName: userName || 'Viewer',
        senderAvatar: userAvatar || null,
        text: text.trim().slice(0, 500),
      });

      const messagePayload = {
        id: savedMessage._id,
        sender: userId,
        senderName: savedMessage.senderName,
        senderAvatar: savedMessage.senderAvatar,
        text: savedMessage.text,
        createdAt: savedMessage.createdAt,
      };

      // Broadcast to entire room including sender
      io.to(code).emit('receive_message', messagePayload);
      logger.debug(`[${code}] message from ${userName}: "${savedMessage.text.slice(0, 40)}"`);
    } catch (err) {
      logger.error(`send_message error: ${err.message}`);
      socket.emit('chat_error', { message: 'Failed to send message.' });
    }
  });

  // ─── FETCH HISTORY (on room join, client requests recent messages) ─────────
  socket.on('fetch_messages', async ({ roomCode, limit = 50 }) => {
    if (!roomCode) return;
    const code = roomCode.toUpperCase();

    try {
      const messages = await Message.find({ roomCode: code })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      socket.emit('message_history', messages.reverse().map((m) => ({
        id: m._id,
        sender: m.sender,
        senderName: m.senderName,
        senderAvatar: m.senderAvatar,
        text: m.text,
        createdAt: m.createdAt,
      })));
    } catch (err) {
      logger.error(`fetch_messages error: ${err.message}`);
    }
  });
};
