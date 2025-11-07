import React, { useState, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { ExportOptionsModal } from './components/ExportOptionsModal';
import type { Worksheet, Exercise, Theme, BorderTheme, SchoolInfo } from './types';
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
  borderTheme: 'simple',
  schoolInfo: {
    schoolName: '',
    teacherName: '',
    logoUrl: '',
  },
  exercises: [
    {
      id: '1',
      type: ExerciseType.COUNTING,
      config: {
        emoji: '🍎',
        count: 5,
        title: 'Hitung Apel'
      },
      pageNumber: 1
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
      },
      pageNumber: 1
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
      },
      pageNumber: 1
    },
    {
      id: '4',
      type: ExerciseType.PATTERN,
      config: {
        title: 'Lanjutkan Pola Berikut',
        items: ['😊', '😂', '😊']
      },
      pageNumber: 1
    },
    {
      id: '5',
      type: ExerciseType.TRACING,
      config: {
        text: 'ABCDE',
        title: 'Tebalkan Huruf'
      },
      pageNumber: 1
    },
  ]
};

const App: React.FC = () => {
  const [worksheet, setWorksheet] = useState<Worksheet>(initialWorksheet);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const updateTitle = useCallback((newTitle: string) => {
    setWorksheet(prev => ({ ...prev, title: newTitle }));
  }, []);

  const updateTheme = useCallback((newTheme: Theme) => {
    setWorksheet(prev => ({ ...prev, theme: newTheme }));
  }, []);

  const updateBorderTheme = useCallback((newBorderTheme: BorderTheme) => {
    setWorksheet(prev => ({ ...prev, borderTheme: newBorderTheme }));
  }, []);

  const updateSchoolInfo = useCallback((newSchoolInfo: Partial<SchoolInfo>) => {
    setWorksheet(prev => ({ ...prev, schoolInfo: { ...prev.schoolInfo, ...newSchoolInfo } }));
  }, []);

  const addExercise = useCallback((type: ExerciseType) => {
    const newId = crypto.randomUUID();
    let newExercise: Exercise;
    switch (type) {
      case ExerciseType.COUNTING:
        newExercise = { id: newId, type, config: { title: 'Hitung Gambar', emoji: '😊', count: 3 }, pageNumber: currentPage };
        break;
      case ExerciseType.ADDITION:
        newExercise = { id: newId, type, config: { title: 'Penjumlahan', num1: 1, num2: 2, showHelpers: true, helperEmoji: '🚀' }, pageNumber: currentPage };
        break;
      case ExerciseType.SUBTRACTION:
        newExercise = { id: newId, type, config: { title: 'Pengurangan', num1: 5, num2: 2, showHelpers: true, helperEmoji: '🎈' }, pageNumber: currentPage };
        break;
      case ExerciseType.TRACING:
        newExercise = { id: newId, type, config: { title: 'Tebalkan Teks', text: 'Halo' }, pageNumber: currentPage };
        break;
      case ExerciseType.DRAWING:
        newExercise = { id: newId, type, config: { title: 'Ayo Menggambar', instruction: 'Gambarlah hewan kesukaanmu' }, pageNumber: currentPage };
        break;
      case ExerciseType.PATTERN:
        newExercise = { id: newId, type, config: { title: 'Lanjutkan Pola', items: ['🍎', '🍌', '🍎'] }, pageNumber: currentPage };
        break;
      case ExerciseType.MATCHING:
        newExercise = { id: newId, type, config: { title: 'Jodohkan Gambar', pairs: [
          {id: crypto.randomUUID(), item1: 'Sapi', item2: 'Rumput'},
          {id: crypto.randomUUID(), item1: 'Monyet', item2: 'Pisang'},
          {id: crypto.randomUUID(), item1: 'Kucing', item2: 'Ikan'},
        ] }, pageNumber: currentPage };
        break;
      case ExerciseType.SPELLING:
        newExercise = { id: newId, type, config: { title: 'Mengeja Nama Benda', word: 'BOLA', emojiHint: '⚽' }, pageNumber: currentPage };
        break;
      case ExerciseType.COLORING:
        newExercise = { id: newId, type, config: { title: 'Ayo Mewarnai', instruction: 'Warnai gambar di bawah ini!', svgKey: coloringPages[0].key }, pageNumber: currentPage };
        break;
      case ExerciseType.MAZE:
        newExercise = { id: newId, type, config: { title: 'Cari Jalan Keluar', instruction: 'Bantu tikus menemukan keju!', svgKey: mazes[0].key }, pageNumber: currentPage };
        break;
      default:
        return;
    }
    setWorksheet(prev => ({ ...prev, exercises: [...prev.exercises, newExercise] }));
  }, [currentPage]);

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

  const moveExerciseToPage = useCallback((id: string, newPage: number) => {
    setWorksheet(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === id ? { ...ex, pageNumber: newPage } as Exercise : ex
      )
    }));
  }, []);

  // Calculate total pages
  const totalPages = React.useMemo(() => {
    if (worksheet.exercises.length === 0) return 1;
    return Math.max(...worksheet.exercises.map(ex => ex.pageNumber));
  }, [worksheet.exercises]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    setIsExportModalOpen(true);
  };

  const handleExportPdf = async (
    mode: 'all' | 'current' | 'range',
    startPage?: number,
    endPage?: number
  ) => {
    setIsDownloading(true);
    const printableArea = document.getElementById('printable-area');
    if (!printableArea) {
      console.error('Printable area not found!');
      setIsDownloading(false);
      return;
    }

    try {
      // Determine which pages to export
      let pagesToExport: number[] = [];
      if (mode === 'all') {
        pagesToExport = Array.from({ length: totalPages }, (_, i) => i + 1);
      } else if (mode === 'current') {
        pagesToExport = [currentPage];
      } else if (mode === 'range' && startPage && endPage) {
        pagesToExport = Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        );
      }

      // Initialize PDF with A4 dimensions
      const pdf = new window.jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      // A4 dimensions in mm: 210 x 297
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Store original page
      const originalPage = currentPage;

      // Generate PDF for each page
      for (let i = 0; i < pagesToExport.length; i++) {
        const pageNum = pagesToExport[i];

        // Update current page to render the correct exercises
        setCurrentPage(pageNum);

        // Wait for React to re-render
        await new Promise(resolve => setTimeout(resolve, 100));

        // High-quality capture at 300 DPI for print quality
        const canvas = await window.html2canvas(printableArea, {
          scale: 2.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: printableArea.scrollWidth,
          height: printableArea.scrollHeight,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        // Add new page if not the first page
        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }

        // Calculate dimensions to maintain aspect ratio and fit A4
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        // Center the image vertically if it's shorter than the page
        const yOffset = imgHeight < pdfHeight ? (pdfHeight - imgHeight) / 2 : 0;

        // Add image to PDF with proper A4 dimensions
        pdf.addImage(imgData, 'JPEG', 0, yOffset, imgWidth, Math.min(imgHeight, pdfHeight), undefined, 'FAST');
      }

      // Restore original page
      setCurrentPage(originalPage);

      // Generate filename
      const fileName = `${worksheet.title.replace(/\s+/g, '_').toLowerCase() || 'worksheet'}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen">
      <header className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 shadow-lg p-6 no-print relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-10 text-6xl animate-bounce">⭐</div>
          <div className="absolute top-8 right-20 text-5xl animate-pulse">🎨</div>
          <div className="absolute bottom-4 left-1/4 text-4xl animate-bounce delay-100">✨</div>
          <div className="absolute top-1/2 right-10 text-5xl animate-pulse delay-200">🌈</div>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-6xl">📝</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-comic drop-shadow-lg">
              Kids Worksheet Generator
            </h1>
          </div>
          <p className="text-white text-lg md:text-xl font-medium ml-20 drop-shadow">
            Buat lembar kerja yang menyenangkan untuk anak-anak dengan mudah! 🚀
          </p>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 no-print">
          <ControlPanel
            worksheet={worksheet}
            onUpdateTitle={updateTitle}
            onUpdateTheme={updateTheme}
            onUpdateBorderTheme={updateBorderTheme}
            onUpdateSchoolInfo={updateSchoolInfo}
            onAddExercise={addExercise}
            onUpdateExercise={updateExercise}
            onRemoveExercise={removeExercise}
            onMoveExerciseToPage={moveExerciseToPage}
            totalPages={totalPages}
            onPrint={handlePrint}
            onDownloadPdf={handleDownloadPdf}
            isDownloading={isDownloading}
          />
        </div>
        <div className="lg:col-span-2">
          <PreviewPanel
            worksheet={worksheet}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      <ExportOptionsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportPdf}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
};

export default App;