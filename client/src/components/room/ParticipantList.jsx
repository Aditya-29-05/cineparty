import React from 'react';
import { Users, Crown, CheckCircle2, Circle } from 'lucide-react';

export default function ParticipantList({ participants = [], hostId, currentUserId }) {
  return (
    <div className="rounded-xl bg-[#12151e] border border-[#242838] p-4 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#242838]">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#2563eb]" />
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Participants ({participants.length})
          </h2>
        </div>
      </div>

      {participants.length <= 1 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center text-xs text-[#9aa2b5] space-y-1">
          <p className="font-medium text-white">You're the only participant.</p>
          <p className="text-[#5e667d]">Share the room code with your friends.</p>
        </div>
      ) : null}

      <div className="space-y-2 overflow-y-auto flex-1 pr-1">
        {participants.map((p, idx) => {
          const isHost = (p.user?._id || p.user) === hostId;
          const isCurrentUser = (p.user?._id || p.user) === currentUserId;

          return (
            <div
              key={p.user?._id || p.user || idx}
              className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                isCurrentUser
                  ? 'bg-[#1a1e2b] border-[#363c52]'
                  : 'bg-[#161a25] border-[#242838]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {p.avatar ? (
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#242838] shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#242838] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                    {p.name ? p.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-white truncate">
                      {p.name}
                    </span>
                    {isCurrentUser && (
                      <span className="text-[10px] text-[#9aa2b5]">(You)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status badges */}
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {isHost ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 border border-amber-500/20 text-amber-300">
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>Host</span>
                  </span>
                ) : p.isReady ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Ready</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#1f2434] text-[#9aa2b5]">
                    <Circle className="w-2.5 h-2.5 text-[#5e667d]" />
                    <span>Waiting</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
