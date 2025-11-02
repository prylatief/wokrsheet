import React, { useState } from 'react';
import type { Worksheet, Exercise, Theme, BorderTheme, SchoolInfo } from '../types';
import { ExerciseType } from '../types';
import { ExerciseForm } from './ExerciseForm';
import { PlusIcon, PrintIcon, DownloadIcon } from './Icons';

interface ControlPanelProps {
  worksheet: Worksheet;
  onUpdateTitle: (title: string) => void;
  onUpdateTheme: (theme: Theme) => void;
  onUpdateBorderTheme: (borderTheme: BorderTheme) => void;
  onUpdateSchoolInfo: (schoolInfo: Partial<SchoolInfo>) => void;
  onAddExercise: (type: ExerciseType) => void;
  onUpdateExercise: (id: string, newConfig: Partial<Exercise['config']>) => void;
  onRemoveExercise: (id: string) => void;
  onMoveExerciseToPage: (id: string, pageNumber: number) => void;
  totalPages: number;
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

const borderThemes: { id: BorderTheme; name: string; emoji: string }[] = [
  { id: 'none', name: 'Tanpa Bingkai', emoji: '⬜' },
  { id: 'simple', name: 'Sederhana', emoji: '▢' },
  { id: 'stars', name: 'Bintang', emoji: '⭐' },
  { id: 'rainbow', name: 'Pelangi', emoji: '🌈' },
  { id: 'flowers', name: 'Bunga', emoji: '🌸' },
  { id: 'hearts', name: 'Hati', emoji: '💕' },
  { id: 'animals', name: 'Hewan', emoji: '🐾' },
  { id: 'geometric', name: 'Geometri', emoji: '🔷' },
  { id: 'clouds', name: 'Awan', emoji: '☁️' },
  { id: 'music', name: 'Musik', emoji: '🎵' },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  worksheet,
  onUpdateTitle,
  onUpdateTheme,
  onUpdateBorderTheme,
  onUpdateSchoolInfo,
  onAddExercise,
  onUpdateExercise,
  onRemoveExercise,
  onMoveExerciseToPage,
  totalPages,
  onPrint,
  onDownloadPdf,
  isDownloading
}) => {
  const [isAddMenuOpen, setAddMenuOpen] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateSchoolInfo({ logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl shadow-2xl border-4 border-purple-200 space-y-8 sticky top-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">⚙️</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Pengaturan Utama</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="main-title" className="block text-sm font-bold text-purple-700 mb-2 flex items-center gap-1">
              <span>✏️</span> Judul Lembar Kerja
            </label>
            <input
              type="text"
              id="main-title"
              value={worksheet.title}
              onChange={(e) => onUpdateTitle(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-white border-2 border-purple-300 rounded-lg shadow-sm placeholder-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 text-base font-medium transition-all duration-200"
              placeholder="Latihan Berhitung di Rumah"
            />
          </div>
           <div>
            <label className="block text-sm font-bold text-purple-700 mb-2 flex items-center gap-1">
              <span>🎨</span> Tema Latar
            </label>
            <div className="mt-2 grid grid-cols-2 gap-3">
                {themes.map(theme => (
                    <button
                        key={theme.id}
                        onClick={() => onUpdateTheme(theme.id)}
                        className={`p-3 rounded-xl text-sm font-semibold border-3 transition-all duration-200 hover:scale-105 ${worksheet.theme === theme.id ? 'border-4 border-purple-500 ring-4 ring-purple-300 shadow-lg' : 'border-2 border-slate-300 hover:border-purple-300'}`}
                    >
                        <div className={`w-full h-10 rounded-lg ${theme.color} mb-2 border-2 shadow-inner`}></div>
                        {theme.name}
                    </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">🖼️</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">Bingkai & Dekorasi</h2>
        </div>
        <div>
          <label className="block text-sm font-bold text-purple-700 mb-2 flex items-center gap-1">
            <span>✨</span> Pilih Bingkai
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-purple-50 rounded-lg">
            {borderThemes.map(border => (
              <button
                key={border.id}
                onClick={() => onUpdateBorderTheme(border.id)}
                className={`p-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 hover:scale-105 ${worksheet.borderTheme === border.id ? 'border-4 border-pink-500 ring-4 ring-pink-300 shadow-lg bg-white' : 'border-2 border-slate-300 hover:border-pink-300 bg-white'}`}
              >
                <div className="text-2xl mb-1">{border.emoji}</div>
                <div className="text-xs">{border.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">🏫</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Info Sekolah</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="school-name" className="block text-sm font-bold text-purple-700 mb-2 flex items-center gap-1">
              <span>🏫</span> Nama Sekolah
            </label>
            <input
              type="text"
              id="school-name"
              value={worksheet.schoolInfo.schoolName}
              onChange={(e) => onUpdateSchoolInfo({ schoolName: e.target.value })}
              className="mt-1 block w-full px-4 py-3 bg-white border-2 border-purple-300 rounded-lg shadow-sm placeholder-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 text-base font-medium transition-all duration-200"
              placeholder="SD Negeri 1 Jakarta"
            />
          </div>
          <div>
            <label htmlFor="teacher-name" className="block text-sm font-bold text-purple-700 mb-2 flex items-center gap-1">
              <span>👩‍🏫</span> Nama Guru/Pengajar
            </label>
            <input
              type="text"
              id="teacher-name"
              value={worksheet.schoolInfo.teacherName}
              onChange={(e) => onUpdateSchoolInfo({ teacherName: e.target.value })}
              className="mt-1 block w-full px-4 py-3 bg-white border-2 border-purple-300 rounded-lg shadow-sm placeholder-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 text-base font-medium transition-all duration-200"
              placeholder="Ibu Siti Nurhaliza"
            />
          </div>
          <div>
            <label htmlFor="school-logo" className="block text-sm font-bold text-purple-700 mb-2 flex items-center gap-1">
              <span>🖼️</span> Logo Sekolah
            </label>
            {worksheet.schoolInfo.logoUrl && (
              <div className="mb-2 flex items-center justify-center p-2 bg-white rounded-lg border-2 border-purple-200">
                <img
                  src={worksheet.schoolInfo.logoUrl}
                  alt="Logo Sekolah"
                  className="h-20 w-20 object-contain"
                />
              </div>
            )}
            <input
              type="file"
              id="school-logo"
              accept="image/*"
              onChange={handleLogoUpload}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">📚</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Latihan</h2>
        </div>
        <div className="space-y-6">
          {worksheet.exercises.map((exercise, index) => (
            <ExerciseForm
              key={exercise.id}
              exercise={exercise}
              index={index}
              onUpdate={onUpdateExercise}
              onRemove={onRemoveExercise}
              onMoveToPage={onMoveExerciseToPage}
              totalPages={totalPages}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t-4 border-purple-200">
         <div className="relative">
          <button
            onClick={() => setAddMenuOpen(prev => !prev)}
            className="w-full flex items-center justify-center px-5 py-3 border-2 border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <PlusIcon className="w-6 h-6 mr-2" />
            Tambah Latihan Baru
          </button>
          {isAddMenuOpen && (
            <div className="absolute bottom-full mb-2 w-full bg-white border-2 border-purple-200 rounded-xl shadow-2xl z-10 max-h-60 overflow-y-auto">
              {Object.values(ExerciseType).map(type => (
                <button
                  key={type}
                  onClick={() => {
                    onAddExercise(type);
                    setAddMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors border-b border-purple-100 last:border-0"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
            <button
                onClick={onPrint}
                className="w-full flex items-center justify-center px-4 py-3 border-2 border-purple-300 text-sm font-bold rounded-xl text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-4 focus:ring-purple-200 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
                <PrintIcon className="w-5 h-5 mr-2" />
                Cetak
            </button>
            <button
                onClick={onDownloadPdf}
                disabled={isDownloading}
                className="w-full flex items-center justify-center px-4 py-3 border-2 border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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