import React, { useState } from 'react';
import { SendHorizonal } from 'lucide-react';

export default function MessageInput({ onSend, disabled = false }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    // Send on Enter, allow Shift+Enter for newline (though we keep it single-line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 pt-2 border-t border-[#242838]"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? 'Connecting...' : 'Message...'}
        disabled={disabled}
        maxLength={500}
        className="flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-[#0b0d13] border border-[#242838] focus:border-[#2563eb] focus:outline-none text-xs text-white placeholder-[#5e667d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="p-1.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors shrink-0"
        title="Send"
      >
        <SendHorizonal className="w-4 h-4" />
      </button>
    </form>
  );
}
