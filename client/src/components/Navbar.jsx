import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, User, LogIn, LogOut, Plus } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { isConnected } = useSocket();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b border-[#242838] bg-[#12151e]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 text-white font-medium tracking-tight group">
          <div className="w-8 h-8 rounded-md bg-[#2563eb] flex items-center justify-center text-white shadow-sm">
            <Film className="w-4 h-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">CineParty</span>
        </Link>

        {/* Status & Navigation */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Socket Connection Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1a1e2b] border border-[#242838] text-xs text-[#9aa2b5]">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            <span>{isConnected ? 'Server Online' : 'Connecting...'}</span>
          </div>

          <nav className="flex items-center gap-2">
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/dashboard'
                    ? 'bg-[#1a1e2b] text-white border border-[#363c52]'
                    : 'text-[#9aa2b5] hover:text-white hover:bg-[#1a1e2b]'
                }`}
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/join"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/join'
                  ? 'bg-[#1a1e2b] text-white border border-[#363c52]'
                  : 'text-[#9aa2b5] hover:text-white hover:bg-[#1a1e2b]'
              }`}
            >
              Join Room
            </Link>
            <Link
              to="/create"
              className="px-3.5 py-1.5 rounded-md text-sm font-medium bg-[#2563eb] hover:bg-[#1d4ed8] text-white transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Host Party</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-[#242838]">
                <div className="flex items-center gap-2">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-[#242838]" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#1a1e2b] border border-[#242838] text-white text-xs font-semibold flex items-center justify-center">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:inline text-xs font-medium text-white max-w-28 truncate">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-md text-[#9aa2b5] hover:text-red-400 hover:bg-[#1a1e2b] transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-md text-sm font-medium text-[#9aa2b5] hover:text-white hover:bg-[#1a1e2b] transition-colors flex items-center gap-1.5 ml-1"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
