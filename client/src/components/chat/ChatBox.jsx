import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function ChatBox({ roomCode }) {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const listRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ─── Socket events ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !roomCode) return;

    // Fetch existing message history when component mounts
    socket.emit('fetch_messages', { roomCode, limit: 50 });

    const handleHistory = (history) => {
      setMessages(history);
    };

    const handleNewMessage = (message) => {
      setMessages((prev) => {
        // Deduplicate in case of re-delivery
        if (prev.some((m) => m.id === message.id || m._id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    };

    const handleChatError = ({ message: errMsg }) => {
      console.error('Chat error:', errMsg);
    };

    socket.on('message_history', handleHistory);
    socket.on('receive_message', handleNewMessage);
    socket.on('chat_error', handleChatError);

    return () => {
      socket.off('message_history', handleHistory);
      socket.off('receive_message', handleNewMessage);
      socket.off('chat_error', handleChatError);
    };
  }, [socket, roomCode]);

  // ─── Send message ──────────────────────────────────────────────────────────
  const handleSend = (text) => {
    if (!socket || !user || !roomCode) return;

    socket.emit('send_message', {
      roomCode,
      text,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || null,
    });
  };

  return (
    <div className="flex flex-col h-full rounded-xl bg-[#12151e] border border-[#242838] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#242838] shrink-0">
        <MessageSquare className="w-4 h-4 text-[#2563eb]" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9aa2b5]">
          Room Chat
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col min-h-0 px-4 overflow-hidden">
        <MessageList
          messages={messages}
          currentUserId={user?.id}
          listRef={listRef}
        />
      </div>

      {/* Input */}
      <div className="px-4 pb-3 shrink-0">
        <MessageInput
          onSend={handleSend}
          disabled={!isConnected || !user}
        />
      </div>
    </div>
  );
}
