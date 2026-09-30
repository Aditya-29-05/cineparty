import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function ChatBox({ roomCode }) {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [chatError, setChatError] = useState('');
  const listRef = useRef(null);

  const currentUserId = user?.id || user?._id;

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

    // Fetch existing message history when component mounts or reconnects
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
      setChatError('');
    };

    const handleChatError = ({ message: errMsg }) => {
      console.error('Chat error:', errMsg);
      setChatError(errMsg || 'Could not send message.');
      setTimeout(() => setChatError(''), 4000);
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
    if (!socket || !user || !roomCode || !currentUserId) return;

    socket.emit('send_message', {
      roomCode,
      text,
      userId: currentUserId,
      userName: user.name || 'User',
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

      {/* Error Notice */}
      {chatError && (
        <div className="mx-4 mt-2 p-2 rounded bg-red-950/40 border border-red-800/60 flex items-center gap-2 text-xs text-red-300">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
          <span>{chatError}</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 flex flex-col min-h-0 px-4 overflow-hidden">
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
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
