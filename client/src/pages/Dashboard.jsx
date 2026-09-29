import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Plus, Users, ArrowRight, Clock } from 'lucide-react';
import { roomService } from '../services/roomService';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const res = await roomService.getUserRooms();
        if (res.success && res.rooms) {
          setRooms(res.rooms);
        }
      } catch (err) {
        setError('Could not load active rooms');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#242838]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Your Dashboard</h1>
          <p className="text-sm text-[#9aa2b5] mt-1">
            Welcome back, <span className="text-white">{user?.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/join"
            className="px-3.5 py-2 rounded-lg bg-[#161a25] hover:bg-[#1f2434] border border-[#242838] text-white text-xs font-medium transition-colors"
          >
            Join with Code
          </Link>
          <Link
            to="/create"
            className="px-4 py-2 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Room</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-sm text-[#9aa2b5] gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-[#2563eb] border-t-transparent animate-spin" />
          <span>Loading rooms...</span>
        </div>
      ) : rooms.length === 0 ? (
        /* Empty State adhering strictly to Section 27 */
        <div className="text-center py-16 px-4 rounded-xl bg-[#12151e] border border-[#242838]">
          <div className="w-12 h-12 rounded-xl bg-[#161a25] border border-[#242838] flex items-center justify-center text-[#9aa2b5] mx-auto mb-4">
            <Film className="w-6 h-6" />
          </div>
          <h2 className="text-base font-semibold text-white mb-1">No active rooms</h2>
          <p className="text-xs text-[#9aa2b5] max-w-sm mx-auto mb-6">
            Create a room or join one using a room code.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/create"
              className="px-4 py-2 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-medium transition-colors"
            >
              Create Room
            </Link>
            <Link
              to="/join"
              className="px-4 py-2 rounded-lg bg-[#1a1e2b] hover:bg-[#22283a] border border-[#242838] text-white text-xs font-medium transition-colors"
            >
              Join Room
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map((room) => {
            const isHost = room.host?._id === user?.id;
            return (
              <div
                key={room._id}
                className="p-5 rounded-xl bg-[#12151e] border border-[#242838] hover:border-[#363c52] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-base font-semibold text-white truncate">
                      {room.title}
                    </h3>
                    <span className="font-mono text-xs font-bold text-[#2563eb] bg-[#2563eb]/10 border border-[#2563eb]/20 px-2 py-0.5 rounded tracking-wider shrink-0">
                      {room.roomCode}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#9aa2b5] mb-4">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {room.participants?.length || 1} participant{room.participants?.length !== 1 ? 's' : ''}
                    </span>
                    <span>•</span>
                    <span>{isHost ? 'You are Host' : `Host: ${room.host?.name}`}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#242838] flex items-center justify-between">
                  <span className="text-[11px] text-[#5e667d]">Active now</span>
                  <button
                    onClick={() => navigate(`/room/${room.roomCode}`)}
                    className="inline-flex items-center gap-1.5 text-xs text-white bg-[#1a1e2b] hover:bg-[#2563eb] px-3 py-1.5 rounded-lg border border-[#242838] hover:border-[#2563eb] transition-colors font-medium"
                  >
                    <span>Enter Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
