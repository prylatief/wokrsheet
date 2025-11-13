import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // Handle auth errors with Indonesian messages
  const handleAuthError = (error: any): string => {
    const errorMessage = error?.message || '';
    
    if (errorMessage.includes('Invalid login credentials')) {
      return 'Email atau password salah';
    }
    if (errorMessage.includes('Email not confirmed')) {
      return 'Silakan konfirmasi email Anda terlebih dahulu';
    }
    if (errorMessage.includes('Network')) {
      return 'Koneksi gagal. Periksa internet Anda.';
    }
    return 'Terjadi kesalahan. Silakan coba lagi.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!email.trim()) {
      setError('Email harus diisi');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Format email tidak valid');
      return;
    }

    if (!password) {
      setError('Password harus diisi');
      return;
    }

    if (!isValidPassword(password)) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      // Success - AuthContext will handle the state update
    } catch (err: any) {
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-6xl">📝</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Kids Worksheet
            </h1>
          </div>
          <p className="text-xl text-purple-600 font-medium">Generator</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-purple-200">
          <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Masuk ke Akun Anda
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-purple-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-purple-300 rounded-lg shadow-sm placeholder-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 text-base font-medium transition-all duration-200"
                placeholder="nama@email.com"
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-purple-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-purple-300 rounded-lg shadow-sm placeholder-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 text-base font-medium transition-all duration-200"
                placeholder="Minimal 6 karakter"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 flex items-start gap-2">
                <span className="text-xl">⚠️</span>
                <p className="text-red-700 text-sm font-medium flex-1">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-5 py-3 border-2 border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <span className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full" role="status" aria-label="memproses"></span>
                  Memproses...
                </>
              ) : (
                <>
                  <span className="mr-2">🔐</span>
                  Masuk
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Belum punya akun?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-purple-600 font-bold hover:text-pink-600 transition-colors duration-200 underline"
                disabled={loading}
              >
                Daftar di sini
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Buat lembar kerja yang menyenangkan untuk anak-anak! 🚀
          </p>
        </div>
      </div>
    </div>
  );
};
