
import React, { useState } from 'react';
import type { Exercise, MatchingPair } from '../types';
import { ExerciseType, coloringPages, mazes } from '../types';
import { TrashIcon, PlusIcon } from './Icons';

interface ExerciseFormProps {
  exercise: Exercise;
  index: number;
  onUpdate: (id: string, newConfig: Partial<Exercise['config']>) => void;
  onRemove: (id: string) => void;
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

export const ExerciseForm: React.FC<ExerciseFormProps> = ({ exercise, index, onUpdate, onRemove }) => {
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
        {renderFields()}
      </div>
    </div>
  );
};
