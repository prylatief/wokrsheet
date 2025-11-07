
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
            <p className="text-lg font-bold mb-3 text-purple-700 print:text-base print:mb-2">{exercise.config.title}</p>
            <div className="flex justify-center flex-wrap gap-3 text-5xl print:text-4xl print:gap-2">
              {Array.from({ length: exercise.config.count }).map((_, i) => (
                <span key={i}>{exercise.config.emoji}</span>
              ))}
            </div>
            <div className="mt-5 print:mt-3">
              <p className="text-base font-semibold print:text-sm">Jumlah: <span className="inline-block border-b-2 border-dotted border-slate-600 w-20 ml-2"></span></p>
            </div>
          </div>
        );
      case ExerciseType.ADDITION:
      case ExerciseType.SUBTRACTION:
        const { num1, num2, showHelpers, helperEmoji } = exercise.config;
        const operator = exercise.type === ExerciseType.ADDITION ? '+' : '-';
        return (
          <div>
            <p className="text-lg font-bold text-center mb-3 text-purple-700 print:text-base print:mb-2">{exercise.config.title}</p>
            <div className="flex justify-center items-center text-4xl font-bold font-comic space-x-3 print:text-3xl print:space-x-2">
              <span>{num1}</span>
              <span className="text-purple-600">{operator}</span>
              <span>{num2}</span>
              <span className="text-purple-600">=</span>
              <span className="inline-block border-b-3 border-slate-700 w-20 print:w-16"></span>
            </div>
            {showHelpers && (
              <div className="flex justify-center items-center mt-4 space-x-6 print:mt-3 print:space-x-4">
                <div className="flex flex-wrap gap-1 text-2xl justify-center max-w-[200px] print:text-xl">{Array.from({ length: num1 }).map((_, i) => <span key={i}>{helperEmoji}</span>)}</div>
                <div className="flex flex-wrap gap-1 text-2xl justify-center max-w-[200px] print:text-xl">{Array.from({ length: num2 }).map((_, i) => <span key={i}>{helperEmoji}</span>)}</div>
              </div>
            )}
          </div>
        );
      case ExerciseType.TRACING:
        return (
          <div>
            <p className="text-lg font-bold text-center mb-3 text-purple-700 print:text-base print:mb-2">{exercise.config.title}</p>
            <p className="text-6xl font-bold text-center trace-text font-comic tracking-widest print:text-5xl">{exercise.config.text}</p>
          </div>
        );
      case ExerciseType.DRAWING:
        return (
          <div>
            <p className="text-lg font-bold text-center mb-2 text-purple-700 print:text-base">{exercise.config.title}</p>
            <p className="text-center mb-3 italic text-slate-600 text-sm print:text-xs print:mb-2">{exercise.config.instruction}</p>
            <div className="w-full h-56 border-2 border-dashed border-slate-400 rounded-lg bg-slate-50/50 print:h-48"></div>
          </div>
        );
      case ExerciseType.PATTERN:
        return (
          <div>
            <p className="text-lg font-bold text-center mb-3 text-purple-700 print:text-base print:mb-2">{exercise.config.title}</p>
            <div className="flex justify-center items-center text-5xl font-bold font-comic space-x-3 print:text-4xl print:space-x-2">
              {exercise.config.items.map((item, i) => <span key={i}>{item}</span>)}
              <span className="inline-block border-b-3 border-slate-700 w-20 print:w-16"></span>
            </div>
          </div>
        );
      case ExerciseType.MATCHING:
        return (
          <div>
            <p className="text-lg font-bold text-center mb-3 text-purple-700 print:text-base print:mb-2">{exercise.config.title}</p>
            <div className="flex justify-around items-start text-xl font-comic print:text-base">
              <div className="space-y-3 print:space-y-2">
                {exercise.config.pairs.map(p => <div key={p.id} className="text-right flex items-center justify-end">{p.item1} <span className="inline-block w-5 h-5 border-2 border-slate-600 rounded-full ml-2 print:w-4 print:h-4"></span></div>)}
              </div>
              <div className="space-y-3 print:space-y-2">
                {shuffledMatchingItems.map((item, i) => <div key={i} className="flex items-center"><span className="inline-block w-5 h-5 border-2 border-slate-600 rounded-full mr-2 print:w-4 print:h-4"></span> {item}</div>)}
              </div>
            </div>
          </div>
        );
      case ExerciseType.SPELLING:
        return (
          <div>
            <p className="text-lg font-bold text-center mb-2 text-purple-700 print:text-base">{exercise.config.title}</p>
            <div className="text-6xl text-center mb-4 print:text-5xl print:mb-3">{exercise.config.emojiHint}</div>
            <div className="flex justify-center items-center gap-2 print:gap-1">
              {exercise.config.word.split('').map((_, i) => (
                <div key={i} className="w-14 h-14 border-b-3 border-slate-700 flex items-center justify-center text-4xl font-bold print:w-12 print:h-12 print:text-3xl"></div>
              ))}
            </div>
          </div>
        );
      case ExerciseType.COLORING:
        const coloringSvg = getAssetSvg('coloring', exercise.config.svgKey);
        return (
          <div>
            <p className="text-lg font-bold text-center mb-2 text-purple-700 print:text-base">{exercise.config.title}</p>
            <p className="text-center mb-3 italic text-slate-600 text-sm print:text-xs print:mb-2">{exercise.config.instruction}</p>
            {coloringSvg && <div className="flex justify-center" dangerouslySetInnerHTML={{ __html: coloringSvg }} />}
          </div>
        );
      case ExerciseType.MAZE:
          const mazeSvg = getAssetSvg('maze', exercise.config.svgKey);
          return (
            <div>
              <p className="text-lg font-bold text-center mb-2 text-purple-700 print:text-base">{exercise.config.title}</p>
              <p className="text-center mb-3 italic text-slate-600 text-sm print:text-xs print:mb-2">{exercise.config.instruction}</p>
              {mazeSvg && <div className="flex justify-center" dangerouslySetInnerHTML={{ __html: mazeSvg }} />}
            </div>
          );
      default:
        return null;
    }
  };

  return (
    <div className="exercise-card bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-5 border-2 border-orange-200 shadow-md mb-6 last:mb-0 print:shadow-none print:border-orange-300">
      {renderContent()}
    </div>
  );
};


// Height estimation utility - should match App.tsx
const estimateExerciseHeight = (exercise: Exercise): number => {
  const baseHeight = 8;
  switch (exercise.type) {
    case ExerciseType.COUNTING:
      return baseHeight + 6 + Math.ceil(exercise.config.count / 5) * 3;
    case ExerciseType.ADDITION:
    case ExerciseType.SUBTRACTION:
      const helpersHeight = exercise.config.showHelpers ? 4 : 0;
      return baseHeight + 6 + helpersHeight;
    case ExerciseType.TRACING:
      return baseHeight + 8;
    case ExerciseType.DRAWING:
      return baseHeight + 18;
    case ExerciseType.PATTERN:
      return baseHeight + 8;
    case ExerciseType.MATCHING:
      const pairCount = exercise.config.pairs.length;
      return baseHeight + 6 + (pairCount * 2);
    case ExerciseType.SPELLING:
      return baseHeight + 10;
    case ExerciseType.COLORING:
      return baseHeight + 22;
    case ExerciseType.MAZE:
      return baseHeight + 22;
    default:
      return baseHeight + 10;
  }
};

const calculatePageHeight = (exercises: Exercise[]): number => {
  const headerHeight = 10;
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
        <div id="printable-area" className={`w-full aspect-[210/297] bg-white mx-auto shadow-2xl p-8 font-comic text-slate-800 transition-colors duration-300 rounded-lg overflow-hidden ${borderClass} ${themeClass}`}>
        {/* School Header */}
        {(worksheet.schoolInfo.schoolName || worksheet.schoolInfo.teacherName || worksheet.schoolInfo.logoUrl) && (
          <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-purple-200 print:mb-2">
            <div className="flex items-center gap-2">
              {worksheet.schoolInfo.logoUrl && (
                <img
                  src={worksheet.schoolInfo.logoUrl}
                  alt="Logo Sekolah"
                  className="h-10 w-10 object-contain print:h-8 print:w-8"
                />
              )}
              <div className="text-xs print:text-[10px]">
                {worksheet.schoolInfo.schoolName && (
                  <div className="font-bold text-purple-700 leading-tight">{worksheet.schoolInfo.schoolName}</div>
                )}
                {worksheet.schoolInfo.teacherName && (
                  <div className="text-purple-600 leading-tight">Guru: {worksheet.schoolInfo.teacherName}</div>
                )}
              </div>
            </div>
          </div>
        )}

        <header className="flex justify-between items-center border-b-2 border-purple-300 pb-3 mb-5 print:pb-2 print:mb-4">
          <div className="text-base font-bold print:text-sm">Nama: <span className="inline-block border-b-2 border-dotted border-purple-400 w-40 print:w-32"></span></div>
          <div className="text-base font-bold print:text-sm">Kelas: <span className="inline-block border-b-2 border-dotted border-purple-400 w-20 print:w-16"></span></div>
        </header>

        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 p-3 rounded-xl mb-6 shadow-md print:p-2 print:mb-4 print:rounded-lg">
          <h1 className="text-3xl font-bold text-center text-white drop-shadow-md print:text-2xl print:drop-shadow-sm">{worksheet.title}</h1>
        </div>

        <div className="space-y-5 print:space-y-4">
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
