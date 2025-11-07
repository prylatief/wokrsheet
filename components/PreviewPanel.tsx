
import React, { useMemo } from 'react';
import type { Worksheet, Exercise } from '../types';
import { ExerciseType, getAssetSvg } from '../types';

const ExerciseRenderer: React.FC<{ exercise: Exercise; index: number }> = ({ exercise, index }) => {

  // useMemo to shuffle the second column of matching items only when the pairs change
  const shuffledMatchingItems = useMemo(() => {
    if (exercise.type === ExerciseType.MATCHING) {
      return [...exercise.config.pairs.map(p => p.item2)].sort(() => Math.random() - 0.5);
    }
    return [];
  }, [exercise]);

  const renderContent = () => {
    switch (exercise.type) {
      case ExerciseType.COUNTING:
        return (
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xl font-bold py-2 px-6 rounded-full shadow-md">
                Soal {index + 1}
              </div>
              <div className="text-2xl font-bold text-purple-700">{exercise.config.title}</div>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-4">
              <p className="text-base font-semibold text-slate-700 mb-4">📝 Hitung jumlah gambar di bawah ini:</p>
              <div className="flex justify-center flex-wrap gap-5 text-6xl my-6">
                {Array.from({ length: exercise.config.count }).map((_, i) => (
                  <span key={i} className="animate-float" style={{ animationDelay: `${i * 0.1}s` }}>{exercise.config.emoji}</span>
                ))}
              </div>
            </div>
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mt-4">
              <div className="flex items-center justify-center gap-3 text-2xl font-bold">
                <span className="text-slate-700">Jawaban:</span>
                <div className="bg-white border-3 border-purple-400 rounded-lg px-8 py-3 min-w-[100px] text-center shadow-inner">
                  <span className="text-slate-400">___</span>
                </div>
                <span className="text-slate-700">{exercise.config.emoji}</span>
              </div>
            </div>
          </div>
        );
      case ExerciseType.ADDITION:
      case ExerciseType.SUBTRACTION:
        const { num1, num2, showHelpers, helperEmoji } = exercise.config;
        const operator = exercise.type === ExerciseType.ADDITION ? '+' : '-';
        const operatorText = exercise.type === ExerciseType.ADDITION ? 'ditambah' : 'dikurangi';
        return (
          <div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xl font-bold py-2 px-6 rounded-full shadow-md">
                Soal {index + 1}
              </div>
              <div className="text-2xl font-bold text-purple-700">{exercise.config.title}</div>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-4">
              <p className="text-base font-semibold text-slate-700 mb-4">
                📝 Hitung: {num1} {operatorText} {num2} = ?
              </p>
              <div className="flex justify-center items-center text-5xl font-bold font-comic space-x-6 my-6">
                <span className="text-purple-600">{num1}</span>
                <span className="text-orange-500">{operator}</span>
                <span className="text-purple-600">{num2}</span>
                <span className="text-orange-500">=</span>
                <span className="text-pink-500">?</span>
              </div>
              {showHelpers && (
                <div className="mt-6">
                  <p className="text-sm text-slate-600 mb-3 text-center font-semibold">Bantuan visual:</p>
                  <div className="flex justify-center items-start gap-6">
                    <div className="bg-white rounded-lg p-4 border-2 border-purple-300">
                      <div className="flex flex-wrap gap-2 text-3xl max-w-[200px] justify-center">
                        {Array.from({ length: num1 }).map((_, i) => <span key={i}>{helperEmoji}</span>)}
                      </div>
                      <p className="text-center text-sm font-bold text-purple-600 mt-2">{num1}</p>
                    </div>
                    <div className="text-3xl font-bold text-orange-500 self-center">{operator}</div>
                    <div className="bg-white rounded-lg p-4 border-2 border-purple-300">
                      <div className="flex flex-wrap gap-2 text-3xl max-w-[200px] justify-center">
                        {Array.from({ length: num2 }).map((_, i) => <span key={i}>{helperEmoji}</span>)}
                      </div>
                      <p className="text-center text-sm font-bold text-purple-600 mt-2">{num2}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mt-4">
              <div className="flex items-center justify-center gap-3 text-2xl font-bold">
                <span className="text-slate-700">Jawaban:</span>
                <div className="bg-white border-3 border-purple-400 rounded-lg px-8 py-3 min-w-[100px] text-center shadow-inner">
                  <span className="text-slate-400">___</span>
                </div>
              </div>
            </div>
          </div>
        );
      case ExerciseType.TRACING:
        return (
          <div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xl font-bold py-2 px-6 rounded-full shadow-md">
                Soal {index + 1}
              </div>
              <div className="text-2xl font-bold text-purple-700">{exercise.config.title}</div>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <p className="text-base font-semibold text-slate-700 mb-4">📝 Tebalkan huruf di bawah ini:</p>
              <p className="text-6xl font-bold text-center trace-text font-comic tracking-widest my-6">{exercise.config.text}</p>
            </div>
          </div>
        );
      case ExerciseType.DRAWING:
        return (
          <div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xl font-bold py-2 px-6 rounded-full shadow-md">
                Soal {index + 1}
              </div>
              <div className="text-2xl font-bold text-purple-700">{exercise.config.title}</div>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <p className="text-base font-semibold text-slate-700 mb-4 text-center">🎨 {exercise.config.instruction}</p>
              <div className="w-full h-64 border-2 border-dashed border-purple-400 rounded-lg mt-2 bg-white shadow-inner"></div>
            </div>
          </div>
        );
      case ExerciseType.PATTERN:
        return (
          <div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xl font-bold py-2 px-6 rounded-full shadow-md">
                Soal {index + 1}
              </div>
              <div className="text-2xl font-bold text-purple-700">{exercise.config.title}</div>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-4">
              <p className="text-base font-semibold text-slate-700 mb-4 text-center">📝 Apa gambar berikutnya?</p>
              <div className="flex justify-center items-center text-5xl font-bold font-comic space-x-6 my-6">
                {exercise.config.items.map((item, i) => <span key={i}>{item}</span>)}
                <div className="bg-white border-3 border-purple-400 rounded-lg px-6 py-2 min-w-[80px] text-center shadow-inner">
                  <span className="text-slate-400">?</span>
                </div>
              </div>
            </div>
          </div>
        );
      case ExerciseType.MATCHING:
        return (
          <div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xl font-bold py-2 px-6 rounded-full shadow-md">
                Soal {index + 1}
              </div>
              <div className="text-2xl font-bold text-purple-700">{exercise.config.title}</div>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <p className="text-base font-semibold text-slate-700 mb-4 text-center">📝 Hubungkan pasangan yang sesuai:</p>
              <div className="flex justify-around items-center text-xl font-comic">
                <div className="space-y-6">
                  {exercise.config.pairs.map(p => (
                    <div key={p.id} className="flex items-center gap-3 bg-white rounded-lg p-3 border-2 border-purple-300 shadow-sm">
                      <span className="font-semibold">{p.item1}</span>
                      <span className="inline-block w-6 h-6 border-3 border-purple-500 rounded-full"></span>
                    </div>
                  ))}
                </div>
                <div className="space-y-6">
                  {shuffledMatchingItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-3 border-2 border-purple-300 shadow-sm">
                      <span className="inline-block w-6 h-6 border-3 border-purple-500 rounded-full"></span>
                      <span className="font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case ExerciseType.SPELLING:
        return (
          <div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xl font-bold py-2 px-6 rounded-full shadow-md">
                Soal {index + 1}
              </div>
              <div className="text-2xl font-bold text-purple-700">{exercise.config.title}</div>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <p className="text-base font-semibold text-slate-700 mb-4 text-center">📝 Eja nama benda ini:</p>
              <div className="text-7xl text-center mb-6">{exercise.config.emojiHint}</div>
              <div className="flex justify-center items-center gap-3">
                {exercise.config.word.split('').map((_, i) => (
                  <div key={i} className="w-16 h-20 border-b-4 border-purple-500 flex items-center justify-center text-4xl font-bold bg-white shadow-sm"></div>
                ))}
              </div>
            </div>
          </div>
        );
      case ExerciseType.COLORING:
        const coloringSvg = getAssetSvg('coloring', exercise.config.svgKey);
        return (
          <div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xl font-bold py-2 px-6 rounded-full shadow-md">
                Soal {index + 1}
              </div>
              <div className="text-2xl font-bold text-purple-700">{exercise.config.title}</div>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <p className="text-base font-semibold text-slate-700 mb-4 text-center">🎨 {exercise.config.instruction}</p>
              {coloringSvg && <div dangerouslySetInnerHTML={{ __html: coloringSvg }} />}
            </div>
          </div>
        );
      case ExerciseType.MAZE:
          const mazeSvg = getAssetSvg('maze', exercise.config.svgKey);
          return (
            <div>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xl font-bold py-2 px-6 rounded-full shadow-md">
                  Soal {index + 1}
                </div>
                <div className="text-2xl font-bold text-purple-700">{exercise.config.title}</div>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <p className="text-base font-semibold text-slate-700 mb-4 text-center">🧩 {exercise.config.instruction}</p>
                {mazeSvg && <div dangerouslySetInnerHTML={{ __html: mazeSvg }} />}
              </div>
            </div>
          );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 rounded-2xl p-6 border-3 border-purple-300 shadow-lg">
      {renderContent()}
    </div>
  );
};


// Height estimation utility - should match App.tsx
// Increased to account for new enhanced layouts with more padding and visual elements
const estimateExerciseHeight = (exercise: Exercise): number => {
  const baseHeight = 12; // Increased for new card design
  switch (exercise.type) {
    case ExerciseType.COUNTING:
      return baseHeight + 8 + Math.ceil(exercise.config.count / 5) * 3;
    case ExerciseType.ADDITION:
    case ExerciseType.SUBTRACTION:
      const helpersHeight = exercise.config.showHelpers ? 8 : 0;
      return baseHeight + 8 + helpersHeight;
    case ExerciseType.TRACING:
      return baseHeight + 10;
    case ExerciseType.DRAWING:
      return baseHeight + 20;
    case ExerciseType.PATTERN:
      return baseHeight + 10;
    case ExerciseType.MATCHING:
      const pairCount = exercise.config.pairs.length;
      return baseHeight + 8 + (pairCount * 3);
    case ExerciseType.SPELLING:
      return baseHeight + 12;
    case ExerciseType.COLORING:
      return baseHeight + 24;
    case ExerciseType.MAZE:
      return baseHeight + 24;
    default:
      return baseHeight + 10;
  }
};

const calculatePageHeight = (exercises: Exercise[]): number => {
  const headerHeight = 15; // Increased to account for instructions section on page 1
  const exerciseSpacing = 2;
  const exercisesHeight = exercises.reduce((total, ex) => {
    return total + estimateExerciseHeight(ex) + exerciseSpacing;
  }, 0);
  return headerHeight + exercisesHeight;
};

const MAX_PAGE_HEIGHT = 85;

interface PreviewPanelProps {
  worksheet: Worksheet;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ worksheet, currentPage, totalPages, onPageChange }) => {
  const themeClass = {
    default: '',
    space: 'theme-space',
    ocean: 'theme-ocean',
    garden: 'theme-garden',
  }[worksheet.theme];

  const borderClass = {
    none: '',
    simple: 'border-simple',
    stars: 'border-stars',
    rainbow: 'border-rainbow',
    flowers: 'border-flowers',
    hearts: 'border-hearts',
    animals: 'border-animals',
    geometric: 'border-geometric',
    clouds: 'border-clouds',
    music: 'border-music',
  }[worksheet.borderTheme];

  // Filter exercises for current page
  const currentPageExercises = React.useMemo(() => {
    return worksheet.exercises.filter(ex => ex.pageNumber === currentPage);
  }, [worksheet.exercises, currentPage]);

  // Calculate page fullness
  const pageHeight = React.useMemo(() => {
    return calculatePageHeight(currentPageExercises);
  }, [currentPageExercises]);

  const pageFullness = (pageHeight / MAX_PAGE_HEIGHT) * 100;
  const isNearlyFull = pageFullness > 80;
  const isOverfull = pageFullness > 100;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    onPageChange(currentPage + 1);
  };

  return (
    <div className="space-y-4">
      {/* Page Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between no-print">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <span>←</span> Halaman Sebelumnya
        </button>

        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-purple-600">
            Halaman {currentPage} dari {totalPages}
          </span>
        </div>

        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          Halaman Berikutnya <span>→</span>
        </button>
      </div>

      {/* Page Capacity Indicator */}
      {currentPageExercises.length > 0 && (
        <div className={`rounded-xl shadow-md p-4 no-print ${isOverfull ? 'bg-red-50 border-2 border-red-300' : isNearlyFull ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-green-50 border-2 border-green-300'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold flex items-center gap-2">
              {isOverfull ? (
                <>
                  <span className="text-xl">⚠️</span>
                  <span className="text-red-700">Halaman Terlalu Penuh!</span>
                </>
              ) : isNearlyFull ? (
                <>
                  <span className="text-xl">⚡</span>
                  <span className="text-yellow-700">Halaman Hampir Penuh</span>
                </>
              ) : (
                <>
                  <span className="text-xl">✅</span>
                  <span className="text-green-700">Kapasitas Halaman Baik</span>
                </>
              )}
            </span>
            <span className="text-sm font-bold">{Math.round(pageFullness)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${isOverfull ? 'bg-red-500' : isNearlyFull ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(pageFullness, 100)}%` }}
            ></div>
          </div>
          {isOverfull && (
            <p className="text-xs text-red-600 mt-2 font-medium">
              💡 Konten melebihi ukuran A4. Pindahkan beberapa latihan ke halaman berikutnya untuk hasil cetak terbaik.
            </p>
          )}
          {isNearlyFull && !isOverfull && (
            <p className="text-xs text-yellow-600 mt-2 font-medium">
              💡 Halaman hampir penuh. Latihan berikutnya akan otomatis pindah ke halaman baru.
            </p>
          )}
        </div>
      )}

      {/* Preview Area */}
      <div id="printable-area-container" className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 md:p-8 rounded-2xl shadow-inner">
        <div id="printable-area" className={`w-full aspect-[210/297] bg-white mx-auto shadow-2xl p-10 font-comic text-slate-800 transition-colors duration-300 rounded-lg overflow-hidden ${borderClass} ${themeClass}`}>
        {/* School Header */}
        {(worksheet.schoolInfo.schoolName || worksheet.schoolInfo.teacherName || worksheet.schoolInfo.logoUrl) && (
          <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-purple-200">
            <div className="flex items-center gap-3">
              {worksheet.schoolInfo.logoUrl && (
                <img
                  src={worksheet.schoolInfo.logoUrl}
                  alt="Logo Sekolah"
                  className="h-12 w-12 object-contain"
                />
              )}
              <div className="text-sm">
                {worksheet.schoolInfo.schoolName && (
                  <div className="font-bold text-purple-700">{worksheet.schoolInfo.schoolName}</div>
                )}
                {worksheet.schoolInfo.teacherName && (
                  <div className="text-purple-600">Guru: {worksheet.schoolInfo.teacherName}</div>
                )}
              </div>
            </div>
          </div>
        )}

        <header className="flex justify-between items-center border-b-4 border-gradient-to-r from-purple-300 to-pink-300 pb-4 mb-8">
          <div className="text-lg font-bold">Nama: <span className="inline-block border-b-2 border-dotted border-purple-400 w-48"></span></div>
          <div className="text-lg font-bold">Kelas: <span className="inline-block border-b-2 border-dotted border-purple-400 w-24"></span></div>
        </header>

        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 p-3 rounded-2xl mb-6 shadow-lg">
          <h1 className="text-4xl font-bold text-center text-white drop-shadow-lg">{worksheet.title}</h1>
        </div>

        {currentPage === 1 && currentPageExercises.length > 0 && (
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-3 border-purple-300 rounded-xl p-4 mb-6 shadow-md">
            <div className="flex items-start gap-3">
              <div className="text-3xl">📚</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-purple-800 mb-2">Petunjuk Pengerjaan:</h2>
                <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
                  <li>Kerjakan semua soal dengan teliti</li>
                  <li>Tulis jawaban pada tempat yang tersedia</li>
                  <li>Gunakan pensil agar bisa dihapus jika salah</li>
                  <li>Jika ada gambar bantuan, gunakan untuk menghitung</li>
                  <li>Tanyakan pada guru jika ada yang tidak dimengerti</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {currentPageExercises.length > 0 ? (
            currentPageExercises.map((exercise, index) => (
              <ExerciseRenderer key={exercise.id} exercise={exercise} index={index} />
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-400 font-semibold">
                Halaman ini masih kosong
              </p>
              <p className="text-lg text-gray-400 mt-2">
                Tambahkan latihan dari panel kontrol di sebelah kiri
              </p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};
