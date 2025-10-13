import React, { useState } from 'react';
import type { Worksheet, Exercise, Theme } from '../types';
import { ExerciseType } from '../types';
import { ExerciseForm } from './ExerciseForm';
import { PlusIcon, PrintIcon, DownloadIcon } from './Icons';

interface ControlPanelProps {
  worksheet: Worksheet;
  onUpdateTitle: (title: string) => void;
  onUpdateTheme: (theme: Theme) => void;
  onAddExercise: (type: ExerciseType) => void;
  onUpdateExercise: (id: string, newConfig: Partial<Exercise['config']>) => void;
  onRemoveExercise: (id: string) => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  isDownloading: boolean;
}

const themes: { id: Theme; name: string; color: string }[] = [
    { id: 'default', name: 'Polos', color: 'bg-white' },
    { id: 'space', name: 'Luar Angkasa', color: 'bg-indigo-100' },
    { id: 'ocean', name: 'Bawah Laut', color: 'bg-sky-100' },
    { id: 'garden', name: 'Taman', color: 'bg-green-100' },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  worksheet,
  onUpdateTitle,
  onUpdateTheme,
  onAddExercise,
  onUpdateExercise,
  onRemoveExercise,
  onPrint,
  onDownloadPdf,
  isDownloading
}) => {
  const [isAddMenuOpen, setAddMenuOpen] = useState(false);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-8 sticky top-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Pengaturan Utama</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="main-title" className="block text-sm font-medium text-slate-700">
              Judul Lembar Kerja
            </label>
            <input
              type="text"
              id="main-title"
              value={worksheet.title}
              onChange={(e) => onUpdateTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              placeholder="Latihan Berhitung di Rumah"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-slate-700">
              Tema Latar
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
                {themes.map(theme => (
                    <button 
                        key={theme.id} 
                        onClick={() => onUpdateTheme(theme.id)}
                        className={`p-2 rounded-md text-sm border-2 ${worksheet.theme === theme.id ? 'border-sky-500 ring-2 ring-sky-500' : 'border-slate-300'}`}
                    >
                        <div className={`w-full h-8 rounded ${theme.color} mb-1 border`}></div>
                        {theme.name}
                    </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Latihan</h2>
        <div className="space-y-6">
          {worksheet.exercises.map((exercise, index) => (
            <ExerciseForm
              key={exercise.id}
              exercise={exercise}
              index={index}
              onUpdate={onUpdateExercise}
              onRemove={onRemoveExercise}
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-4 pt-4 border-t">
         <div className="relative">
          <button
            onClick={() => setAddMenuOpen(prev => !prev)}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Tambah Latihan Baru
          </button>
          {isAddMenuOpen && (
            <div className="absolute bottom-full mb-2 w-full bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              {Object.values(ExerciseType).map(type => (
                <button 
                  key={type}
                  onClick={() => {
                    onAddExercise(type);
                    setAddMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <button
                onClick={onPrint}
                className="w-full flex items-center justify-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
            >
                <PrintIcon className="w-5 h-5 mr-2" />
                Cetak
            </button>
            <button
                onClick={onDownloadPdf}
                disabled={isDownloading}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-400 disabled:cursor-not-allowed"
            >
                {isDownloading ? (
                    <span className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full" role="status" aria-label="memproses"></span>
                ) : (
                    <DownloadIcon className="w-5 h-5 mr-2" />
                )}
                {isDownloading ? 'Memproses...' : 'Unduh PDF'}
            </button>
        </div>
      </div>
    </div>
  );
};