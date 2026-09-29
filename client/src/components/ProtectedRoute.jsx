import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="flex items-center gap-3 text-sm text-[#9aa2b5]">
          <div className="w-4 h-4 rounded-full border-2 border-[#2563eb] border-t-transparent animate-spin" />
          <span>Authenticating...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
