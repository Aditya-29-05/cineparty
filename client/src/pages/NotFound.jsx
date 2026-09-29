import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="p-8 max-w-md w-full rounded-xl bg-[#12151e] border border-[#242838]">
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <h2 className="text-lg font-medium text-white mb-4">Page not found</h2>
        <p className="text-sm text-[#9aa2b5] mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
