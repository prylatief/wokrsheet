import React from 'react';

interface DownloadProgressModalProps {
  isOpen: boolean;
  progress: number;
}

export const DownloadProgressModal: React.FC<DownloadProgressModalProps> = ({
  isOpen,
  progress
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 no-print">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-4 border-purple-200">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce">📥</div>
          <h2 className="text-2xl font-bold text-purple-700 mb-2">
            Sedang Mengunduh File
          </h2>
          <p className="text-gray-600">
            Mohon sabar ya bapak/ibu guru, file sedang di download
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-purple-700">Progress</span>
            <span className="text-2xl font-bold text-purple-700">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden border-2 border-purple-300">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300 ease-out flex items-center justify-end pr-2"
              style={{ width: `${progress}%` }}
            >
              {progress > 10 && (
                <span className="text-white text-xs font-bold">{progress}%</span>
              )}
            </div>
          </div>
        </div>

        {/* Loading animation */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};
