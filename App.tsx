import React, { useState, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { PreviewPanel } from './components/PreviewPanel';
import type { Worksheet, Exercise, Theme } from './types';
import { ExerciseType, coloringPages, mazes } from './types';

// Declare global libraries loaded via CDN for TypeScript
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

const initialWorksheet: Worksheet = {
  title: 'Latihan Seru Hari Ini!',
  theme: 'default',
  exercises: [
    {
      id: '1',
      type: ExerciseType.COUNTING,
      config: {
        emoji: '🍎',
        count: 5,
        title: 'Hitung Apel'
      }
    },
    {
      id: '2',
      type: ExerciseType.ADDITION,
      config: {
        num1: 3,
        num2: 4,
        showHelpers: true,
        helperEmoji: '⭐',
        title: 'Penjumlahan Bintang'
      }
    },
    {
      id: '3',
      type: ExerciseType.SUBTRACTION,
      config: {
        num1: 8,
        num2: 3,
        showHelpers: true,
        helperEmoji: '🚀',
        title: 'Pengurangan Roket'
      }
    },
    {
      id: '4',
      type: ExerciseType.PATTERN,
      config: {
        title: 'Lanjutkan Pola Berikut',
        items: ['😊', '😂', '😊']
      }
    },
    {
      id: '5',
      type: ExerciseType.TRACING,
      config: {
        text: 'ABCDE',
        title: 'Tebalkan Huruf'
      }
    },
  ]
};

const App: React.FC = () => {
  const [worksheet, setWorksheet] = useState<Worksheet>(initialWorksheet);
  const [isDownloading, setIsDownloading] = useState(false);

  const updateTitle = useCallback((newTitle: string) => {
    setWorksheet(prev => ({ ...prev, title: newTitle }));
  }, []);

  const updateTheme = useCallback((newTheme: Theme) => {
    setWorksheet(prev => ({ ...prev, theme: newTheme }));
  }, []);

  const addExercise = useCallback((type: ExerciseType) => {
    const newId = crypto.randomUUID();
    let newExercise: Exercise;
    switch (type) {
      case ExerciseType.COUNTING:
        newExercise = { id: newId, type, config: { title: 'Hitung Gambar', emoji: '😊', count: 3 } };
        break;
      case ExerciseType.ADDITION:
        newExercise = { id: newId, type, config: { title: 'Penjumlahan', num1: 1, num2: 2, showHelpers: true, helperEmoji: '🚀' } };
        break;
      case ExerciseType.SUBTRACTION:
        newExercise = { id: newId, type, config: { title: 'Pengurangan', num1: 5, num2: 2, showHelpers: true, helperEmoji: '🎈' } };
        break;
      case ExerciseType.TRACING:
        newExercise = { id: newId, type, config: { title: 'Tebalkan Teks', text: 'Halo' } };
        break;
      case ExerciseType.DRAWING:
        newExercise = { id: newId, type, config: { title: 'Ayo Menggambar', instruction: 'Gambarlah hewan kesukaanmu' } };
        break;
      case ExerciseType.PATTERN:
        newExercise = { id: newId, type, config: { title: 'Lanjutkan Pola', items: ['🍎', '🍌', '🍎'] } };
        break;
      case ExerciseType.MATCHING:
        newExercise = { id: newId, type, config: { title: 'Jodohkan Gambar', pairs: [
          {id: crypto.randomUUID(), item1: 'Sapi', item2: 'Rumput'},
          {id: crypto.randomUUID(), item1: 'Monyet', item2: 'Pisang'},
          {id: crypto.randomUUID(), item1: 'Kucing', item2: 'Ikan'},
        ] } };
        break;
      case ExerciseType.SPELLING:
        newExercise = { id: newId, type, config: { title: 'Mengeja Nama Benda', word: 'BOLA', emojiHint: '⚽' } };
        break;
      case ExerciseType.COLORING:
        newExercise = { id: newId, type, config: { title: 'Ayo Mewarnai', instruction: 'Warnai gambar di bawah ini!', svgKey: coloringPages[0].key } };
        break;
      case ExerciseType.MAZE:
        newExercise = { id: newId, type, config: { title: 'Cari Jalan Keluar', instruction: 'Bantu tikus menemukan keju!', svgKey: mazes[0].key } };
        break;
      default:
        return;
    }
    setWorksheet(prev => ({ ...prev, exercises: [...prev.exercises, newExercise] }));
  }, []);

  const updateExercise = useCallback((id: string, newConfig: Partial<Exercise['config']>) => {
    setWorksheet(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === id ? ({ ...ex, config: { ...ex.config, ...newConfig } } as Exercise) : ex
      )
    }));
  }, []);

  const removeExercise = useCallback((id: string) => {
    setWorksheet(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== id)
    }));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    const printableArea = document.getElementById('printable-area');
    if (!printableArea) {
      console.error('Printable area not found!');
      setIsDownloading(false);
      return;
    }

    try {
      const canvas = await window.html2canvas(printableArea, {
        scale: 2, // Use higher scale for better resolution
      });
      const imgData = canvas.toDataURL('image/png');
      
      // A4 page dimensions in mm: 210 x 297
      const pdf = new window.jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${worksheet.title.replace(/\s+/g, '_').toLowerCase() || 'worksheet'}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <header className="bg-white shadow-sm p-4 no-print">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-sky-600 font-comic">Kids Worksheet Generator</h1>
          <p className="text-slate-600">Buat lembar kerja yang menyenangkan untuk anak-anak dengan mudah!</p>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 no-print">
          <ControlPanel
            worksheet={worksheet}
            onUpdateTitle={updateTitle}
            onUpdateTheme={updateTheme}
            onAddExercise={addExercise}
            onUpdateExercise={updateExercise}
            onRemoveExercise={removeExercise}
            onPrint={handlePrint}
            onDownloadPdf={handleDownloadPdf}
            isDownloading={isDownloading}
          />
        </div>
        <div className="lg:col-span-2">
          <PreviewPanel worksheet={worksheet} />
        </div>
      </main>
    </div>
  );
};

export default App;