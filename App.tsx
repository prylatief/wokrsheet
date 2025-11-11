import React, { useState, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { ExportOptionsModal } from './components/ExportOptionsModal';
import { DownloadProgressModal } from './components/DownloadProgressModal';
import type { Worksheet, Exercise, Theme, BorderTheme, SchoolInfo } from './types';
import { ExerciseType, coloringPages, mazes, juzAmmaData } from './types';

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

// Utility function to estimate exercise height in relative units
// These are approximate values based on typical rendering
const estimateExerciseHeight = (exercise: Exercise): number => {
  const baseHeight = 8; // Base padding and margins for each exercise card

  switch (exercise.type) {
    case ExerciseType.COUNTING:
      // Title + emojis + answer line
      return baseHeight + 6 + Math.ceil(exercise.config.count / 5) * 3;

    case ExerciseType.ADDITION:
    case ExerciseType.SUBTRACTION:
      // Title + equation + optional helpers
      const helpersHeight = exercise.config.showHelpers ? 4 : 0;
      return baseHeight + 6 + helpersHeight;

    case ExerciseType.TRACING:
      // Title + large text
      return baseHeight + 8;

    case ExerciseType.DRAWING:
      // Title + instruction + drawing area
      return baseHeight + 18;

    case ExerciseType.PATTERN:
      // Title + pattern items
      return baseHeight + 8;

    case ExerciseType.MATCHING:
      // Title + matching pairs (depends on number of pairs)
      const pairCount = exercise.config.pairs.length;
      return baseHeight + 6 + (pairCount * 2);

    case ExerciseType.SPELLING:
      // Title + emoji + letter boxes
      return baseHeight + 10;

    case ExerciseType.COLORING:
      // Title + instruction + SVG
      return baseHeight + 22;

    case ExerciseType.MAZE:
      // Title + instruction + SVG
      return baseHeight + 22;

    case ExerciseType.JUZ_AMMA:
      // Title + verses (depends on exercise type and verse count)
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

    default:
      return baseHeight + 10;
  }
};

// Calculate total height of exercises on a page
const calculatePageHeight = (exercises: Exercise[]): number => {
  const headerHeight = 10; // Name, class, and worksheet title
  const exerciseSpacing = 2; // Space between exercises

  const exercisesHeight = exercises.reduce((total, ex) => {
    return total + estimateExerciseHeight(ex) + exerciseSpacing;
  }, 0);

  return headerHeight + exercisesHeight;
};

// Maximum height that fits comfortably on an A4 page
const MAX_PAGE_HEIGHT = 85; // Conservative estimate to ensure content fits

const App: React.FC = () => {
  const [worksheet, setWorksheet] = useState<Worksheet>(initialWorksheet);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadProgress, setDownloadProgress] = useState(0);

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
        newExercise = { id: newId, type, config: { title: 'Tebalkan Teks', text: 'ABC' }, pageNumber: currentPage };
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
      case ExerciseType.JUZ_AMMA:
        const firstSurah = juzAmmaData[0];
        newExercise = {
          id: newId,
          type,
          config: {
            title: 'Latihan Juz Amma',
            exerciseType: 'fill_blank',
            surah: firstSurah.name,
            verses: [firstSurah.verses[0]],
            blankWord: undefined
          },
          pageNumber: currentPage
        };
        break;
      default:
        return;
    }

    // Check if adding this exercise would exceed page height
    setWorksheet(prev => {
      const currentPageExercises = prev.exercises.filter(ex => ex.pageNumber === currentPage);
      const testExercises = [...currentPageExercises, newExercise];
      const projectedHeight = calculatePageHeight(testExercises);

      // If adding this exercise exceeds the max height, place it on the next page
      if (projectedHeight > MAX_PAGE_HEIGHT && currentPageExercises.length > 0) {
        const nextPage = currentPage + 1;
        newExercise = { ...newExercise, pageNumber: nextPage };
        // Automatically switch to the new page
        setCurrentPage(nextPage);
      }

      return { ...prev, exercises: [...prev.exercises, newExercise] };
    });
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

  const handleDownloadPdf = () => {
    setIsExportModalOpen(true);
  };

  // Helper function to ensure all fonts are loaded
  const waitForFonts = async (): Promise<void> => {
    // Wait for document fonts to be ready
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Additional wait to ensure fonts are fully rendered
    await new Promise(resolve => setTimeout(resolve, 300));

    // Force a reflow to ensure all text is rendered with correct fonts
    const printableArea = document.getElementById('printable-area');
    if (printableArea) {
      printableArea.offsetHeight; // Force reflow
    }
  };

  const handleExportPdf = async (
    mode: 'all' | 'current' | 'range',
    startPage?: number,
    endPage?: number
  ) => {
    setIsDownloading(true);
    setDownloadProgress(0);

    const printableArea = document.getElementById('printable-area');
    if (!printableArea) {
      console.error('Printable area not found!');
      setIsDownloading(false);
      return;
    }

    try {
      // Initial progress: 5%
      setDownloadProgress(5);

      // Ensure all fonts (especially Arabic) are loaded
      await waitForFonts();
      setDownloadProgress(10);

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

      setDownloadProgress(15);

      // Initialize PDF with A4 dimensions
      const pdf = new window.jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      setDownloadProgress(20);

      // A4 dimensions in mm: 210 x 297
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Store original page
      const originalPage = currentPage;

      // Calculate progress increment per page (from 20% to 90%)
      const progressPerPage = 70 / pagesToExport.length;

      // Generate PDF for each page
      for (let i = 0; i < pagesToExport.length; i++) {
        const pageNum = pagesToExport[i];

        // Update current page to render the correct exercises
        setCurrentPage(pageNum);

        // Wait for React to re-render and fonts to load
        await new Promise(resolve => setTimeout(resolve, 300));
        await waitForFonts();

        // Update progress for rendering
        setDownloadProgress(Math.floor(20 + (i * progressPerPage * 0.3)));

        // Capture content at high resolution with improved settings for Arabic text
        const canvas = await window.html2canvas(printableArea, {
          scale: 3, // Increased scale for better Arabic text rendering
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          letterRendering: true, // Better text rendering
          logging: false,
          imageTimeout: 0,
          removeContainer: true,
        });

        // Update progress for canvas processing
        setDownloadProgress(Math.floor(20 + (i * progressPerPage * 0.6)));

        const imgData = canvas.toDataURL('image/png', 1.0);

        // Add new page if not the first page
        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }

        // Calculate dimensions to fit image properly on A4 page
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        const pageRatio = pdfWidth / pdfHeight;

        let finalWidth = pdfWidth;
        let finalHeight = pdfHeight;

        // Fit to page while maintaining aspect ratio
        if (ratio > pageRatio) {
          // Image is wider than page
          finalHeight = pdfWidth / ratio;
        } else {
          // Image is taller than page or same ratio
          finalWidth = pdfHeight * ratio;
        }

        // Center the image on the page
        const xOffset = (pdfWidth - finalWidth) / 2;
        const yOffset = (pdfHeight - finalHeight) / 2;

        // Add the image to PDF with higher quality
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'FAST');

        // Update progress after adding page
        setDownloadProgress(Math.floor(20 + ((i + 1) * progressPerPage)));
      }

      // Restore original page
      setCurrentPage(originalPage);

      // Final processing
      setDownloadProgress(95);

      // Generate filename
      const fileName = `${worksheet.title.replace(/\s+/g, '_').toLowerCase() || 'worksheet'}.pdf`;
      pdf.save(fileName);

      // Complete!
      setDownloadProgress(100);

      // Keep at 100% for a moment before closing
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
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
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
        </div>
      </main>

      <ExportOptionsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportPdf}
        totalPages={totalPages}
        currentPage={currentPage}
      />

      <DownloadProgressModal
        isOpen={isDownloading}
        progress={downloadProgress}
      />
    </div>
  );
};

export default App;