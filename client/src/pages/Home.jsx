import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, HardDrive, ShieldCheck, Zap, ArrowRight, Play, Users } from 'lucide-react';

export default function Home() {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    if (roomCode.trim()) {
      navigate(`/room/${roomCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161a25] border border-[#242838] text-xs text-[#9aa2b5] mb-6">
          <HardDrive className="w-3.5 h-3.5 text-[#2563eb]" />
          <span>Zero Server Uploads • Direct Local Playback</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 max-w-3xl mx-auto leading-tight">
          Watch local movies together, perfectly in sync.
        </h1>

        <p className="text-base sm:text-lg text-[#9aa2b5] max-w-2xl mx-auto mb-10 leading-relaxed">
          Both you and your friends load your own local copy of the video file.
          CineParty synchronizes play, pause, seek, and drift in real time without transmitting video bytes to any server.
        </p>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <button
            onClick={() => navigate('/create')}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Create a Room</span>
          </button>

          <form onSubmit={handleJoin} className="w-full sm:w-auto flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={8}
              className="w-full sm:w-44 px-3.5 py-3 rounded-lg bg-[#12151e] border border-[#242838] focus:border-[#2563eb] focus:outline-none text-white placeholder-[#5e667d] text-sm uppercase tracking-wider text-center"
            />
            <button
              type="submit"
              disabled={!roomCode.trim()}
              className="px-4 py-3 rounded-lg bg-[#1a1e2b] hover:bg-[#22283a] disabled:opacity-50 border border-[#242838] text-white text-sm font-medium transition-colors flex items-center gap-1"
            >
              <span>Join</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Architecture Diagram / How It Works */}
        <div className="border border-[#242838] bg-[#12151e] rounded-xl p-6 sm:p-8 text-left max-w-3xl mx-auto shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#5e667d] mb-6">
            Architecture at a glance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="p-4 rounded-lg bg-[#161a25] border border-[#242838]">
              <div className="w-8 h-8 rounded-md bg-[#1a1e2b] flex items-center justify-center text-[#2563eb] mb-3">
                <HardDrive className="w-4 h-4" />
              </div>
              <h3 className="text-white font-medium text-sm mb-1">1. Pick Local File</h3>
              <p className="text-xs text-[#9aa2b5] leading-relaxed">
                Choose any movie file from your hard drive via the HTML5 File API. No upload required.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#161a25] border border-[#242838]">
              <div className="w-8 h-8 rounded-md bg-[#1a1e2b] flex items-center justify-center text-[#2563eb] mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-white font-medium text-sm mb-1">2. Metadata Verification</h3>
              <p className="text-xs text-[#9aa2b5] leading-relaxed">
                File size, duration, and codec details are matched across participants to ensure sync compatibility.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#161a25] border border-[#242838]">
              <div className="w-8 h-8 rounded-md bg-[#1a1e2b] flex items-center justify-center text-[#2563eb] mb-3">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-white font-medium text-sm mb-1">3. Socket Sync</h3>
              <p className="text-xs text-[#9aa2b5] leading-relaxed">
                Lightweight commands (play, pause, seek, drift correction) keep all video players aligned to within 500ms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#242838] py-6 px-4 text-center text-xs text-[#5e667d]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>CineParty — Private Local Video Watch Parties</span>
          <span>Zero Server Storage • WebSockets • HTML5 Video</span>
        </div>
      </footer>
    </div>
  );
}
