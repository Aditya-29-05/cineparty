import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsSubmitting(true);
      await register(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-md bg-[#2563eb] flex items-center justify-center text-white shadow-sm">
              <Film className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">CineParty</span>
          </Link>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Create your account</h1>
          <p className="text-sm text-[#9aa2b5] mt-1">Start hosting private synchronized watch parties</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-950/40 border border-red-800/60 flex items-start gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <div className="p-6 rounded-xl bg-[#12151e] border border-[#242838]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#9aa2b5] mb-1.5" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                placeholder="Aaditya"
                className="w-full px-3 py-2 rounded-lg bg-[#0b0d13] border border-[#242838] focus:border-[#2563eb] focus:outline-none text-white text-sm placeholder-[#5e667d] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9aa2b5] mb-1.5" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                placeholder="name@example.com"
                className="w-full px-3 py-2 rounded-lg bg-[#0b0d13] border border-[#242838] focus:border-[#2563eb] focus:outline-none text-white text-sm placeholder-[#5e667d] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9aa2b5] mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 rounded-lg bg-[#0b0d13] border border-[#242838] focus:border-[#2563eb] focus:outline-none text-white text-sm placeholder-[#5e667d] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm mt-2 flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#242838]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#12151e] px-2 text-[#5e667d]">or</span>
            </div>
          </div>

          {/* Google Sign In */}
          <GoogleSignInButton
            onSuccess={() => navigate('/', { replace: true })}
            onError={(msg) => setError(msg)}
          />
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-[#9aa2b5] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#2563eb] hover:text-[#3b82f6] font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
