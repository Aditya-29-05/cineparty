import { useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';

// Heartbeat interval: every 5 seconds as specified in Section 16
const HEARTBEAT_INTERVAL_MS = 5000;

/**
 * useVideoSync
 *
 * Orchestrates bi-directional synchronization between the local HTML5 video
 * player and all other participants via Socket.IO.
 *
 * Key design decisions:
 *  - isRemoteAction ref prevents event loops (Section 15): when we apply a
 *    remote event (play/pause/seek) we set isRemoteAction=true before touching
 *    the video element, then reset it in the subsequent local event handler so
 *    we never re-emit a socket event for an action we received from the network.
 *  - Drift correction (Section 16): a heartbeat emits currentTime every 5s.
 *    The server compares it against the authoritative playback state and sends
 *    a sync_state event only when drift > 0.5s.
 */
export function useVideoSync({
  roomCode,
  userId,
  isHost,
  hostOnlyControls,
  videoRef,       // ref to VideoPlayer's imperative handle
  hasFile,        // whether the user has loaded a local file
  onSyncStatus,  // callback(status: 'synced' | 'syncing' | 'drifted')
}) {
  const { socket } = useSocket();

  // Prevents local event handlers from re-emitting socket events
  const isRemoteAction = useRef(false);
  const heartbeatTimer = useRef(null);

  const canEmit = isHost || !hostOnlyControls;

  // ─── JOIN ROOM ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !roomCode || !userId) return;

    socket.emit('join_room', {
      roomCode,
      user: { id: userId, name: '', avatar: '' }, // minimal user info for presence
    });

    // On room_joined: apply current server playback state
    const handleRoomJoined = ({ playbackState }) => {
      if (!videoRef?.current || !hasFile) return;
      applyRemoteState(playbackState);
      onSyncStatus?.('synced');
    };

    // Request a sync_state on reconnection
    const handleReconnect = () => {
      socket.emit('sync_request', { roomCode });
      onSyncStatus?.('syncing');
    };

    socket.on('room_joined', handleRoomJoined);
    socket.on('reconnect', handleReconnect);

    return () => {
      socket.off('room_joined', handleRoomJoined);
      socket.off('reconnect', handleReconnect);
      socket.emit('leave_room', { roomCode, userId });
    };
  }, [socket, roomCode, userId, hasFile]);

  // ─── INCOMING SYNC EVENTS ─────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleRemotePlay = ({ currentTime }) => {
      if (!videoRef?.current || !hasFile) return;
      onSyncStatus?.('syncing');
      isRemoteAction.current = true;
      if (Math.abs(videoRef.current.getCurrentTime() - currentTime) > 0.3) {
        videoRef.current.seekTo(currentTime);
      }
      videoRef.current.play().finally(() => {
        // isRemoteAction is reset by the local onPlay handler
        onSyncStatus?.('synced');
      });
    };

    const handleRemotePause = ({ currentTime }) => {
      if (!videoRef?.current || !hasFile) return;
      onSyncStatus?.('syncing');
      isRemoteAction.current = true;
      if (Math.abs(videoRef.current.getCurrentTime() - currentTime) > 0.3) {
        videoRef.current.seekTo(currentTime);
      }
      videoRef.current.pause();
      onSyncStatus?.('synced');
    };

    const handleRemoteSeek = ({ currentTime }) => {
      if (!videoRef?.current || !hasFile) return;
      onSyncStatus?.('syncing');
      isRemoteAction.current = true;
      videoRef.current.seekTo(currentTime);
      onSyncStatus?.('synced');
    };

    // Received from server: authoritative state (late-join or drift correction)
    const handleSyncState = ({ isPlaying, currentTime, isDriftCorrection, drift }) => {
      if (!videoRef?.current || !hasFile) return;

      if (isDriftCorrection) {
        onSyncStatus?.('drifted');
      } else {
        onSyncStatus?.('syncing');
      }

      isRemoteAction.current = true;
      videoRef.current.seekTo(currentTime);

      if (isPlaying) {
        videoRef.current.play().finally(() => onSyncStatus?.('synced'));
      } else {
        videoRef.current.pause();
        onSyncStatus?.('synced');
      }
    };

    socket.on('play', handleRemotePlay);
    socket.on('pause', handleRemotePause);
    socket.on('seek', handleRemoteSeek);
    socket.on('sync_state', handleSyncState);

    return () => {
      socket.off('play', handleRemotePlay);
      socket.off('pause', handleRemotePause);
      socket.off('seek', handleRemoteSeek);
      socket.off('sync_state', handleSyncState);
    };
  }, [socket, videoRef, hasFile]);

  // ─── HEARTBEAT for drift detection ────────────────────────────────────────
  useEffect(() => {
    if (!socket || !roomCode || !hasFile) return;

    heartbeatTimer.current = setInterval(() => {
      if (!videoRef?.current) return;
      const currentTime = videoRef.current.getCurrentTime();
      socket.emit('heartbeat', { roomCode, currentTime, userId });
    }, HEARTBEAT_INTERVAL_MS);

    return () => {
      if (heartbeatTimer.current) {
        clearInterval(heartbeatTimer.current);
      }
    };
  }, [socket, roomCode, userId, hasFile]);

  // ─── LOCAL → SOCKET emitters ──────────────────────────────────────────────
  // These are called from the VideoPlayer's event callbacks.
  // isRemoteAction guard ensures we never re-emit what came from the network.

  const emitPlay = useCallback(
    (currentTime) => {
      if (!canEmit || !socket || !roomCode) return;
      if (isRemoteAction.current) {
        isRemoteAction.current = false; // reset flag; don't emit
        return;
      }
      socket.emit('play', { roomCode, currentTime, userId });
    },
    [socket, roomCode, userId, canEmit]
  );

  const emitPause = useCallback(
    (currentTime) => {
      if (!canEmit || !socket || !roomCode) return;
      if (isRemoteAction.current) {
        isRemoteAction.current = false;
        return;
      }
      socket.emit('pause', { roomCode, currentTime, userId });
    },
    [socket, roomCode, userId, canEmit]
  );

  const emitSeek = useCallback(
    (currentTime) => {
      if (!canEmit || !socket || !roomCode) return;
      if (isRemoteAction.current) {
        isRemoteAction.current = false;
        return;
      }
      socket.emit('seek', { roomCode, currentTime, userId });
    },
    [socket, roomCode, userId, canEmit]
  );

  return { emitPlay, emitPause, emitSeek };
}
