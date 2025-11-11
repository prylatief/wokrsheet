
import React, { useState } from 'react';
import type { Exercise, MatchingPair, JuzAmmaVerse, SequenceStep, IfThenRule, ColorCodingExerciseType } from '../types';
import { ExerciseType, coloringPages, mazes, juzAmmaData } from '../types';
import { TrashIcon, PlusIcon } from './Icons';

interface ExerciseFormProps {
  exercise: Exercise;
  index: number;
  onUpdate: (id: string, newConfig: Partial<Exercise['config']>) => void;
  onRemove: (id: string) => void;
  onMoveToPage: (id: string, pageNumber: number) => void;
  totalPages: number;
}

const KID_FRIENDLY_EMOJIS = ['🍎', '⭐', '🚀', '😊', '🎈', '🚗', '🐶', '🐱', '🐞', '🦋', '🌈', '☀️', '⚽', '🍕', '🍦', '🍓'];

const EmojiPicker: React.FC<{ value: string; onChange: (emoji: string) => void }> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="block w-full text-left px-3 py-2 border-2 border-orange-300 rounded-lg shadow-sm text-2xl bg-white hover:border-orange-500 transition-all duration-200"
      >
        {value}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border-2 border-orange-300 rounded-xl shadow-2xl p-3 grid grid-cols-4 gap-2">
          {KID_FRIENDLY_EMOJIS.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                onChange(emoji);
                setIsOpen(false);
              }}
              className="p-2 text-2xl rounded-lg hover:bg-orange-100 transition-colors duration-150 transform hover:scale-110"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


const InputField: React.FC<{ label: string; id: string; children: React.ReactNode }> = ({ label, id, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-bold text-orange-700 mb-1">
      {label}
    </label>
    <div className="mt-1">{children}</div>
  </div>
);

const TextInput: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string, id: string }> = ({ value, onChange, placeholder, id }) => (
  <input
    type="text"
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="block w-full px-3 py-2 border-2 border-orange-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 text-sm transition-all duration-200"
  />
);

const NumberInput: React.FC<{ value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; id: string }> = ({ value, onChange, id }) => (
  <input
    type="number"
    id={id}
    value={value}
    onChange={onChange}
    min="0"
    className="block w-full px-3 py-2 border-2 border-orange-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 text-sm transition-all duration-200"
  />
);

const SelectInput: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; id: string; options: {key: string; name: string}[] }> = ({ value, onChange, id, options }) => (
    <select id={id} value={value} onChange={onChange} className="block w-full px-3 py-2 border-2 border-orange-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 text-sm transition-all duration-200 bg-white">
        {options.map(opt => <option key={opt.key} value={opt.key}>{opt.name}</option>)}
    </select>
);

export const ExerciseForm: React.FC<ExerciseFormProps> = ({ exercise, index, onUpdate, onRemove, onMoveToPage, totalPages }) => {
  const handleConfigChange = (key: string, value: any) => {
    onUpdate(exercise.id, { [key]: value });
  };
  
  const renderFields = () => {
    switch (exercise.type) {
      case ExerciseType.COUNTING:
        return (
          <>
            <InputField label="Emoji" id={`emoji-${exercise.id}`}>
              <EmojiPicker value={exercise.config.emoji} onChange={emoji => handleConfigChange('emoji', emoji)} />
            </InputField>
            <InputField label="Jumlah" id={`count-${exercise.id}`}>
              <NumberInput id={`count-${exercise.id}`} value={exercise.config.count} onChange={e => handleConfigChange('count', parseInt(e.target.value, 10) || 0)} />
            </InputField>
          </>
        );
      case ExerciseType.ADDITION:
      case ExerciseType.SUBTRACTION:
        return (
          <>
            <InputField label="Angka Pertama" id={`num1-${exercise.id}`}>
              <NumberInput id={`num1-${exercise.id}`} value={exercise.config.num1} onChange={e => handleConfigChange('num1', parseInt(e.target.value, 10) || 0)} />
            </InputField>
            <InputField label="Angka Kedua" id={`num2-${exercise.id}`}>
              <NumberInput id={`num2-${exercise.id}`} value={exercise.config.num2} onChange={e => handleConfigChange('num2', parseInt(e.target.value, 10) || 0)} />
            </InputField>
            <div className="flex items-center bg-orange-100 p-3 rounded-lg">
              <input
                id={`helpers-${exercise.id}`}
                type="checkbox"
                checked={exercise.config.showHelpers}
                onChange={e => handleConfigChange('showHelpers', e.target.checked)}
                className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-2 border-orange-300 rounded"
              />
              <label htmlFor={`helpers-${exercise.id}`} className="ml-3 block text-sm font-semibold text-orange-900">
                Tampilkan Gambar Bantuan
              </label>
            </div>
             {exercise.config.showHelpers && (
              <InputField label="Emoji Bantuan" id={`helper-emoji-${exercise.id}`}>
                <EmojiPicker value={exercise.config.helperEmoji} onChange={emoji => handleConfigChange('helperEmoji', emoji)} />
              </InputField>
            )}
          </>
        );
      case ExerciseType.TRACING:
        return (
          <InputField label="Teks yang akan ditebalkan" id={`trace-text-${exercise.id}`}>
            <TextInput id={`trace-text-${exercise.id}`} value={exercise.config.text} onChange={e => handleConfigChange('text', e.target.value)} placeholder="ABC..." />
          </InputField>
        );
      case ExerciseType.DRAWING:
        return (
          <InputField label="Teks Instruksi" id={`draw-instruction-${exercise.id}`}>
            <TextInput id={`draw-instruction-${exercise.id}`} value={exercise.config.instruction} onChange={e => handleConfigChange('instruction', e.target.value)} placeholder="Gambarlah sebuah mobil" />
          </InputField>
        );
      case ExerciseType.PATTERN:
        const handleItemChange = (index: number, value: string) => {
            const newItems = [...exercise.config.items];
            newItems[index] = value;
            handleConfigChange('items', newItems);
        };
        return (
            <div className='space-y-2'>
            <p className="block text-sm font-medium text-slate-600">Isi Pola (3 ditampil, 1 kosong)</p>
            <div className="grid grid-cols-3 gap-2">
                {exercise.config.items.map((item, i) => (
                    <TextInput key={i} id={`pattern-item-${i}-${exercise.id}`} value={item} onChange={e => handleItemChange(i, e.target.value)} />
                ))}
            </div>
            </div>
        );
       case ExerciseType.MATCHING:
        const handlePairChange = (id: string, key: 'item1' | 'item2', value: string) => {
          const newPairs = exercise.config.pairs.map(p => p.id === id ? { ...p, [key]: value } : p);
          handleConfigChange('pairs', newPairs);
        };
        const addPair = () => {
          const newPairs = [...exercise.config.pairs, { id: crypto.randomUUID(), item1: '', item2: '' }];
          handleConfigChange('pairs', newPairs);
        };
        const removePair = (id: string) => {
          const newPairs = exercise.config.pairs.filter(p => p.id !== id);
          handleConfigChange('pairs', newPairs);
        };
        return (
          <div className="space-y-2">
            <p className="block text-sm font-medium text-slate-600">Pasangan</p>
            {exercise.config.pairs.map((pair) => (
              <div key={pair.id} className="flex items-center gap-2">
                <TextInput id={`pair-item1-${pair.id}`} value={pair.item1} onChange={e => handlePairChange(pair.id, 'item1', e.target.value)} />
                <span>-</span>
                <TextInput id={`pair-item2-${pair.id}`} value={pair.item2} onChange={e => handlePairChange(pair.id, 'item2', e.target.value)} />
                <button onClick={() => removePair(pair.id)} className="text-red-500 hover:text-red-700 shrink-0"><TrashIcon className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={addPair} className="flex items-center text-sm font-bold text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition-all duration-200"><PlusIcon className="w-4 h-4 mr-1" /> Tambah Pasangan</button>
          </div>
        );
      case ExerciseType.SPELLING:
        return (
            <>
                <InputField label="Kata yang dieja" id={`spell-word-${exercise.id}`}>
                    <TextInput id={`spell-word-${exercise.id}`} value={exercise.config.word} onChange={e => handleConfigChange('word', e.target.value)} placeholder="KUCING" />
                </InputField>
                <InputField label="Emoji Petunjuk" id={`spell-emoji-${exercise.id}`}>
                    <EmojiPicker value={exercise.config.emojiHint} onChange={emoji => handleConfigChange('emojiHint', emoji)} />
                </InputField>
            </>
        );
      case ExerciseType.COLORING:
        return (
            <>
                <InputField label="Instruksi" id={`color-inst-${exercise.id}`}>
                    <TextInput id={`color-inst-${exercise.id}`} value={exercise.config.instruction} onChange={e => handleConfigChange('instruction', e.target.value)} />
                </InputField>
                <InputField label="Pilih Gambar" id={`color-svg-${exercise.id}`}>
                    <SelectInput id={`color-svg-${exercise.id}`} value={exercise.config.svgKey} onChange={e => handleConfigChange('svgKey', e.target.value)} options={coloringPages} />
                </InputField>
            </>
        );
      case ExerciseType.MAZE:
          return (
            <>
                <InputField label="Instruksi" id={`maze-inst-${exercise.id}`}>
                    <TextInput id={`maze-inst-${exercise.id}`} value={exercise.config.instruction} onChange={e => handleConfigChange('instruction', e.target.value)} />
                </InputField>
                <InputField label="Pilih Labirin" id={`maze-svg-${exercise.id}`}>
                    <SelectInput id={`maze-svg-${exercise.id}`} value={exercise.config.svgKey} onChange={e => handleConfigChange('svgKey', e.target.value)} options={mazes} />
                </InputField>
            </>
        );
      case ExerciseType.JUZ_AMMA:
        const surahOptions = juzAmmaData.map(s => ({ key: s.name, name: `${s.name} (${s.arabicName})` }));
        const exerciseTypeOptions = [
          { key: 'fill_blank', name: 'Isi Kata yang Hilang' },
          { key: 'matching', name: 'Menjodohkan Ayat dan Terjemahan' },
          { key: 'tracing', name: 'Menebalkan Ayat Arab' },
          { key: 'complete_verse', name: 'Menulis Ayat Lengkap' }
        ];

        const selectedSurah = juzAmmaData.find(s => s.name === exercise.config.surah);
        const maxVerses = selectedSurah?.verses.length || 1;

        return (
          <>
            <InputField label="Pilih Surat" id={`juz-surah-${exercise.id}`}>
              <SelectInput
                id={`juz-surah-${exercise.id}`}
                value={exercise.config.surah}
                onChange={e => {
                  handleConfigChange('surah', e.target.value);
                  // Reset verses ketika ganti surat
                  const newSurah = juzAmmaData.find(s => s.name === e.target.value);
                  if (newSurah) {
                    handleConfigChange('verses', [newSurah.verses[0]]);
                  }
                }}
                options={surahOptions}
              />
            </InputField>

            <InputField label="Jenis Latihan" id={`juz-type-${exercise.id}`}>
              <SelectInput
                id={`juz-type-${exercise.id}`}
                value={exercise.config.exerciseType}
                onChange={e => handleConfigChange('exerciseType', e.target.value)}
                options={exerciseTypeOptions}
              />
            </InputField>

            {selectedSurah && (
              <div className="space-y-2">
                <p className="block text-sm font-medium text-slate-600">Pilih Ayat (max 3 ayat)</p>
                <div className="space-y-2 max-h-40 overflow-y-auto bg-white p-2 rounded-lg border-2 border-orange-200">
                  {selectedSurah.verses.map((verse) => {
                    const isSelected = exercise.config.verses?.some(v => v.verseNumber === verse.number);
                    return (
                      <label key={verse.number} className="flex items-start gap-2 p-2 hover:bg-orange-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            let newVerses: JuzAmmaVerse[] = [];
                            if (e.target.checked) {
                              // Tambahkan ayat, max 3
                              const current = exercise.config.verses || [];
                              if (current.length < 3) {
                                newVerses = [...current, { surah: selectedSurah.name, verseNumber: verse.number, arabic: verse.arabic, translation: verse.translation }];
                              } else {
                                // Jika sudah 3, ganti yang terakhir
                                newVerses = [...current.slice(0, 2), { surah: selectedSurah.name, verseNumber: verse.number, arabic: verse.arabic, translation: verse.translation }];
                              }
                            } else {
                              // Hapus ayat
                              newVerses = (exercise.config.verses || []).filter(v => v.verseNumber !== verse.number);
                            }
                            handleConfigChange('verses', newVerses);
                          }}
                          className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-2 border-orange-300 rounded"
                        />
                        <div className="flex-1 text-xs">
                          <div className="font-bold text-orange-700">Ayat {verse.number}</div>
                          <div className="text-right font-arabic text-lg leading-relaxed mt-1" dir="rtl">{verse.arabic}</div>
                          <div className="text-gray-600 italic mt-1">{verse.translation}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500">Ayat terpilih: {exercise.config.verses?.length || 0}/3</p>
              </div>
            )}

            {exercise.config.exerciseType === 'fill_blank' && (
              <InputField label="Kata yang akan dihilangkan (opsional)" id={`juz-blank-${exercise.id}`}>
                <TextInput
                  id={`juz-blank-${exercise.id}`}
                  value={exercise.config.blankWord || ''}
                  onChange={e => handleConfigChange('blankWord', e.target.value)}
                  placeholder="Contoh: اللَّهُ"
                />
                <p className="text-xs text-gray-500 mt-1">Kosongkan untuk pilih kata random</p>
              </InputField>
            )}
          </>
        );

      case ExerciseType.COLOR_CODING:
        const colorCodingTypes = [
          { key: 'sequence', name: 'Urutan Warna' },
          { key: 'matching', name: 'Cocokkan Warna' },
          { key: 'pattern', name: 'Pola Warna' }
        ];

        const commonColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A'];

        return (
          <>
            <InputField label="Instruksi" id={`color-instruction-${exercise.id}`}>
              <TextInput
                id={`color-instruction-${exercise.id}`}
                value={exercise.config.instruction}
                onChange={e => handleConfigChange('instruction', e.target.value)}
                placeholder="Contoh: Urutkan warna dari merah ke biru"
              />
            </InputField>

            <InputField label="Jenis Latihan" id={`color-type-${exercise.id}`}>
              <SelectInput
                id={`color-type-${exercise.id}`}
                value={exercise.config.exerciseType}
                onChange={e => handleConfigChange('exerciseType', e.target.value as ColorCodingExerciseType)}
                options={colorCodingTypes}
              />
            </InputField>

            <div>
              <label className="block text-sm font-bold text-orange-700 mb-2">Warna (klik untuk toggle)</label>
              <div className="grid grid-cols-5 gap-2">
                {commonColors.map(color => {
                  const isSelected = exercise.config.colors?.includes(color);
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        const currentColors = exercise.config.colors || [];
                        const newColors = isSelected
                          ? currentColors.filter(c => c !== color)
                          : [...currentColors, color];
                        handleConfigChange('colors', newColors);
                      }}
                      className={`h-12 rounded-lg border-4 transition-all duration-200 ${
                        isSelected ? 'border-orange-500 scale-95' : 'border-gray-300 hover:border-orange-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">Warna terpilih: {exercise.config.colors?.length || 0}</p>
            </div>
          </>
        );

      case ExerciseType.SEQUENCE_CODING:
        return (
          <>
            <InputField label="Instruksi" id={`seq-instruction-${exercise.id}`}>
              <TextInput
                id={`seq-instruction-${exercise.id}`}
                value={exercise.config.instruction}
                onChange={e => handleConfigChange('instruction', e.target.value)}
                placeholder="Contoh: Urutkan langkah menyikat gigi yang benar"
              />
            </InputField>

            <div>
              <label className="block text-sm font-bold text-orange-700 mb-2">Langkah-langkah</label>
              {exercise.config.steps?.map((step: SequenceStep, idx: number) => (
                <div key={step.id} className="flex gap-2 mb-2 items-center">
                  <span className="text-orange-600 font-bold">{idx + 1}.</span>
                  <input
                    type="text"
                    value={step.icon}
                    onChange={e => {
                      const newSteps = [...exercise.config.steps];
                      newSteps[idx] = { ...step, icon: e.target.value };
                      handleConfigChange('steps', newSteps);
                    }}
                    placeholder="Emoji"
                    className="w-16 px-2 py-1 border-2 border-orange-300 rounded text-xl text-center"
                  />
                  <input
                    type="text"
                    value={step.label}
                    onChange={e => {
                      const newSteps = [...exercise.config.steps];
                      newSteps[idx] = { ...step, label: e.target.value };
                      handleConfigChange('steps', newSteps);
                    }}
                    placeholder="Deskripsi langkah"
                    className="flex-1 px-3 py-2 border-2 border-orange-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newSteps = exercise.config.steps.filter((_: SequenceStep, i: number) => i !== idx);
                      handleConfigChange('steps', newSteps);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newStep: SequenceStep = {
                    id: `step-${Date.now()}`,
                    icon: '⭐',
                    label: 'Langkah baru'
                  };
                  handleConfigChange('steps', [...(exercise.config.steps || []), newStep]);
                }}
                className="mt-2 w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
              >
                <PlusIcon /> Tambah Langkah
              </button>
            </div>
          </>
        );

      case ExerciseType.IF_THEN_LOGIC:
        return (
          <>
            <InputField label="Instruksi" id={`ifThen-instruction-${exercise.id}`}>
              <TextInput
                id={`ifThen-instruction-${exercise.id}`}
                value={exercise.config.instruction}
                onChange={e => handleConfigChange('instruction', e.target.value)}
                placeholder="Contoh: Ikuti aturan di bawah untuk mewarnai kotak"
              />
            </InputField>

            <InputField label="Jumlah Item" id={`ifThen-items-${exercise.id}`}>
              <NumberInput
                id={`ifThen-items-${exercise.id}`}
                value={exercise.config.items}
                onChange={e => handleConfigChange('items', parseInt(e.target.value))}
                min={5}
                max={20}
              />
            </InputField>

            <div>
              <label className="block text-sm font-bold text-orange-700 mb-2">Aturan Jika-Maka</label>
              {exercise.config.rules?.map((rule: IfThenRule, idx: number) => (
                <div key={rule.id} className="mb-3 p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <div className="flex gap-2 mb-2 items-center">
                    <span className="text-purple-600 font-bold">Aturan {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newRules = exercise.config.rules.filter((_: IfThenRule, i: number) => i !== idx);
                        handleConfigChange('rules', newRules);
                      }}
                      className="ml-auto p-2 text-red-600 hover:bg-red-100 rounded-lg"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <TextInput
                      value={rule.condition}
                      onChange={e => {
                        const newRules = [...exercise.config.rules];
                        newRules[idx] = { ...rule, condition: e.target.value };
                        handleConfigChange('rules', newRules);
                      }}
                      placeholder="Contoh: Jika angka genap"
                      className="w-full"
                    />
                    <TextInput
                      value={rule.action}
                      onChange={e => {
                        const newRules = [...exercise.config.rules];
                        newRules[idx] = { ...rule, action: e.target.value };
                        handleConfigChange('rules', newRules);
                      }}
                      placeholder="Contoh: Warnai biru 🔵"
                      className="w-full"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newRule: IfThenRule = {
                    id: `rule-${Date.now()}-${Math.random()}`,
                    condition: 'Jika...',
                    action: 'Maka...'
                  };
                  handleConfigChange('rules', [...(exercise.config.rules || []), newRule]);
                }}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center justify-center gap-2"
              >
                <PlusIcon /> Tambah Aturan
              </button>
            </div>
          </>
        );

      case ExerciseType.PIXEL_ART:
        const pixelColors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

        return (
          <>
            <InputField label="Instruksi" id={`pixel-instruction-${exercise.id}`}>
              <TextInput
                id={`pixel-instruction-${exercise.id}`}
                value={exercise.config.instruction}
                onChange={e => handleConfigChange('instruction', e.target.value)}
                placeholder="Contoh: Warnai kotak sesuai petunjuk"
              />
            </InputField>

            <div className="grid grid-cols-2 gap-4">
              <InputField label="Jumlah Baris" id={`pixel-rows-${exercise.id}`}>
                <NumberInput
                  id={`pixel-rows-${exercise.id}`}
                  value={exercise.config.gridRows}
                  onChange={e => handleConfigChange('gridRows', parseInt(e.target.value))}
                />
              </InputField>

              <InputField label="Jumlah Kolom" id={`pixel-cols-${exercise.id}`}>
                <NumberInput
                  id={`pixel-cols-${exercise.id}`}
                  value={exercise.config.gridCols}
                  onChange={e => handleConfigChange('gridCols', parseInt(e.target.value))}
                />
              </InputField>
            </div>

            <div>
              <label className="block text-sm font-bold text-orange-700 mb-2">Palet Warna</label>
              <div className="grid grid-cols-4 gap-2">
                {pixelColors.map(color => {
                  const isSelected = exercise.config.colorPalette?.includes(color);
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        const currentPalette = exercise.config.colorPalette || [];
                        const newPalette = isSelected
                          ? currentPalette.filter(c => c !== color)
                          : [...currentPalette, color];
                        handleConfigChange('colorPalette', newPalette);
                      }}
                      className={`h-10 rounded-lg border-4 transition-all duration-200 ${
                        isSelected ? 'border-orange-500 scale-95' : 'border-gray-300 hover:border-orange-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  );
                })}
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-3 border-orange-200 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
      <div className="flex justify-between items-center mb-3">
        <p className="font-bold text-orange-700 text-base">{index + 1}. {exercise.type}</p>
        <button onClick={() => onRemove(exercise.id)} className="text-red-500 hover:text-red-700 hover:scale-110 transition-transform p-1 rounded-lg hover:bg-red-100">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-3">
        <InputField label="Judul Latihan" id={`title-${exercise.id}`}>
          <TextInput id={`title-${exercise.id}`} value={exercise.config.title} onChange={e => handleConfigChange('title', e.target.value)} placeholder="Judul Latihan" />
        </InputField>
        <InputField label="Halaman" id={`page-${exercise.id}`}>
          <select
            id={`page-${exercise.id}`}
            value={exercise.pageNumber}
            onChange={e => onMoveToPage(exercise.id, parseInt(e.target.value, 10))}
            className="block w-full px-3 py-2 border-2 border-orange-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 text-sm transition-all duration-200 bg-white"
          >
            {Array.from({ length: totalPages + 1 }, (_, i) => i + 1).map(pageNum => (
              <option key={pageNum} value={pageNum}>
                Halaman {pageNum}
              </option>
            ))}
          </select>
        </InputField>
        {renderFields()}
      </div>
    </div>
  );
};
