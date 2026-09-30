import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight, AlertCircle } from 'lucide-react';
import { roomService } from '../services/roomService';

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');

    const cleanCode = roomCode.trim().toUpperCase();
    if (!cleanCode) {
      setError('Please enter a room code');
      return;
    }

    try {
      setIsSubmitting(true);
      let res;
      try {
        res = await roomService.joinRoom(cleanCode);
      } catch (joinErr) {
        res = await roomService.getRoom(cleanCode);
      }

      if (res && res.success && res.room) {
        navigate(`/room/${cleanCode}`);
      } else {
        setError('Room not found or no longer active');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Room not found. Check the code and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#161a25] border border-[#242838] text-[#2563eb] mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Join a Watch Party</h1>
          <p className="text-sm text-[#9aa2b5] mt-1">
            Enter the 6-character code provided by your host
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-950/40 border border-red-800/60 flex items-start gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-6 rounded-xl bg-[#12151e] border border-[#242838]">
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#9aa2b5] mb-1.5" htmlFor="roomCode">
                Room Code
              </label>
              <input
                id="roomCode"
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                required
                maxLength={8}
                placeholder="e.g. C7K9P2"
                className="w-full px-3.5 py-3 rounded-lg bg-[#0b0d13] border border-[#242838] focus:border-[#2563eb] focus:outline-none text-white text-center font-mono font-bold tracking-widest text-lg placeholder-[#5e667d] transition-colors uppercase"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !roomCode.trim()}
              className="w-full py-2.5 px-4 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>Join Party</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
