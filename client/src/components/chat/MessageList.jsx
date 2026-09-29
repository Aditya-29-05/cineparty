import React from 'react';
import { formatTime } from '../../utils/formatTime';

/**
 * Formats a message timestamp: today shows HH:MM, older shows date.
 */
function formatMessageTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function MessageList({ messages = [], currentUserId, listRef }) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <p className="text-xs font-medium text-white">No messages yet.</p>
        <p className="text-[11px] text-[#5e667d] mt-0.5">Start the conversation.</p>
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      className="flex-1 overflow-y-auto space-y-3 pr-1 py-2"
    >
      {messages.map((msg, idx) => {
        const isOwn = msg.sender === currentUserId || msg.sender?.toString() === currentUserId;
        const prevMsg = messages[idx - 1];
        // Group consecutive messages from the same sender
        const showSenderName =
          !prevMsg || prevMsg.sender?.toString() !== msg.sender?.toString();

        return (
          <div
            key={msg.id || msg._id || idx}
            className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
          >
            {showSenderName && (
              <span className={`text-[10px] text-[#5e667d] mb-0.5 ${isOwn ? 'pr-1' : 'pl-1'}`}>
                {isOwn ? 'You' : msg.senderName}
              </span>
            )}
            <div
              className={`group relative max-w-[80%] px-3 py-1.5 rounded-xl text-xs leading-relaxed break-words ${
                isOwn
                  ? 'bg-[#2563eb] text-white rounded-tr-sm'
                  : 'bg-[#1a1e2b] text-[#f1f3f7] border border-[#242838] rounded-tl-sm'
              }`}
            >
              {msg.text}
              <span className="absolute bottom-0.5 right-2 text-[9px] opacity-50 hidden group-hover:inline-block">
                {formatMessageTime(msg.createdAt)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
