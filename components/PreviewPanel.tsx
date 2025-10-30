
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
            <p className="text-lg mb-4">{exercise.config.title}</p>
            <div className="flex justify-center flex-wrap gap-4 text-5xl">
              {Array.from({ length: exercise.config.count }).map((_, i) => (
                <span key={i}>{exercise.config.emoji}</span>
              ))}
            </div>
            <div className="mt-6">
              <p>Jumlah: <span className="inline-block border-b-2 border-dotted w-20"></span></p>
            </div>
          </div>
        );
      case ExerciseType.ADDITION:
      case ExerciseType.SUBTRACTION:
        const { num1, num2, showHelpers, helperEmoji } = exercise.config;
        const operator = exercise.type === ExerciseType.ADDITION ? '+' : '-';
        return (
          <div>
            <p className="text-lg text-center mb-4">{exercise.config.title}</p>
            <div className="flex justify-center items-center text-4xl font-bold font-comic space-x-4">
              <span>{num1}</span>
              <span>{operator}</span>
              <span>{num2}</span>
              <span>=</span>
              <span className="inline-block border-b-2 border-slate-800 w-24"></span>
            </div>
            {showHelpers && (
              <div className="flex justify-center items-center mt-4 space-x-8">
                <div className="flex flex-wrap gap-1 text-2xl">{Array.from({ length: num1 }).map((_, i) => <span key={i}>{helperEmoji}</span>)}</div>
                <div className="flex flex-wrap gap-1 text-2xl">{Array.from({ length: num2 }).map((_, i) => <span key={i}>{helperEmoji}</span>)}</div>
              </div>
            )}
          </div>
        );
      case ExerciseType.TRACING:
        return (
          <div>
            <p className="text-lg text-center mb-4">{exercise.config.title}</p>
            <p className="text-6xl font-bold text-center trace-text font-comic tracking-widest">{exercise.config.text}</p>
          </div>
        );
      case ExerciseType.DRAWING:
        return (
          <div>
            <p className="text-lg text-center mb-4">{exercise.config.title}</p>
            <p className="text-center mb-2 italic text-slate-600">{exercise.config.instruction}</p>
            <div className="w-full h-64 border-2 border-dashed border-slate-400 rounded-lg mt-2 bg-slate-50/50"></div>
          </div>
        );
      case ExerciseType.PATTERN:
        return (
          <div>
            <p className="text-lg text-center mb-4">{exercise.config.title}</p>
            <div className="flex justify-center items-center text-5xl font-bold font-comic space-x-4">
              {exercise.config.items.map((item, i) => <span key={i}>{item}</span>)}
              <span className="inline-block border-b-2 border-slate-800 w-20"></span>
            </div>
          </div>
        );
      case ExerciseType.MATCHING:
        return (
          <div>
            <p className="text-lg text-center mb-4">{exercise.config.title}</p>
            <div className="flex justify-around items-center text-2xl font-comic">
              <div className="space-y-4">
                {exercise.config.pairs.map(p => <div key={p.id} className="text-right">{p.item1} <span className="inline-block w-4 h-4 border-2 border-slate-500 rounded-full ml-2"></span></div>)}
              </div>
              <div className="space-y-4">
                {shuffledMatchingItems.map((item, i) => <div key={i}><span className="inline-block w-4 h-4 border-2 border-slate-500 rounded-full mr-2"></span> {item}</div>)}
              </div>
            </div>
          </div>
        );
      case ExerciseType.SPELLING:
        return (
          <div>
            <p className="text-lg text-center mb-4">{exercise.config.title}</p>
            <div className="text-6xl text-center mb-4">{exercise.config.emojiHint}</div>
            <div className="flex justify-center items-center gap-2">
              {exercise.config.word.split('').map((_, i) => (
                <div key={i} className="w-16 h-16 border-b-2 border-slate-600 flex items-center justify-center text-4xl font-bold"></div>
              ))}
            </div>
          </div>
        );
      case ExerciseType.COLORING:
        const coloringSvg = getAssetSvg('coloring', exercise.config.svgKey);
        return (
          <div>
            <p className="text-lg text-center mb-4">{exercise.config.title}</p>
            <p className="text-center mb-2 italic text-slate-600">{exercise.config.instruction}</p>
            {coloringSvg && <div dangerouslySetInnerHTML={{ __html: coloringSvg }} />}
          </div>
        );
      case ExerciseType.MAZE:
          const mazeSvg = getAssetSvg('maze', exercise.config.svgKey);
          return (
            <div>
              <p className="text-lg text-center mb-4">{exercise.config.title}</p>
              <p className="text-center mb-2 italic text-slate-600">{exercise.config.instruction}</p>
              {mazeSvg && <div dangerouslySetInnerHTML={{ __html: mazeSvg }} />}
            </div>
          );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-3 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-200">
      {renderContent()}
    </div>
  );
};


interface PreviewPanelProps {
  worksheet: Worksheet;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ worksheet }) => {
  const themeClass = {
    default: '',
    space: 'theme-space',
    ocean: 'theme-ocean',
    garden: 'theme-garden',
  }[worksheet.theme];

  return (
    <div id="printable-area-container" className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 md:p-8 rounded-2xl shadow-inner">
      <div id="printable-area" className={`w-full aspect-[210/297] bg-white mx-auto shadow-2xl p-10 font-comic text-slate-800 transition-colors duration-300 rounded-lg border-4 border-purple-200 ${themeClass}`}>
        <header className="flex justify-between items-center border-b-4 border-gradient-to-r from-purple-300 to-pink-300 pb-4 mb-8">
          <div className="text-lg font-bold">Nama: <span className="inline-block border-b-2 border-dotted border-purple-400 w-48"></span></div>
          <div className="text-lg font-bold">Kelas: <span className="inline-block border-b-2 border-dotted border-purple-400 w-24"></span></div>
        </header>

        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 p-2 rounded-2xl mb-10 shadow-lg">
          <h1 className="text-4xl font-bold text-center text-white drop-shadow-lg">{worksheet.title}</h1>
        </div>

        <div className="space-y-8">
          {worksheet.exercises.map((exercise, index) => (
            <ExerciseRenderer key={exercise.id} exercise={exercise} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
