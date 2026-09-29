import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function RoomCode({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room code', err);
    }
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161a25] border border-[#242838]">
      <span className="text-xs text-[#9aa2b5] font-medium uppercase tracking-wider">Room Code:</span>
      <span className="text-sm font-mono font-bold tracking-widest text-white">{code}</span>
      <button
        onClick={handleCopy}
        className="p-1 rounded hover:bg-[#22283a] text-[#9aa2b5] hover:text-white transition-colors ml-1"
        title="Copy room code"
        type="button"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
