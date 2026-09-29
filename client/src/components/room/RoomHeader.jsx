import React from 'react';
import { Film, LogOut, ShieldAlert, Crown } from 'lucide-react';
import RoomCode from './RoomCode';

export default function RoomHeader({ room, isHost, onLeave, onEnd }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#12151e] border border-[#242838] mb-4">
      {/* Title & Code */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-[#2563eb] flex items-center justify-center text-white shrink-0">
          <Film className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <span>{room?.title || 'Watch Party'}</span>
            {isHost && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                <Crown className="w-3 h-3" />
                <span>Host</span>
              </span>
            )}
          </h1>
          <p className="text-xs text-[#9aa2b5]">
            Host: <span className="text-white">{room?.host?.name || 'Host'}</span>
          </p>
        </div>

        <RoomCode code={room?.roomCode} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 self-end sm:self-center">
        {isHost ? (
          <button
            onClick={onEnd}
            className="px-3 py-1.5 rounded-lg border border-red-800/40 bg-red-950/20 hover:bg-red-950/40 text-red-400 text-xs font-medium transition-colors flex items-center gap-1.5"
            type="button"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>End Party</span>
          </button>
        ) : (
          <button
            onClick={onLeave}
            className="px-3 py-1.5 rounded-lg border border-[#242838] bg-[#161a25] hover:bg-[#1f2434] text-[#9aa2b5] hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5"
            type="button"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave Room</span>
          </button>
        )}
      </div>
    </div>
  );
}
