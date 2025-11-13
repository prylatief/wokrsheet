import React from 'react';
import { useAuth } from '../lib/AuthContext';

export const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Don't render if user is not logged in
  if (!user) {
    return null;
  }

  // Get initial from email (first letter)
  const getInitial = (email: string): string => {
    return email.charAt(0).toUpperCase();
  };

  // Get shortened email for display
  const getDisplayEmail = (email: string): string => {
    if (email.length <= 20) {
      return email;
    }
    return email.substring(0, 17) + '...';
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      // AuthContext will handle the state update and redirect
    } catch (error) {
      console.error('Logout error:', error);
      alert('Terjadi kesalahan saat logout. Silakan coba lagi.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border-2 border-white/30">
      {/* Avatar with initial */}
      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white shadow-md">
        <span className="text-white font-bold text-lg">
          {getInitial(user.email || '')}
        </span>
      </div>

      {/* User info */}
      <div className="flex flex-col">
        <span className="text-white text-sm font-bold drop-shadow">
          {getDisplayEmail(user.email || '')}
        </span>
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="ml-2 px-3 py-1.5 bg-white/90 hover:bg-white text-purple-600 font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-1"
        title="Keluar"
      >
        {isLoggingOut ? (
          <>
            <span className="animate-spin h-3 w-3 border-2 border-purple-600 border-t-transparent rounded-full" role="status" aria-label="memproses"></span>
            <span className="hidden sm:inline">Keluar...</span>
          </>
        ) : (
          <>
            <span>🚪</span>
            <span className="hidden sm:inline">Keluar</span>
          </>
        )}
      </button>
    </div>
  );
};
