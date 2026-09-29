import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomService } from '../services/roomService';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export function useRoom(roomCode) {
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const fetchRoom = useCallback(async () => {
    if (!roomCode) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await roomService.getRoom(roomCode);
      if (res.success && res.room) {
        setRoom(res.room);
      } else {
        setError('Room not found or no longer active');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load room');
    } finally {
      setIsLoading(false);
    }
  }, [roomCode]);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  // ─── Live participant updates via Socket.IO ──────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleUserJoined = ({ participants }) => {
      setRoom((prev) => prev ? { ...prev, participants } : prev);
    };

    const handleUserLeft = ({ participants }) => {
      setRoom((prev) => prev ? { ...prev, participants } : prev);
    };

    const handleRoomEnded = () => {
      navigate('/', { state: { message: 'The host ended the watch party.' } });
    };

    socket.on('user_joined', handleUserJoined);
    socket.on('user_left', handleUserLeft);
    socket.on('room_ended', handleRoomEnded);

    return () => {
      socket.off('user_joined', handleUserJoined);
      socket.off('user_left', handleUserLeft);
      socket.off('room_ended', handleRoomEnded);
    };
  }, [socket, navigate]);

  const currentUserId = user?.id || user?._id;
  const roomHostId = room?.host?._id || room?.host;
  const isHost = Boolean(
    currentUserId && roomHostId && String(roomHostId) === String(currentUserId)
  );

  const handleLeave = async () => {
    try {
      await roomService.leaveRoom(roomCode);
      navigate('/');
    } catch (err) {
      navigate('/');
    }
  };

  const handleEnd = async () => {
    if (!window.confirm('Are you sure you want to end this watch party for everyone?')) {
      return;
    }
    try {
      // Notify all clients via socket before DB update
      if (socket) socket.emit('room_ended', { roomCode });
      await roomService.endRoom(roomCode);
      navigate('/');
    } catch (err) {
      console.error('Failed to end room', err);
    }
  };

  const updateMetadata = async (metadata) => {
    try {
      const res = await roomService.setRoomMetadata(roomCode, metadata);
      if (res.success && res.room) {
        setRoom(res.room);
      }
      return res;
    } catch (err) {
      console.error('Failed to update room metadata', err);
      throw err;
    }
  };

  return {
    room,
    setRoom,
    isHost,
    isLoading,
    error,
    refreshRoom: fetchRoom,
    leaveRoom: handleLeave,
    endRoom: handleEnd,
    updateMetadata,
  };
}
