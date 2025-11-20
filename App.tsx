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

// Browser compatibility and library availability checks
const checkBrowserCompatibility = (): { isCompatible: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  // Check if required libraries are loaded
  if (typeof window.html2canvas === 'undefined') {
    issues.push('html2canvas library tidak tersedia. Pastikan koneksi internet stabil.');
  }
  
  if (typeof window.jspdf === 'undefined') {
    issues.push('jsPDF library tidak tersedia. Pastikan koneksi internet stabil.');
  }
  
  // Check browser support for required features
  if (!document.fonts) {
    issues.push('Browser tidak mendukung Font Loading API. Hasil PDF mungkin tidak optimal.');
  }
  
  if (!window.crypto || !window.crypto.randomUUID) {
    issues.push('Browser tidak mendukung Crypto API. Beberapa fitur mungkin tidak berfungsi.');
  }
  
  // Check Canvas support
  const canvas = document.createElement('canvas');
  if (!canvas.getContext || !canvas.getContext('2d')) {
    issues.push('Browser tidak mendukung HTML5 Canvas. PDF tidak dapat dibuat.');
  }
  
  // Check for modern browser features
  if (!window.Promise) {
    issues.push('Browser tidak mendukung Promises. Silakan gunakan browser yang lebih baru.');
  }
  
  // Check user agent for known problematic browsers
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('internet explorer')) {
    issues.push('Internet Explorer tidak didukung. Silakan gunakan Chrome, Firefox, atau Edge.');
  }
  
  return {
    isCompatible: issues.length === 0,
    issues
  };
};

// Enhanced content validation with detailed error reporting
const validateContentForA4 = (content: HTMLElement): { isValid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!content) {
    errors.push('Konten tidak ditemukan untuk validasi.');
    return { isValid: false, errors, warnings };
  }
  
  const rect = content.getBoundingClientRect();
  
  // Convert pixels to mm (assuming 96 DPI standard)
  const pixelsToMm = (pixels: number) => (pixels * 25.4) / 96;
  
  const contentWidthMm = pixelsToMm(rect.width);
  const contentHeightMm = pixelsToMm(rect.height);
  
  // A4 dimensions and print safe area
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  const PRINT_SAFE_WIDTH_MM = 180; // 210mm - 30mm margins
  const PRINT_SAFE_HEIGHT_MM = 257; // 297mm - 40mm margins
  
  // Check if content exceeds A4 dimensions
  if (contentWidthMm > A4_WIDTH_MM) {
    errors.push(`Lebar konten (${contentWidthMm.toFixed(1)}mm) melebihi lebar kertas A4 (${A4_WIDTH_MM}mm).`);
  }
  
  if (contentHeightMm > A4_HEIGHT_MM) {
    errors.push(`Tinggi konten (${contentHeightMm.toFixed(1)}mm) melebihi tinggi kertas A4 (${A4_HEIGHT_MM}mm).`);
  }
  
  // Check if content exceeds print safe area
  if (contentWidthMm > PRINT_SAFE_WIDTH_MM) {
    if (contentWidthMm <= A4_WIDTH_MM) {
      warnings.push(`Lebar konten (${contentWidthMm.toFixed(1)}mm) mendekati batas kertas. Sebagian konten mungkin terpotong saat dicetak.`);
    }
  }
  
  if (contentHeightMm > PRINT_SAFE_HEIGHT_MM) {
    if (contentHeightMm <= A4_HEIGHT_MM) {
      warnings.push(`Tinggi konten (${contentHeightMm.toFixed(1)}mm) mendekati batas kertas. Sebagian konten mungkin terpotong saat dicetak.`);
    }
  }
  
  // Check for very small content that might indicate rendering issues
  if (contentWidthMm < 50 || contentHeightMm < 50) {
    warnings.push('Konten tampak sangat kecil. Pastikan halaman sudah dimuat dengan benar.');
  }
  
  // Check for extremely large content that might cause memory issues
  const totalPixels = rect.width * rect.height;
  if (totalPixels > 10000000) { // 10 million pixels
    warnings.push('Konten sangat besar dan mungkin menyebabkan masalah performa saat membuat PDF.');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Enhanced error handling with user-friendly messages
const handlePdfGenerationError = (error: any): string => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorLower = errorMessage.toLowerCase();
  
  // Categorize errors and provide specific solutions
  if (errorLower.includes('network') || errorLower.includes('fetch') || errorLower.includes('load')) {
    return 'Gagal memuat library yang diperlukan. Periksa koneksi internet Anda dan coba lagi.';
  }
  
  if (errorLower.includes('memory') || errorLower.includes('out of memory')) {
    return 'Konten terlalu besar untuk diproses. Coba kurangi jumlah latihan per halaman atau tutup tab browser lain.';
  }
  
  if (errorLower.includes('canvas') || errorLower.includes('html2canvas')) {
    return 'Gagal menangkap tampilan halaman. Coba refresh halaman dan pastikan semua konten sudah dimuat dengan benar.';
  }
  
  if (errorLower.includes('pdf') || errorLower.includes('jspdf')) {
    return 'Gagal membuat file PDF. Pastikan browser Anda mendukung fitur ini dan coba lagi.';
  }
  
  if (errorLower.includes('print safe area') || errorLower.includes('too large')) {
    return 'Konten terlalu besar untuk kertas A4. Kurangi jumlah latihan per halaman atau perkecil ukuran konten.';
  }
  
  if (errorLower.includes('font') || errorLower.includes('text')) {
    return 'Masalah dengan rendering teks. Tunggu sebentar agar font dimuat dengan benar, lalu coba lagi.';
  }
  
  if (errorLower.includes('timeout')) {
    return 'Proses pembuatan PDF memakan waktu terlalu lama. Coba kurangi kompleksitas konten atau refresh halaman.';
  }
  
  // Generic fallback message
  return 'Terjadi kesalahan saat membuat PDF. Silakan coba lagi. Jika masalah berlanjut, coba kurangi jumlah latihan per halaman atau refresh halaman.';
};

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

// A4 dimensions and conversion constants for mm-based calculations
const A4_PRINT_SAFE_HEIGHT_MM = 257; // 297mm - 20mm top - 20mm bottom
const A4_PRINT_SAFE_HEIGHT_UNITS = 100; // Normalized units for calculation
const MM_TO_UNITS = A4_PRINT_SAFE_HEIGHT_UNITS / A4_PRINT_SAFE_HEIGHT_MM;

// Utility function to estimate exercise height using mm-based calculations
// Heights are calculated in mm and converted to relative units for consistency
const estimateExerciseHeight = (exercise: Exercise): number => {
  const baseHeightMm = 15; // Base padding and margins for each exercise card in mm
  const baseHeight = baseHeightMm * MM_TO_UNITS;

  switch (exercise.type) {
    case ExerciseType.COUNTING:
      // Title + emojis + answer line
      const countingContentMm = 12 + Math.ceil(exercise.config.count / 5) * 8; // 12mm title + 8mm per row
      return baseHeight + (countingContentMm * MM_TO_UNITS);

    case ExerciseType.ADDITION:
    case ExerciseType.SUBTRACTION:
      // Title + equation + optional helpers
      const equationContentMm = 12; // 12mm for title and equation
      const helpersHeightMm = exercise.config.showHelpers ? 10 : 0; // 10mm for helpers
      return baseHeight + ((equationContentMm + helpersHeightMm) * MM_TO_UNITS);

    case ExerciseType.TRACING:
      // Title + large text
      const tracingContentMm = 20; // 20mm for title and large text
      return baseHeight + (tracingContentMm * MM_TO_UNITS);

    case ExerciseType.DRAWING:
      // Title + instruction + drawing area
      const drawingContentMm = 45; // 45mm for title, instruction and drawing area
      return baseHeight + (drawingContentMm * MM_TO_UNITS);

    case ExerciseType.PATTERN:
      // Title + pattern items
      const patternContentMm = 20; // 20mm for title and pattern items
      return baseHeight + (patternContentMm * MM_TO_UNITS);

    case ExerciseType.MATCHING:
      // Title + matching pairs (depends on number of pairs)
      const pairCount = exercise.config.pairs.length;
      const matchingContentMm = 12 + (pairCount * 5); // 12mm title + 5mm per pair
      return baseHeight + (matchingContentMm * MM_TO_UNITS);

    case ExerciseType.SPELLING:
      // Title + emoji + letter boxes
      const spellingContentMm = 25; // 25mm for title, emoji and letter boxes
      return baseHeight + (spellingContentMm * MM_TO_UNITS);

    case ExerciseType.COLORING:
      // Title + instruction + SVG
      const coloringContentMm = 55; // 55mm for title, instruction and SVG
      return baseHeight + (coloringContentMm * MM_TO_UNITS);

    case ExerciseType.MAZE:
      // Title + instruction + SVG
      const mazeContentMm = 55; // 55mm for title, instruction and SVG
      return baseHeight + (mazeContentMm * MM_TO_UNITS);

    case ExerciseType.JUZ_AMMA:
      // Title + verses (depends on exercise type and verse count)
      const verseCount = exercise.config.verses?.length || 1;
      const { exerciseType: juzExType } = exercise.config;
      let juzContentMm = 12; // Base 12mm for title
      
      if (juzExType === 'matching') {
        juzContentMm += verseCount * 12; // 12mm per verse for matching
      } else if (juzExType === 'tracing') {
        juzContentMm += verseCount * 15; // 15mm per verse for tracing
      } else if (juzExType === 'complete_verse') {
        juzContentMm += verseCount * 20; // 20mm per verse for complete verse
      } else {
        // fill_blank
        juzContentMm += verseCount * 10; // 10mm per verse for fill blank
      }
      return baseHeight + (juzContentMm * MM_TO_UNITS);

    case ExerciseType.COLOR_CODING:
      // Title + color sequence/matching/pattern
      const colorCodingContentMm = 30; // 30mm for title and color elements
      return baseHeight + (colorCodingContentMm * MM_TO_UNITS);

    case ExerciseType.SEQUENCE_CODING:
      // Title + sequence steps
      const stepCount = exercise.config.steps?.length || 3;
      const sequenceContentMm = 12 + (stepCount * 8); // 12mm title + 8mm per step
      return baseHeight + (sequenceContentMm * MM_TO_UNITS);

    case ExerciseType.IF_THEN_LOGIC:
      // Title + rules + items grid
      const ruleCount = exercise.config.rules?.length || 2;
      const itemCount = exercise.config.items || 10;
      const logicContentMm = 12 + (ruleCount * 6) + Math.ceil(itemCount / 5) * 8; // 12mm title + 6mm per rule + 8mm per row of items
      return baseHeight + (logicContentMm * MM_TO_UNITS);

    case ExerciseType.PIXEL_ART:
      // Title + grid (depends on grid size)
      const gridSize = Math.max(exercise.config.gridRows || 8, exercise.config.gridCols || 8);
      const pixelContentMm = 12 + Math.min(gridSize * 3, 50); // 12mm title + 3mm per grid unit, max 50mm
      return baseHeight + (pixelContentMm * MM_TO_UNITS);

    default:
      const defaultContentMm = 25; // 25mm default content height
      return baseHeight + (defaultContentMm * MM_TO_UNITS);
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

// Maximum height that fits comfortably on an A4 page based on print safe area
const MAX_PAGE_HEIGHT = A4_PRINT_SAFE_HEIGHT_UNITS; // Based on A4 print safe height (257mm)

// Main App Component with Auth Logic
const MainApp: React.FC = () => {
  const [worksheet, setWorksheet] = useState<Worksheet>(initialWorksheet);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [libraryLoadError, setLibraryLoadError] = useState<string | null>(null);

  // Check library availability on component mount
  React.useEffect(() => {
    const checkLibraries = () => {
      const compatibility = checkBrowserCompatibility();
      if (!compatibility.isCompatible) {
        const criticalIssues = compatibility.issues.filter(issue => 
          issue.includes('html2canvas') || 
          issue.includes('jsPDF') || 
          issue.includes('Canvas') ||
          issue.includes('Internet Explorer')
        );
        
        if (criticalIssues.length > 0) {
          setLibraryLoadError(criticalIssues.join(' '));
        }
      }
    };

    // Check immediately
    checkLibraries();
    
    // Also check after a delay to ensure libraries have time to load
    const timeoutId = setTimeout(checkLibraries, 2000);
    
    return () => clearTimeout(timeoutId);
  }, []);

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
            verses: [{
              surah: firstSurah.name,
              verseNumber: firstSurah.verses[0].number,
              arabic: firstSurah.verses[0].arabic,
              translation: firstSurah.verses[0].translation
            }],
            blankWord: undefined
          },
          pageNumber: currentPage
        };
        break;
      case ExerciseType.COLOR_CODING:
        newExercise = {
          id: newId,
          type,
          config: {
            title: 'Latihan Koding Warna',
            exerciseType: 'sequence',
            colors: ['#FF0000', '#00FF00', '#0000FF'],
            instruction: 'Urutkan warna dari merah ke biru'
          },
          pageNumber: currentPage
        };
        break;
      case ExerciseType.SEQUENCE_CODING:
        newExercise = {
          id: newId,
          type,
          config: {
            title: 'Latihan Urutan Langkah',
            steps: [
              { id: crypto.randomUUID(), icon: '🦷', label: 'Ambil sikat gigi' },
              { id: crypto.randomUUID(), icon: '🧴', label: 'Beri pasta gigi' },
              { id: crypto.randomUUID(), icon: '😁', label: 'Sikat gigi' }
            ],
            instruction: 'Urutkan langkah menyikat gigi yang benar'
          },
          pageNumber: currentPage
        };
        break;
      case ExerciseType.IF_THEN_LOGIC:
        newExercise = {
          id: newId,
          type,
          config: {
            title: 'Latihan Logika Jika-Maka',
            rules: [
              { id: crypto.randomUUID(), condition: 'Jika angka genap', action: 'Warnai biru 🔵', emoji: '🔵' },
              { id: crypto.randomUUID(), condition: 'Jika angka ganjil', action: 'Warnai merah 🔴', emoji: '🔴' }
            ],
            instruction: 'Ikuti aturan di bawah untuk mewarnai kotak sesuai angkanya',
            items: 10
          },
          pageNumber: currentPage
        };
        break;
      case ExerciseType.PIXEL_ART:
        newExercise = {
          id: newId,
          type,
          config: {
            title: 'Latihan Pixel Art',
            gridRows: 8,
            gridCols: 8,
            colorPalette: ['#000000', '#FF0000', '#00FF00', '#0000FF'],
            instruction: 'Warnai kotak sesuai petunjuk untuk membuat gambar',
            prefilledCells: []
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

  // Legacy function for backward compatibility - now uses enhanced validation
  const validatePrintSafeArea = (content: HTMLElement): boolean => {
    const validation = validateContentForA4(content);
    
    if (!validation.isValid) {
      console.warn('Content validation failed:', validation.errors);
    }
    
    if (validation.warnings.length > 0) {
      console.warn('Content validation warnings:', validation.warnings);
    }
    
    return validation.isValid;
  };

  // Helper function to ensure all fonts are loaded
  const waitForFonts = async (): Promise<void> => {
    // Wait for document fonts to be ready
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Explicitly check for critical fonts
    const criticalFonts = ['Poppins', 'Comic Neue', 'Amiri'];
    const fontChecks = criticalFonts.map(async (fontFamily) => {
      try {
        await document.fonts.load(`16px "${fontFamily}"`);
        await document.fonts.load(`bold 16px "${fontFamily}"`);
      } catch (e) {
        console.warn(`Font ${fontFamily} may not be loaded:`, e);
      }
    });

    await Promise.all(fontChecks);

    // Extended wait for Arabic font rendering (Amiri needs more time)
    await new Promise(resolve => setTimeout(resolve, 500)); // Increased from 300ms

    // Force multiple reflows to ensure complete rendering
    const printableArea = document.getElementById('printable-area');
    if (printableArea) {
      printableArea.offsetHeight; // Force reflow 1
      await new Promise(resolve => setTimeout(resolve, 50));
      printableArea.offsetHeight; // Force reflow 2
      await new Promise(resolve => setTimeout(resolve, 50));
      printableArea.offsetHeight; // Force reflow 3
    }

    // Additional wait for GPU rendering to complete
    await new Promise(resolve => requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    }));
  };

  // Pre-render optimization function to add pdf-optimized class and force integer positioning
  const optimizeForPdfRendering = (element: HTMLElement): void => {
    // Add pdf-optimized class to the main element
    element.classList.add('pdf-optimized');
    
    // Optimize all child elements
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.classList.add('pdf-optimized');
        
        // Force integer positioning for elements with borders
        const computedStyle = window.getComputedStyle(el);
        if (computedStyle.borderBottomWidth && computedStyle.borderBottomWidth !== '0px') {
          el.style.transform = 'translateZ(0)';
          el.style.backfaceVisibility = 'hidden';
        }
      }
    });
    
    // Force reflow after optimization
    element.offsetHeight;
  };

  // Cleanup function to remove pdf-optimized class and inline styles
  const cleanupPdfOptimization = (element: HTMLElement): void => {
    // Remove pdf-optimized class from main element
    element.classList.remove('pdf-optimized');
    
    // Remove pdf-optimized class from all children
    const allElements = element.querySelectorAll('.pdf-optimized');
    allElements.forEach((el) => {
      el.classList.remove('pdf-optimized');
    });
    
    // Cleanup inline styles that were added
    const elementsWithInlineStyles = element.querySelectorAll('[style*="transform"][style*="translateZ"]');
    elementsWithInlineStyles.forEach((el) => {
      if (el instanceof HTMLElement) {
        // Only remove the specific styles we added, preserve others
        if (el.style.transform === 'translateZ(0)') {
          el.style.transform = '';
        }
        if (el.style.backfaceVisibility === 'hidden') {
          el.style.backfaceVisibility = '';
        }
      }
    });
  };

  // Rendering validation function to check if content is ready for PDF capture
  const validateRendering = async (element: HTMLElement): Promise<{ isValid: boolean; issues: string[] }> => {
    const issues: string[] = [];

    // Check if all fonts are loaded
    if (document.fonts) {
      if (document.fonts.status !== 'loaded') {
        issues.push('Font belum sepenuhnya dimuat. Tunggu sebentar...');
      }

      // Check for critical fonts
      const criticalFonts = ['Poppins', 'Comic Neue', 'Amiri'];
      for (const fontFamily of criticalFonts) {
        const fontLoaded = document.fonts.check(`16px "${fontFamily}"`);
        if (!fontLoaded) {
          issues.push(`Font ${fontFamily} belum dimuat dengan sempurna.`);
        }
      }
    } else {
      issues.push('Browser tidak mendukung Font Loading API. Hasil mungkin tidak optimal.');
    }

    // Check if element has proper dimensions
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      issues.push('Elemen memiliki dimensi nol. Konten mungkin belum di-render dengan benar.');
    }

    // Check if element is visible
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
      issues.push('Elemen tidak terlihat. Pastikan konten ditampilkan dengan benar.');
    }

    // Check if all images are loaded
    const images = element.querySelectorAll('img');
    const imageChecks = Array.from(images).map((img) => {
      return img.complete && img.naturalHeight !== 0;
    });

    const unloadedImages = imageChecks.filter(check => !check).length;
    if (unloadedImages > 0) {
      issues.push(`${unloadedImages} gambar belum dimuat dengan sempurna.`);
    }

    // Check for SVG elements (common in coloring/maze exercises)
    const svgs = element.querySelectorAll('svg');
    if (svgs.length > 0) {
      svgs.forEach((svg, index) => {
        const svgRect = svg.getBoundingClientRect();
        if (svgRect.width === 0 || svgRect.height === 0) {
          issues.push(`SVG #${index + 1} belum di-render dengan benar.`);
        }
      });
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  };

  const handleExportPdf = async (
    mode: 'all' | 'current' | 'range',
    startPage?: number,
    endPage?: number
  ) => {
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Step 1: Check browser compatibility
      const compatibility = checkBrowserCompatibility();
      if (!compatibility.isCompatible) {
        setIsDownloading(false);
        const issuesList = compatibility.issues.join('\n• ');
        alert(`Browser tidak kompatibel untuk membuat PDF:\n\n• ${issuesList}\n\nSilakan gunakan browser yang lebih baru seperti Chrome, Firefox, atau Edge.`);
        return;
      }

      // Step 2: Find printable area
      const printableArea = document.getElementById('printable-area');
      if (!printableArea) {
        setIsDownloading(false);
        alert('Area konten tidak ditemukan. Silakan refresh halaman dan coba lagi.');
        return;
      }

      // Initial progress: 5%
      setDownloadProgress(5);

      // Step 3: Comprehensive content validation
      const contentValidation = validateContentForA4(printableArea);
      
      if (!contentValidation.isValid) {
        setIsDownloading(false);
        const errorsList = contentValidation.errors.join('\n• ');
        alert(`Konten tidak sesuai untuk kertas A4:\n\n• ${errorsList}\n\nSilakan kurangi jumlah latihan per halaman atau perkecil ukuran konten.`);
        return;
      }

      // Show warnings if any (but continue with generation)
      if (contentValidation.warnings.length > 0) {
        const warningsList = contentValidation.warnings.join('\n• ');
        const proceed = confirm(`Peringatan:\n\n• ${warningsList}\n\nLanjutkan membuat PDF?`);
        if (!proceed) {
          setIsDownloading(false);
          return;
        }
      }

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

      // Step 4: Initialize PDF with A4 dimensions
      let pdf;
      try {
        pdf = new window.jspdf.jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true,
        });
      } catch (pdfError) {
        throw new Error(`Gagal menginisialisasi PDF: ${pdfError instanceof Error ? pdfError.message : String(pdfError)}`);
      }

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

        // Apply pre-render optimization
        optimizeForPdfRendering(printableArea);

        // Additional wait for GPU rendering after optimization
        await new Promise(resolve => setTimeout(resolve, 200));

        // Validate rendering before capture
        const validation = await validateRendering(printableArea);
        if (!validation.isValid) {
          // Show warning with option to retry or continue
          const issuesList = validation.issues.join('\n• ');
          const userChoice = confirm(
            `Peringatan untuk halaman ${pageNum}:\n\n• ${issuesList}\n\n` +
            `Klik OK untuk mencoba lagi setelah menunggu lebih lama, atau Cancel untuk melanjutkan tanpa menunggu.`
          );

          if (userChoice) {
            // User chose to retry - wait longer and validate again
            await new Promise(resolve => setTimeout(resolve, 1000));
            await waitForFonts();
            
            const retryValidation = await validateRendering(printableArea);
            if (!retryValidation.isValid) {
              // Still has issues, but continue anyway with a warning
              const continueAnyway = confirm(
                `Masih ada masalah setelah mencoba lagi:\n\n• ${retryValidation.issues.join('\n• ')}\n\n` +
                `Lanjutkan membuat PDF? Hasil mungkin tidak sempurna.`
              );
              
              if (!continueAnyway) {
                // User chose to cancel
                cleanupPdfOptimization(printableArea);
                setCurrentPage(originalPage);
                setIsDownloading(false);
                return;
              }
            }
          }
          // If user clicked Cancel, continue without retrying
        }

        // Update progress for rendering
        setDownloadProgress(Math.floor(20 + (i * progressPerPage * 0.3)));

        // Capture content at optimal resolution with improved settings for Arabic text
        let canvas;
        try {
          canvas = await Promise.race([
            window.html2canvas(printableArea, {
              scale: 3, // Increased from 2 to 3 for better precision
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff',
              letterRendering: true, // Changed to true for better text rendering
              logging: false,
              imageTimeout: 15000, // 15 second timeout for images
              removeContainer: true,
              windowWidth: printableArea.scrollWidth,
              windowHeight: printableArea.scrollHeight,
              foreignObjectRendering: false, // Disable for better border rendering
              onclone: (clonedDoc) => {
                // Force pixel-perfect rendering in cloned document
                const clonedArea = clonedDoc.getElementById('printable-area');
                if (clonedArea) {
                  // Force reflow and repaint
                  clonedArea.style.transform = 'translateZ(0)';
                  clonedArea.offsetHeight; // Force reflow
                  
                  // Ensure all fonts are loaded in cloned document
                  if (clonedDoc.fonts && clonedDoc.fonts.ready) {
                    return clonedDoc.fonts.ready;
                  }
                }
              },
            }),
            // Timeout after 30 seconds
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('html2canvas timeout - halaman terlalu kompleks')), 30000)
            )
          ]);
        } catch (canvasError) {
          throw new Error(`Gagal menangkap tampilan halaman ${pageNum}: ${canvasError instanceof Error ? canvasError.message : String(canvasError)}`);
        } finally {
          // Cleanup optimization after capture (whether successful or not)
          cleanupPdfOptimization(printableArea);
        }

        // Validate canvas result
        if (!canvas || canvas.width === 0 || canvas.height === 0) {
          throw new Error(`Canvas kosong untuk halaman ${pageNum}. Pastikan konten sudah dimuat dengan benar.`);
        }

        // Update progress for canvas processing
        setDownloadProgress(Math.floor(20 + (i * progressPerPage * 0.6)));

        // Convert canvas to image data with error handling
        let imgData;
        try {
          imgData = canvas.toDataURL('image/png', 1.0);
          
          // Validate image data
          if (!imgData || imgData === 'data:,' || imgData.length < 100) {
            throw new Error('Data gambar kosong atau tidak valid');
          }
        } catch (imageError) {
          throw new Error(`Gagal mengkonversi halaman ${pageNum} ke gambar: ${imageError instanceof Error ? imageError.message : String(imageError)}`);
        }

        // Add new page if not the first page
        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }

        // Calculate dimensions to fit image properly within A4 print safe area
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;

        // A4 print safe area dimensions (excluding margins)
        // 20mm top/bottom margins, 15mm left/right margins
        const printSafeWidth = pdfWidth - 30; // 210mm - 15mm left - 15mm right = 180mm
        const printSafeHeight = pdfHeight - 40; // 297mm - 20mm top - 20mm bottom = 257mm
        const printSafeRatio = printSafeWidth / printSafeHeight;

        let finalWidth: number, finalHeight: number;

        // Fit to print safe area while maintaining aspect ratio
        if (ratio > printSafeRatio) {
          // Image is wider - fit to safe width
          finalWidth = printSafeWidth;
          finalHeight = printSafeWidth / ratio;
        } else {
          // Image is taller - fit to safe height
          finalHeight = printSafeHeight;
          finalWidth = printSafeHeight * ratio;
        }

        // Position within print safe area (center content within safe margins)
        const xOffset = 15 + Math.round((printSafeWidth - finalWidth) / 2); // 15mm left margin + centering
        const yOffset = 20 + Math.round((printSafeHeight - finalHeight) / 2); // 20mm top margin + centering

        // Add the image to PDF with higher quality and error handling
        try {
          pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'FAST');
        } catch (addImageError) {
          throw new Error(`Gagal menambahkan halaman ${pageNum} ke PDF: ${addImageError instanceof Error ? addImageError.message : String(addImageError)}`);
        }

        // Update progress after adding page
        setDownloadProgress(Math.floor(20 + ((i + 1) * progressPerPage)));
      }

      // Restore original page
      setCurrentPage(originalPage);

      // Final processing
      setDownloadProgress(95);

      // Step 5: Save PDF with error handling
      try {
        const fileName = `${worksheet.title.replace(/\s+/g, '_').toLowerCase() || 'worksheet'}.pdf`;
        pdf.save(fileName);
      } catch (saveError) {
        throw new Error(`Gagal menyimpan file PDF: ${saveError instanceof Error ? saveError.message : String(saveError)}`);
      }

      // Complete!
      setDownloadProgress(100);

      // Keep at 100% for a moment before closing
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error generating PDF:", error);
      
      // Use enhanced error handling
      const userFriendlyMessage = handlePdfGenerationError(error);
      
      // Show detailed error message with fallback options
      const errorDetails = error instanceof Error ? error.message : String(error);
      const fullMessage = `${userFriendlyMessage}\n\nOpsi alternatif:\n• Coba refresh halaman dan ulangi\n• Kurangi jumlah latihan per halaman\n• Gunakan browser Chrome atau Firefox\n• Pastikan koneksi internet stabil\n• Gunakan opsi Print Manual (Ctrl+P)`;
      
      const useManualPrint = confirm(`${fullMessage}\n\nApakah Anda ingin mencoba print manual sebagai alternatif?`);
      
      if (useManualPrint) {
        // Fallback to manual print
        try {
          // Show only the current page for printing
          const originalPage = currentPage;
          if (mode === 'current') {
            setCurrentPage(currentPage);
          } else if (mode === 'range' && startPage) {
            setCurrentPage(startPage);
          } else {
            setCurrentPage(1);
          }
          
          // Wait for page to render
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Trigger browser print dialog
          window.print();
          
          // Restore original page
          setCurrentPage(originalPage);
        } catch (printError) {
          alert('Gagal membuka dialog print. Silakan gunakan Ctrl+P secara manual.');
        }
      }
      
      // Log detailed error for debugging
      console.error('Detailed PDF generation error:', {
        error: errorDetails,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        mode,
        startPage,
        endPage,
        totalPages,
        currentPage
      });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen">
      {/* Library Load Error Warning */}
      {libraryLoadError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 no-print">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                Peringatan: {libraryLoadError}
              </p>
              <p className="text-xs mt-1">
                Fitur download PDF mungkin tidak berfungsi dengan baik. Silakan refresh halaman atau gunakan browser yang lebih baru.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <header className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 shadow-lg p-6 no-print relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-10 text-6xl animate-bounce">⭐</div>
          <div className="absolute top-8 right-20 text-5xl animate-pulse">🎨</div>
          <div className="absolute bottom-4 left-1/4 text-4xl animate-bounce delay-100">✨</div>
          <div className="absolute top-1/2 right-10 text-5xl animate-pulse delay-200">🌈</div>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <span className="text-4xl sm:text-5xl md:text-6xl">📝</span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white font-comic drop-shadow-lg">
                  Kids Worksheet Generator
                </h1>
              </div>
              <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-medium ml-12 sm:ml-16 md:ml-20 drop-shadow">
                Buat lembar kerja yang menyenangkan untuk anak-anak dengan mudah! 🚀
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
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

// App component - directly shows the worksheet generator
const App: React.FC = () => {
  return <MainApp />;
};

export default App;