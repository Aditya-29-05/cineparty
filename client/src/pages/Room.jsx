import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useRoom } from '../hooks/useRoom';
import { useAuth } from '../context/AuthContext';
import { useVideoSync } from '../hooks/useVideoSync';
import RoomHeader from '../components/room/RoomHeader';
import HostControls from '../components/room/HostControls';
import ParticipantList from '../components/room/ParticipantList';
import FilePicker from '../components/video/FilePicker';
import FileVerification from '../components/video/FileVerification';
import VideoPlayer from '../components/video/VideoPlayer';
import SyncIndicator from '../components/video/SyncIndicator';
import ChatBox from '../components/chat/ChatBox';
import { useSocket } from '../context/SocketContext';
import { roomService } from '../services/roomService';

export default function Room() {
  const { roomCode } = useParams();
  const { user } = useAuth();
  const {
    room,
    isHost,
    isLoading,
    error,
    leaveRoom,
    endRoom,
    updateMetadata,
  } = useRoom(roomCode);

  const { socket } = useSocket();
  const videoPlayerRef = useRef(null);

  const [localFile, setLocalFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [localMetadata, setLocalMetadata] = useState(null);
  // Initialize from DB value once room loads; updated by socket broadcast for all clients
  const [hostOnly, setHostOnly] = useState(true);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [togglingControls, setTogglingControls] = useState(false);

  // Sync hostOnly state from DB value when room first loads
  useEffect(() => {
    if (room) {
      setHostOnly(room.hostOnlyControls ?? true);
    }
  }, [room?.hostOnlyControls]);

  // Listen for controls_changed broadcast from server so ALL clients update instantly
  useEffect(() => {
    if (!socket) return;
    const handleControlsChanged = ({ hostOnlyControls }) => {
      setHostOnly(hostOnlyControls);
    };
    socket.on('controls_changed', handleControlsChanged);
    return () => socket.off('controls_changed', handleControlsChanged);
  }, [socket]);

  const currentUserId = user?.id || user?._id;
  const canControl = isHost || !hostOnly;

  // Persist toggle to server → server broadcasts controls_changed to all clients
  const handleToggleControls = useCallback(async () => {
    if (!isHost || togglingControls) return;
    const prevValue = hostOnly;
    const newValue = !prevValue;
    setHostOnly(newValue); // Optimistic UI update for immediate response
    setTogglingControls(true);

    // Socket emission for instant broadcast across connected clients
    if (socket) {
      socket.emit('toggle_controls', {
        roomCode,
        hostOnlyControls: newValue,
      });
    }

    try {
      const res = await roomService.toggleControls(roomCode, newValue);
      if (res && typeof res.hostOnlyControls === 'boolean') {
        setHostOnly(res.hostOnlyControls);
      }
    } catch (err) {
      console.error('Failed to toggle controls via API', err);
      // Revert optimistic update only if API fails and socket wasn't connected
      if (!socket?.connected) {
        setHostOnly(prevValue);
      }
    } finally {
      setTogglingControls(false);
    }
  }, [isHost, hostOnly, roomCode, togglingControls, socket]);

  // ─── Sync hook — orchestrates all socket ↔ video event wiring ─────────────
  const { emitPlay, emitPause, emitSeek } = useVideoSync({
    roomCode,
    userId: currentUserId,
    isHost,
    hostOnlyControls: hostOnly,
    videoRef: videoPlayerRef,
    hasFile: Boolean(videoUrl),
    onSyncStatus: setSyncStatus,
  });


  const handleFileSelected = ({ file, url, metadata }) => {
    // Revoke previous object URL if any
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setLocalFile(file);
    setVideoUrl(url);
    setLocalMetadata(metadata);
  };

  const handleChangeFile = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setLocalFile(null);
    setVideoUrl(null);
    setLocalMetadata(null);
  };

  const handleSetAsRoomReference = async () => {
    if (!localMetadata) return;
    try {
      await updateMetadata({
        fileName: localMetadata.fileName,
        fileSize: localMetadata.fileSize,
        fileType: localMetadata.fileType,
        duration: localMetadata.duration,
      });
    } catch (err) {
      console.error('Failed to set room reference metadata', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="flex items-center gap-3 text-sm text-[#9aa2b5]">
          <div className="w-4 h-4 rounded-full border-2 border-[#2563eb] border-t-transparent animate-spin" />
          <span>Connecting to Watch Room...</span>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-8 max-w-md w-full rounded-xl bg-[#12151e] border border-[#242838]">
          <div className="w-12 h-12 rounded-xl bg-red-950/30 border border-red-800/40 text-red-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">Room not found</h1>
          <p className="text-sm text-[#9aa2b5] mb-6">
            {error || 'The room may have ended or the code may be incorrect.'}
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-4 sm:p-6">
      {/* Room Header */}
      <RoomHeader
        room={room}
        isHost={isHost}
        onLeave={leaveRoom}
        onEnd={endRoom}
      />

      {/* Control Status Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <HostControls
          hostName={room.host?.name || 'Host'}
          isHost={isHost}
          hostOnlyControls={hostOnly}
          onToggleControls={handleToggleControls}
        />
        <div className="self-end sm:self-center">
          <SyncIndicator status={syncStatus} />
        </div>
      </div>

      {/* Main Watch Layout (Video on Left/Center, Participants & Chat on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left 2 Cols: Video Player & Verification */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {!videoUrl ? (
            <FilePicker
              onFileSelected={handleFileSelected}
              isHost={isHost}
            />
          ) : (
            <VideoPlayer
              ref={videoPlayerRef}
              videoUrl={videoUrl}
              canControl={canControl}
              onLocalPlay={emitPlay}
              onLocalPause={emitPause}
              onLocalSeek={emitSeek}
            />
          )}

          {/* Local File Verification Card */}
          {localMetadata && (
            <FileVerification
              localMetadata={localMetadata}
              expectedMetadata={room.movieMetadata}
              isHost={isHost}
              onSetAsRoomReference={handleSetAsRoomReference}
              onChangeFile={handleChangeFile}
            />
          )}
        </div>

        {/* Right 1 Col: Participants & Chat */}
        <div className="flex flex-col gap-4">
          <div className="h-64">
            <ParticipantList
              participants={room.participants || []}
              hostId={room.host?._id || room.host}
              currentUserId={currentUserId}
            />
          </div>

          <div className="flex-1 min-h-64 flex flex-col">
            <ChatBox roomCode={roomCode} />
          </div>
        </div>
      </div>
    </div>
  );
}
