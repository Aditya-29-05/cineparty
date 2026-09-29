import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { roomSocket } from './roomSocket.js';
import { syncSocket } from './syncSocket.js';
import { chatSocket } from './chatSocket.js';
import { logger } from '../utils/logger.js';

export const initializeSocket = (httpServer) => {
  const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:3000';

  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // ─── Optional JWT authentication middleware ──────────────────────────────
  // Sockets can connect unauthenticated (for public room viewing) but
  // controlled playback events require userId verification at the event level.
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cineparty_jwt_secret');
        const user = await User.findById(decoded.id).select('name email avatar');
        if (user) {
          socket.authUser = user;
        }
      } catch {
        // Non-fatal: guest connections or expired tokens proceed without authUser
      }
    }

    next();
  });

  io.on('connection', (socket) => {
    const who = socket.authUser ? socket.authUser.name : 'Guest';
    logger.info(`Socket connected: ${socket.id} (${who})`);

    // Register all event namespaces
    roomSocket(io, socket);
    syncSocket(io, socket);
    chatSocket(io, socket);

    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected (${socket.id} — ${who}): ${reason}`);
    });
  });

  return io;
};
