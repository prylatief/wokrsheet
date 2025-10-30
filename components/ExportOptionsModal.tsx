import React, { useState } from 'react';

interface ExportOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (mode: 'all' | 'current' | 'range', startPage?: number, endPage?: number) => void;
  totalPages: number;
  currentPage: number;
}

export const ExportOptionsModal: React.FC<ExportOptionsModalProps> = ({
  isOpen,
  onClose,
  onExport,
  totalPages,
  currentPage
}) => {
  const [mode, setMode] = useState<'all' | 'current' | 'range'>('all');
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(totalPages);

  if (!isOpen) return null;

  const handleExport = () => {
    if (mode === 'range') {
      onExport(mode, startPage, endPage);
    } else {
      onExport(mode);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-4 border-purple-200">
        <h2 className="text-2xl font-bold text-purple-700 mb-6 flex items-center gap-2">
          <span>📄</span> Opsi Ekspor PDF
        </h2>

        <div className="space-y-4 mb-6">
          <label className="flex items-start space-x-3 p-4 border-2 border-purple-200 rounded-xl hover:bg-purple-50 cursor-pointer transition-all">
            <input
              type="radio"
              name="export-mode"
              checked={mode === 'all'}
              onChange={() => setMode('all')}
              className="mt-1"
            />
            <div>
              <div className="font-bold text-purple-700">Ekspor Semua Halaman</div>
              <div className="text-sm text-gray-600">Unduh seluruh worksheet ({totalPages} halaman)</div>
            </div>
          </label>

          <label className="flex items-start space-x-3 p-4 border-2 border-purple-200 rounded-xl hover:bg-purple-50 cursor-pointer transition-all">
            <input
              type="radio"
              name="export-mode"
              checked={mode === 'current'}
              onChange={() => setMode('current')}
              className="mt-1"
            />
            <div>
              <div className="font-bold text-purple-700">Ekspor Halaman Saat Ini</div>
              <div className="text-sm text-gray-600">Hanya halaman {currentPage}</div>
            </div>
          </label>

          <label className="flex items-start space-x-3 p-4 border-2 border-purple-200 rounded-xl hover:bg-purple-50 cursor-pointer transition-all">
            <input
              type="radio"
              name="export-mode"
              checked={mode === 'range'}
              onChange={() => setMode('range')}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-bold text-purple-700 mb-2">Ekspor Rentang Kustom</div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={startPage}
                  onChange={(e) => setStartPage(Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1)))}
                  disabled={mode !== 'range'}
                  className="w-20 px-3 py-2 border-2 border-purple-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400"
                />
                <span className="text-gray-600">sampai</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={endPage}
                  onChange={(e) => setEndPage(Math.max(1, Math.min(totalPages, parseInt(e.target.value) || totalPages)))}
                  disabled={mode !== 'range'}
                  className="w-20 px-3 py-2 border-2 border-purple-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>
            </div>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-purple-300 text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition-all"
          >
            Batal
          </button>
          <button
            onClick={handleExport}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
          >
            Ekspor PDF
          </button>
        </div>
      </div>
    </div>
  );
};
