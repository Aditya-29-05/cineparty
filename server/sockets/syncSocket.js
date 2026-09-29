import { Room } from '../models/Room.js';
import { logger } from '../utils/logger.js';

// DRIFT_THRESHOLD: how many seconds of drift triggers a forced seek
const DRIFT_THRESHOLD = 0.5;

export const syncSocket = (io, socket) => {
  // ─── PLAY ─────────────────────────────────────────────────────────────────
  socket.on('play', async ({ roomCode, currentTime, userId }) => {
    if (!roomCode) return;
    const code = roomCode.toUpperCase();

    try {
      const room = await Room.findOne({ roomCode: code, isActive: true });
      if (!room) return;

      // Enforce host-only controls
      const isHost = room.host.toString() === userId;
      if (room.hostOnlyControls && !isHost) {
        socket.emit('sync_error', { message: 'Only the host can control playback.' });
        return;
      }

      // Update playback state in DB
      await Room.updateOne(
        { roomCode: code },
        {
          $set: {
            'playbackState.isPlaying': true,
            'playbackState.currentTime': currentTime,
            'playbackState.lastUpdated': new Date(),
          },
        }
      );

      // Broadcast play to all other sockets in this room (not the sender)
      socket.to(code).emit('play', { currentTime });
      logger.debug(`[${code}] play @ ${currentTime}s by ${userId}`);
    } catch (err) {
      logger.error(`play event error: ${err.message}`);
    }
  });

  // ─── PAUSE ────────────────────────────────────────────────────────────────
  socket.on('pause', async ({ roomCode, currentTime, userId }) => {
    if (!roomCode) return;
    const code = roomCode.toUpperCase();

    try {
      const room = await Room.findOne({ roomCode: code, isActive: true });
      if (!room) return;

      const isHost = room.host.toString() === userId;
      if (room.hostOnlyControls && !isHost) {
        socket.emit('sync_error', { message: 'Only the host can control playback.' });
        return;
      }

      await Room.updateOne(
        { roomCode: code },
        {
          $set: {
            'playbackState.isPlaying': false,
            'playbackState.currentTime': currentTime,
            'playbackState.lastUpdated': new Date(),
          },
        }
      );

      socket.to(code).emit('pause', { currentTime });
      logger.debug(`[${code}] pause @ ${currentTime}s by ${userId}`);
    } catch (err) {
      logger.error(`pause event error: ${err.message}`);
    }
  });

  // ─── SEEK ─────────────────────────────────────────────────────────────────
  socket.on('seek', async ({ roomCode, currentTime, userId }) => {
    if (!roomCode) return;
    const code = roomCode.toUpperCase();

    try {
      const room = await Room.findOne({ roomCode: code, isActive: true });
      if (!room) return;

      const isHost = room.host.toString() === userId;
      if (room.hostOnlyControls && !isHost) {
        socket.emit('sync_error', { message: 'Only the host can control playback.' });
        return;
      }

      await Room.updateOne(
        { roomCode: code },
        {
          $set: {
            'playbackState.currentTime': currentTime,
            'playbackState.lastUpdated': new Date(),
          },
        }
      );

      socket.to(code).emit('seek', { currentTime });
      logger.debug(`[${code}] seek -> ${currentTime}s by ${userId}`);
    } catch (err) {
      logger.error(`seek event error: ${err.message}`);
    }
  });

  // ─── SYNC REQUEST (from a late-joiner to get current state) ───────────────
  socket.on('sync_request', async ({ roomCode }) => {
    if (!roomCode) return;
    const code = roomCode.toUpperCase();

    try {
      const room = await Room.findOne({ roomCode: code, isActive: true });
      if (!room) return;

      const state = room.playbackState || { isPlaying: false, currentTime: 0 };

      // Calculate how far ahead the server state is since last update
      let estimatedTime = state.currentTime;
      if (state.isPlaying && state.lastUpdated) {
        const elapsed = (Date.now() - new Date(state.lastUpdated).getTime()) / 1000;
        estimatedTime = state.currentTime + elapsed;
      }

      socket.emit('sync_state', {
        isPlaying: state.isPlaying,
        currentTime: estimatedTime,
      });

      logger.debug(`[${code}] sync_state sent -> ${estimatedTime.toFixed(2)}s`);
    } catch (err) {
      logger.error(`sync_request error: ${err.message}`);
    }
  });

  // ─── HEARTBEAT (periodic drift detection) ─────────────────────────────────
  // Client sends its current time every 5s so server can detect drift
  socket.on('heartbeat', async ({ roomCode, currentTime, userId }) => {
    if (!roomCode) return;
    const code = roomCode.toUpperCase();

    try {
      const room = await Room.findOne({ roomCode: code, isActive: true });
      if (!room || !room.playbackState) return;

      const state = room.playbackState;

      // Only check drift if playing
      if (!state.isPlaying) return;

      // Calculate expected server time accounting for elapsed time
      const elapsed = (Date.now() - new Date(state.lastUpdated).getTime()) / 1000;
      const expectedTime = state.currentTime + elapsed;
      const drift = currentTime - expectedTime;

      if (Math.abs(drift) > DRIFT_THRESHOLD) {
        // Correct this client
        socket.emit('sync_state', {
          isPlaying: state.isPlaying,
          currentTime: expectedTime,
          isDriftCorrection: true,
          drift,
        });
        logger.debug(`[${code}] drift correction for ${userId}: ${drift.toFixed(2)}s`);
      }
    } catch (err) {
      logger.error(`heartbeat error: ${err.message}`);
    }
  });
};
