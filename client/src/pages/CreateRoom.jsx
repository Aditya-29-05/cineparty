import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { roomService } from '../services/roomService';
import { useAuth } from '../context/AuthContext';

export default function CreateRoom() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState(`${user?.name || 'My'}'s Watch Party`);
  const [hostOnlyControls, setHostOnlyControls] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a room title');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await roomService.createRoom({
        title: title.trim(),
        hostOnlyControls,
      });

      if (res.success && res.room) {
        navigate(`/room/${res.room.roomCode}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create room. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#2563eb] text-white mb-3 shadow-sm">
            <Film className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Host a Watch Party</h1>
          <p className="text-sm text-[#9aa2b5] mt-1">
            Create a private synchronized room. Your video stays on your machine.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-950/40 border border-red-800/60 flex items-start gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-6 rounded-xl bg-[#12151e] border border-[#242838]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#9aa2b5] mb-1.5" htmlFor="title">
                Room Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={60}
                placeholder="e.g. Movie Night"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0b0d13] border border-[#242838] focus:border-[#2563eb] focus:outline-none text-white text-sm placeholder-[#5e667d] transition-colors"
              />
            </div>

            <div className="p-3.5 rounded-lg bg-[#161a25] border border-[#242838] flex items-start gap-3">
              <input
                type="checkbox"
                id="hostOnly"
                checked={hostOnlyControls}
                onChange={(e) => setHostOnlyControls(e.target.checked)}
                className="mt-0.5 rounded border-[#363c52] bg-[#0b0d13] text-[#2563eb] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="hostOnly" className="cursor-pointer select-none">
                <span className="block text-xs font-medium text-white">Host-only controls</span>
                <span className="block text-[11px] text-[#9aa2b5] mt-0.5">
                  Only you (the host) can play, pause, or seek. Participants synchronize automatically.
                </span>
              </label>
            </div>

            <div className="p-3 rounded-lg bg-[#0b0d13] border border-[#242838] flex items-center gap-2.5 text-xs text-[#9aa2b5]">
              <ShieldCheck className="w-4 h-4 text-[#2563eb] shrink-0" />
              <span>You'll pick your local video file directly inside the room. No file upload required.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                'Create Watch Room'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
