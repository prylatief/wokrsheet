
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
              <p className="text-base font-semibold print:text-sm">Jumlah: <span className="inline-block answer-line border-slate-600 w-20 ml-2"></span></p>
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
            <div className="w-full h-56 border-[3px] border-dashed border-slate-400 rounded-lg bg-slate-50/50 print:h-48"></div>
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
                {exercise.config.pairs.map(p => <div key={p.id} className="text-right flex items-center justify-end">{p.item1} <span className="inline-block w-5 h-5 border-[3px] border-slate-600 rounded-full ml-2 print:w-4 print:h-4"></span></div>)}
              </div>
              <div className="space-y-3 print:space-y-2">
                {shuffledMatchingItems.map((item, i) => <div key={i} className="flex items-center"><span className="inline-block w-5 h-5 border-[3px] border-slate-600 rounded-full mr-2 print:w-4 print:h-4"></span> {item}</div>)}
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
              <div className="relative">
                {/* Label Mulai - di luar labirin */}
                <div className="flex items-center justify-start mb-2 ml-8">
                  <div className="inline-flex items-center gap-2 bg-green-100 border-2 border-green-400 rounded-full px-4 py-1 print:px-3 print:py-0.5">
                    <div className="w-3 h-3 bg-green-500 rounded-full print:w-2 print:h-2"></div>
                    <span className="text-base font-bold text-green-700 print:text-sm">Mulai</span>
                  </div>
                </div>

                {/* Labirin SVG */}
                {mazeSvg && <div className="maze-container flex justify-center" dangerouslySetInnerHTML={{ __html: mazeSvg }} />}

                {/* Label Selesai - di luar labirin */}
                <div className="flex items-center justify-end mt-2 mr-8">
                  <div className="inline-flex items-center gap-2 bg-red-100 border-2 border-red-400 rounded-full px-4 py-1 print:px-3 print:py-0.5">
                    <span className="text-base font-bold text-red-700 print:text-sm">Selesai</span>
                    <div className="w-3 h-3 bg-red-500 rounded-full print:w-2 print:h-2"></div>
                  </div>
                </div>
              </div>
            </div>
          );
      case ExerciseType.JUZ_AMMA:
        const { exerciseType: juzType, verses, surah, blankWord } = exercise.config;

        if (juzType === 'fill_blank') {
          return (
            <div>
              <p className="text-lg font-bold text-center mb-2 text-purple-700 print:text-base">{exercise.config.title}</p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200 print:p-3">
                <div className="text-center mb-3">
                  <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full print:text-xs">
                    Surat {surah}
                  </span>
                </div>
                {verses.map((verse, idx) => {
                  const words = verse.arabic.split(' ');
                  const wordToBlank = blankWord || words[Math.floor(words.length / 2)];
                  const modifiedArabic = verse.arabic.replace(wordToBlank, '________');

                  return (
                    <div key={idx} className="mb-4 last:mb-0">
                      <div className="text-right font-arabic text-2xl leading-relaxed mb-2 print:text-xl" dir="rtl">
                        {modifiedArabic}
                      </div>
                      <div className="text-xs text-gray-600 italic print:text-[10px]">
                        ({verse.verseNumber}) {verse.translation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        if (juzType === 'matching') {
          // Matching ayat dengan terjemahan
          const shuffledTranslations = [...verses.map(v => v.translation)].sort(() => Math.random() - 0.5);
          return (
            <div>
              <p className="text-lg font-bold text-center mb-2 text-purple-700 print:text-base">{exercise.config.title}</p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200 print:p-3">
                <div className="text-center mb-3">
                  <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full print:text-xs">
                    Surat {surah} - Jodohkan Ayat dan Terjemahan
                  </span>
                </div>
                <div className="flex justify-around items-start gap-4 text-sm print:text-xs">
                  <div className="space-y-3 flex-1 print:space-y-2">
                    {verses.map((verse, idx) => (
                      <div key={idx} className="flex items-center justify-end gap-2">
                        <div className="text-right font-arabic text-lg leading-relaxed print:text-base" dir="rtl">
                          {verse.arabic}
                        </div>
                        <span className="inline-block w-6 h-6 border-[3px] border-green-600 rounded-full shrink-0 print:w-5 print:h-5"></span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 flex-1 print:space-y-2">
                    {shuffledTranslations.map((translation, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="inline-block w-6 h-6 border-[3px] border-green-600 rounded-full shrink-0 print:w-5 print:h-5"></span>
                        <div className="italic text-gray-700">{translation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (juzType === 'tracing') {
          return (
            <div>
              <p className="text-lg font-bold text-center mb-2 text-purple-700 print:text-base">{exercise.config.title}</p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200 print:p-3">
                <div className="text-center mb-3">
                  <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full print:text-xs">
                    Surat {surah} - Tebalkan Ayat
                  </span>
                </div>
                {verses.map((verse, idx) => (
                  <div key={idx} className="mb-5 last:mb-0">
                    <p className="text-right font-arabic text-3xl leading-relaxed trace-text tracking-wider print:text-2xl" dir="rtl">
                      {verse.arabic}
                    </p>
                    <div className="text-xs text-gray-600 italic mt-2 print:text-[10px]">
                      ({verse.verseNumber}) {verse.translation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (juzType === 'complete_verse') {
          return (
            <div>
              <p className="text-lg font-bold text-center mb-2 text-purple-700 print:text-base">{exercise.config.title}</p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200 print:p-3">
                <div className="text-center mb-3">
                  <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full print:text-xs">
                    Surat {surah} - Tulis Ayat Lengkap
                  </span>
                </div>
                {verses.map((verse, idx) => (
                  <div key={idx} className="mb-5 last:mb-0">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-sm font-bold text-green-700 print:text-xs">Ayat {verse.verseNumber}:</span>
                      <span className="text-xs text-gray-600 italic flex-1 print:text-[10px]">{verse.translation}</span>
                    </div>
                    <div className="w-full min-h-[60px] border-[3px] border-dashed border-green-400 rounded-lg bg-white p-2 print:min-h-[50px]">
                      {/* Ruang untuk menulis */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return null;

      case ExerciseType.COLOR_CODING:
        const { exerciseType: colorType, colors, instruction: colorInstruction } = exercise.config;

        if (colorType === 'sequence') {
          return (
            <div>
              <p className="text-lg font-bold text-center mb-3 text-purple-700 print:text-base">{exercise.config.title}</p>
              <p className="text-sm text-center mb-4 text-gray-700 print:text-xs">{colorInstruction}</p>
              <div className="flex justify-center gap-4 flex-wrap">
                {colors?.map((color, idx) => (
                  <div key={idx} className="text-center">
                    <div
                      className="w-16 h-16 rounded-lg border-4 border-gray-800 shadow-lg print:w-12 print:h-12"
                      style={{ backgroundColor: color }}
                    />
                    <div className="mt-2 w-12 h-8 border-[3px] border-dashed border-gray-400 rounded mx-auto flex items-center justify-center text-gray-500 font-bold print:text-xs">
                      ?
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (colorType === 'matching') {
          const shuffledColors = [...(colors || [])].sort(() => Math.random() - 0.5);
          return (
            <div>
              <p className="text-lg font-bold text-center mb-3 text-purple-700 print:text-base">{exercise.config.title}</p>
              <p className="text-sm text-center mb-4 text-gray-700 print:text-xs">{colorInstruction}</p>
              <div className="flex justify-around gap-8">
                <div className="space-y-3">
                  {colors?.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div
                        className="w-12 h-12 rounded-lg border-4 border-gray-800 print:w-10 print:h-10"
                        style={{ backgroundColor: color }}
                      />
                      <span className="inline-block w-6 h-6 border-[3px] border-purple-600 rounded-full print:w-5 print:h-5"></span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {shuffledColors.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="inline-block w-6 h-6 border-[3px] border-purple-600 rounded-full print:w-5 print:h-5"></span>
                      <div
                        className="w-12 h-12 rounded-lg border-4 border-gray-800 print:w-10 print:h-10"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (colorType === 'pattern') {
          return (
            <div>
              <p className="text-lg font-bold text-center mb-3 text-purple-700 print:text-base">{exercise.config.title}</p>
              <p className="text-sm text-center mb-4 text-gray-700 print:text-xs">{colorInstruction}</p>
              <div className="flex justify-center items-center gap-3">
                {colors?.slice(0, -1).map((color, idx) => (
                  <div
                    key={idx}
                    className="w-14 h-14 rounded-lg border-4 border-gray-800 shadow-lg print:w-12 print:h-12"
                    style={{ backgroundColor: color }}
                  />
                ))}
                <div className="w-14 h-14 rounded-lg border-4 border-dashed border-gray-500 flex items-center justify-center text-3xl print:w-12 print:h-12">
                  ?
                </div>
              </div>
            </div>
          );
        }

        return null;

      case ExerciseType.SEQUENCE_CODING:
        const { steps, instruction: seqInstruction } = exercise.config;
        const shuffledSteps = [...(steps || [])].sort(() => Math.random() - 0.5);

        return (
          <div>
            <p className="text-lg font-bold text-center mb-3 text-purple-700 print:text-base">{exercise.config.title}</p>
            <p className="text-sm text-center mb-4 text-gray-700 print:text-xs">{seqInstruction}</p>
            <div className="space-y-3">
              {shuffledSteps.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-4 bg-blue-50 p-3 rounded-lg border-2 border-blue-300 print:p-2">
                  <div className="w-10 h-10 border-[3px] border-dashed border-blue-500 rounded flex items-center justify-center font-bold text-lg print:w-8 print:h-8 print:text-sm">
                    {idx + 1}
                  </div>
                  <span className="text-3xl print:text-2xl">{step.icon}</span>
                  <span className="flex-1 font-medium text-gray-800 print:text-sm">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case ExerciseType.IF_THEN_LOGIC:
        const { rules, instruction: ifThenInstruction, items } = exercise.config;

        return (
          <div>
            <p className="text-lg font-bold text-center mb-3 text-purple-700 print:text-base">{exercise.config.title}</p>
            <p className="text-sm text-center mb-4 text-gray-700 print:text-xs">{ifThenInstruction}</p>

            {/* Rules Box */}
            <div className="bg-purple-50 border-4 border-purple-300 rounded-lg p-4 mb-4">
              <p className="text-sm font-bold text-center mb-3 text-purple-700 print:text-xs">📋 Aturan:</p>
              <div className="space-y-2">
                {rules?.map((rule, idx) => (
                  <div key={rule.id} className="bg-white p-3 rounded-lg border-2 border-purple-200">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-purple-600">Aturan {idx + 1}:</span>
                    </div>
                    <div className="mt-1 space-y-1 text-sm">
                      <p className="text-blue-700">
                        <span className="font-semibold">JIKA:</span> {rule.condition}
                      </p>
                      <p className="text-green-700">
                        <span className="font-semibold">MAKA:</span> {rule.action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items to apply rules */}
            <div className="mt-4">
              <p className="text-sm font-bold text-center mb-2 text-purple-700 print:text-xs">Terapkan aturan pada kotak di bawah:</p>
              <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
                {Array.from({ length: items || 10 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="relative w-16 h-16 border-4 border-gray-400 bg-white rounded-lg flex items-center justify-center print:w-12 print:h-12"
                  >
                    <span className="text-2xl font-bold text-gray-600 print:text-xl">{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case ExerciseType.PIXEL_ART:
        const { gridRows, gridCols, colorPalette, instruction: pixelInstruction } = exercise.config;

        return (
          <div>
            <p className="text-lg font-bold text-center mb-3 text-purple-700 print:text-base">{exercise.config.title}</p>
            <p className="text-sm text-center mb-4 text-gray-700 print:text-xs">{pixelInstruction}</p>

            <div className="flex justify-center items-start gap-6">
              {/* Grid */}
              <div>
                <div
                  className="grid gap-0 border-2 border-gray-800 w-fit"
                  style={{
                    gridTemplateColumns: `repeat(${gridCols || 8}, 1fr)`,
                  }}
                >
                  {Array.from({ length: (gridRows || 8) * (gridCols || 8) }).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 border border-gray-300 bg-white print:w-5 print:h-5"
                    />
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div>
                <p className="text-sm font-bold text-center mb-2 text-purple-700 print:text-xs">Palet Warna:</p>
                <div className="space-y-2">
                  {colorPalette?.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-12 h-12 rounded-lg border-4 border-gray-800 shadow-md print:w-10 print:h-10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
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
    case ExerciseType.JUZ_AMMA:
      const verseCount = exercise.config.verses?.length || 1;
      const { exerciseType: juzExType } = exercise.config;
      if (juzExType === 'matching') {
        return baseHeight + 8 + (verseCount * 5);
      }
      if (juzExType === 'tracing') {
        return baseHeight + 10 + (verseCount * 6);
      }
      if (juzExType === 'complete_verse') {
        return baseHeight + 8 + (verseCount * 8);
      }
      // fill_blank
      return baseHeight + 8 + (verseCount * 4);
    case ExerciseType.COLOR_CODING:
      const colorCount = exercise.config.colors?.length || 3;
      return baseHeight + 10 + Math.ceil(colorCount / 3) * 3;
    case ExerciseType.SEQUENCE_CODING:
      const stepCount = exercise.config.steps?.length || 3;
      return baseHeight + 8 + (stepCount * 4);
    case ExerciseType.IF_THEN_LOGIC:
      const ruleCount = exercise.config.rules?.length || 2;
      const itemCount = exercise.config.items || 10;
      return baseHeight + 12 + (ruleCount * 4) + Math.ceil(itemCount / 5) * 4;
    case ExerciseType.PIXEL_ART:
      const rows = exercise.config.gridRows || 8;
      const cols = exercise.config.gridCols || 8;
      return baseHeight + 12 + Math.ceil((rows * cols) / 20);
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
  const themeClass = React.useMemo(() => {
    return {
      default: '',
      space: 'theme-space',
      ocean: 'theme-ocean',
      garden: 'theme-garden',
    }[worksheet.theme] || '';
  }, [worksheet.theme]);

  const borderClass = React.useMemo(() => {
    return {
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
    }[worksheet.borderTheme] || '';
  }, [worksheet.borderTheme]);

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
        <div id="printable-area" className={`w-full max-w-[210mm] min-h-[297mm] ${worksheet.theme === 'default' ? 'bg-white' : ''} mx-auto shadow-2xl p-8 font-comic text-slate-800 transition-colors duration-300 rounded-lg ${borderClass} ${themeClass}`}>
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
          <div className="text-base font-bold print:text-sm">Nama: <span className="inline-block answer-line border-purple-400 w-40 print:w-32"></span></div>
          <div className="text-base font-bold print:text-sm">Kelas: <span className="inline-block answer-line border-purple-400 w-20 print:w-16"></span></div>
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
