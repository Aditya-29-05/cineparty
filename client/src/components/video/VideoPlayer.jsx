import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Play, Volume2, AlertCircle } from 'lucide-react';
import VideoControls from './VideoControls';

const VideoPlayer = forwardRef(function VideoPlayer(
  {
    videoUrl,
    canControl = true,
    onLocalPlay,
    onLocalPause,
    onLocalSeek,
    onLocalTimeUpdate,
  },
  ref
) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isReadyToWatch, setIsReadyToWatch] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  // Expose methods to parent/sync hook
  useImperativeHandle(ref, () => ({
    get videoElement() {
      return videoRef.current;
    },
    play: async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
          setAutoplayBlocked(false);
        } catch (err) {
          if (err.name === 'NotAllowedError') {
            setAutoplayBlocked(true);
          }
        }
      }
    },
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    },
    seekTo: (time) => {
      if (videoRef.current && !isNaN(time)) {
        videoRef.current.currentTime = time;
      }
    },
    getCurrentTime: () => {
      return videoRef.current ? videoRef.current.currentTime : 0;
    },
    getDuration: () => {
      return videoRef.current ? videoRef.current.duration : 0;
    },
    getIsPlaying: () => {
      return videoRef.current ? !videoRef.current.paused : false;
    },
  }));

  // Handle local video events
  const handlePlay = () => {
    setIsPlaying(true);
    setAutoplayBlocked(false);
    if (onLocalPlay) onLocalPlay(videoRef.current.currentTime);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (onLocalPause) onLocalPause(videoRef.current.currentTime);
  };

  const handleSeeked = () => {
    if (onLocalSeek) onLocalSeek(videoRef.current.currentTime);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      if (onLocalTimeUpdate) onLocalTimeUpdate(time);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handlePlayPause = () => {
    if (!canControl) return;
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => setAutoplayBlocked(true));
    } else {
      videoRef.current.pause();
    }
  };

  const handleSeek = (newTime) => {
    if (!canControl || !videoRef.current) return;
    videoRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    videoRef.current.muted = nextMute;
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  const handleReadyToWatch = () => {
    setIsReadyToWatch(true);
    setAutoplayBlocked(false);
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        videoRef.current.pause(); // Initial user interaction unlocked audio/autoplay
      }).catch((err) => console.log('Ready unlock:', err));
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col w-full rounded-xl bg-black border border-[#242838] overflow-hidden group shadow-lg"
    >
      <div className="relative aspect-video w-full flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          playsInline
          onPlay={handlePlay}
          onPause={handlePause}
          onSeeked={handleSeeked}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          className="w-full h-full object-contain"
        />

        {/* Autoplay Gate Overlay (Section 17) */}
        {(!isReadyToWatch || autoplayBlocked) && (
          <div className="absolute inset-0 bg-[#0b0d13]/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-12 h-12 rounded-xl bg-[#2563eb] text-white flex items-center justify-center mb-4 shadow-md">
              <Play className="w-6 h-6 fill-white" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">
              Ready to Synchronize
            </h3>
            <p className="text-xs text-[#9aa2b5] max-w-sm mb-6 leading-relaxed">
              Browsers require user interaction before allowing synchronized audio playback.
            </p>
            <button
              onClick={handleReadyToWatch}
              className="px-6 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              Ready to Watch
            </button>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <VideoControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        canControl={canControl}
        onPlayPause={handlePlayPause}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        onToggleFullscreen={handleToggleFullscreen}
      />
    </div>
  );
});

export default VideoPlayer;
