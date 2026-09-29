import React from 'react';
import { CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

export default function SyncIndicator({ status = 'synced', drift = 0 }) {
  if (status === 'syncing') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#161a25] border border-[#242838] text-[11px] text-[#9aa2b5]">
        <RefreshCw className="w-3 h-3 text-[#2563eb] animate-spin" />
        <span>Synchronizing...</span>
      </div>
    );
  }

  if (status === 'drifted' || status === 'unstable') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300">
        <AlertCircle className="w-3 h-3 text-amber-400" />
        <span>Re-aligning ({drift ? `${Math.abs(drift).toFixed(1)}s` : 'drift'})...</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#161a25] border border-[#242838] text-[11px] text-[#9aa2b5]">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      <span>Synced</span>
    </div>
  );
}
