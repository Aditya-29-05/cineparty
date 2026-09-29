import React from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import { formatTime } from '../../utils/formatTime';

export default function VideoControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  canControl = true,
}) {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-[#0b0d13]/90 backdrop-blur-md border-t border-[#242838] px-4 py-3 flex flex-col gap-2 rounded-b-xl select-none">
      {/* Scrubber Progress Bar */}
      <div className="relative w-full flex items-center group">
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={currentTime || 0}
          disabled={!canControl}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-[#1f2434] rounded-lg appearance-none cursor-pointer accent-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Control Buttons Row */}
      <div className="flex items-center justify-between text-white text-xs">
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={onPlayPause}
            disabled={!canControl}
            className="p-1.5 rounded-md hover:bg-[#1a1e2b] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-white"
            title={canControl ? (isPlaying ? 'Pause' : 'Play') : 'Playback locked by host'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white" />
            )}
          </button>

          {/* Time Display */}
          <div className="font-mono text-xs text-[#9aa2b5] flex items-center gap-1">
            <span className="text-white font-medium">{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Volume */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleMute}
              className="p-1.5 rounded-md hover:bg-[#1a1e2b] text-[#9aa2b5] hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-1 bg-[#1f2434] rounded appearance-none accent-[#2563eb] cursor-pointer"
            />
          </div>

          {/* Fullscreen */}
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-md hover:bg-[#1a1e2b] text-[#9aa2b5] hover:text-white transition-colors"
            title="Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
