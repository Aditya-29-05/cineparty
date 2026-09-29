import React from 'react';
import { Lock, Unlock, Crown } from 'lucide-react';

export default function HostControls({ hostName, isHost, hostOnlyControls, onToggleControls }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#161a25] border border-[#242838] text-xs">
      <div className="flex items-center gap-2">
        <Crown className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[#9aa2b5]">
          Host: <span className="text-white font-medium">{hostName}</span>
        </span>
        <span className="text-[#5e667d]">•</span>
        <span className="flex items-center gap-1 text-[#9aa2b5]">
          {hostOnlyControls ? (
            <>
              <Lock className="w-3 h-3 text-[#2563eb]" />
              <span>Playback controlled by host</span>
            </>
          ) : (
            <>
              <Unlock className="w-3 h-3 text-emerald-400" />
              <span>Open playback control</span>
            </>
          )}
        </span>
      </div>

      {isHost && onToggleControls && (
        <button
          onClick={onToggleControls}
          className="text-[11px] text-[#2563eb] hover:text-[#3b82f6] font-medium"
        >
          {hostOnlyControls ? 'Allow All' : 'Host Only'}
        </button>
      )}
    </div>
  );
}
