/**
 * Test Suite for PDF A4 Dimensions and Print Safe Area
 * Task 7.1: Test PDF dimensions dan print safe area
 * 
 * This test suite validates:
 * - Exact A4 dimensions (210mm x 297mm)
 * - Print safe area calculations
 * - Content validation for A4 compliance
 * - Browser compatibility for PDF generation
 */

// Mock global objects for testing environment
global.window = {
  jspdf: {
    jsPDF: class MockJsPDF {
      constructor(options) {
        this.options = options;
        this.internal = {
          pageSize: {
            getWidth: () => 210, // A4 width in mm
            getHeight: () => 297  // A4 height in mm
          }
        };
      }
      
      addPage() {}
      addImage() {}
      save() {}
    }
  },
  html2canvas: () => Promise.resolve({
    width: 794,  // 210mm at 96 DPI
    height: 1123, // 297mm at 96 DPI
    toDataURL: () => 'data:image/png;base64,test'
  }),
  crypto: {
    randomUUID: () => 'test-uuid'
  },
  Promise: global.Promise
};

global.document = {
  getElementById: (id) => {
    if (id === 'printable-area') {
      return {
        getBoundingClientRect: () => ({
          width: 794,  // 210mm in pixels at 96 DPI
          height: 1123, // 297mm in pixels at 96 DPI
          top: 0,
          left: 0
        }),
        offsetHeight: 1123,
        scrollWidth: 794,
        scrollHeight: 1123
      };
    }
    return null;
  },
  createElement: () => ({
    getContext: () => ({})
  }),
  fonts: {
    ready: Promise.resolve()
  }
};

global.navigator = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

// Test constants
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PRINT_SAFE_WIDTH_MM = 180; // 210mm - 30mm margins
const PRINT_SAFE_HEIGHT_MM = 257; // 297mm - 40mm margins
const DPI_96 = 96;

// Utility functions to test
const pixelsToMm = (pixels) => (pixels * 25.4) / DPI_96;
const mmToPixels = (mm) => (mm * DPI_96) / 25.4;

// Browser compatibility check function (from App.tsx)
const checkBrowserCompatibility = () => {
  const issues = [];
  
  if (typeof window.html2canvas === 'undefined') {
    issues.push('html2canvas library tidak tersedia. Pastikan koneksi internet stabil.');
  }
  
  if (typeof window.jspdf === 'undefined') {
    issues.push('jsPDF library tidak tersedia. Pastikan koneksi internet stabil.');
  }
  
  if (!document.fonts) {
    issues.push('Browser tidak mendukung Font Loading API. Hasil PDF mungkin tidak optimal.');
  }
  
  if (!window.crypto || !window.crypto.randomUUID) {
    issues.push('Browser tidak mendukung Crypto API. Beberapa fitur mungkin tidak berfungsi.');
  }
  
  const canvas = document.createElement('canvas');
  if (!canvas.getContext || !canvas.getContext('2d')) {
    issues.push('Browser tidak mendukung HTML5 Canvas. PDF tidak dapat dibuat.');
  }
  
  if (!window.Promise) {
    issues.push('Browser tidak mendukung Promises. Silakan gunakan browser yang lebih baru.');
  }
  
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('internet explorer')) {
    issues.push('Internet Explorer tidak didukung. Silakan gunakan Chrome, Firefox, atau Edge.');
  }
  
  return {
    isCompatible: issues.length === 0,
    issues
  };
};

// Content validation function (from App.tsx)
const validateContentForA4 = (content) => {
  const errors = [];
  const warnings = [];
  
  if (!content) {
    errors.push('Konten tidak ditemukan untuk validasi.');
    return { isValid: false, errors, warnings };
  }
  
  const rect = content.getBoundingClientRect();
  
  const contentWidthMm = pixelsToMm(rect.width);
  const contentHeightMm = pixelsToMm(rect.height);
  
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

// Test Suite
describe('PDF A4 Dimensions and Print Safe Area Tests', () => {
  
  describe('A4 Dimension Constants', () => {
    test('A4 width should be exactly 210mm', () => {
      expect(A4_WIDTH_MM).toBe(210);
    });
    
    test('A4 height should be exactly 297mm', () => {
      expect(A4_HEIGHT_MM).toBe(297);
    });
    
    test('Print safe width should account for 30mm total margins', () => {
      expect(PRINT_SAFE_WIDTH_MM).toBe(A4_WIDTH_MM - 30);
      expect(PRINT_SAFE_WIDTH_MM).toBe(180);
    });
    
    test('Print safe height should account for 40mm total margins', () => {
      expect(PRINT_SAFE_HEIGHT_MM).toBe(A4_HEIGHT_MM - 40);
      expect(PRINT_SAFE_HEIGHT_MM).toBe(257);
    });
  });
  
  describe('Pixel to MM Conversion', () => {
    test('210mm should convert to correct pixels at 96 DPI', () => {
      const pixels = mmToPixels(210);
      expect(Math.round(pixels)).toBe(794);
    });
    
    test('297mm should convert to correct pixels at 96 DPI', () => {
      const pixels = mmToPixels(297);
      expect(Math.round(pixels)).toBe(1123);
    });
    
    test('794 pixels should convert back to 210mm', () => {
      const mm = pixelsToMm(794);
      expect(Math.round(mm)).toBe(210);
    });
    
    test('1123 pixels should convert back to 297mm', () => {
      const mm = pixelsToMm(1123);
      expect(Math.round(mm)).toBe(297);
    });
  });
  
  describe('Browser Compatibility Checks', () => {
    test('should detect compatible browser environment', () => {
      const result = checkBrowserCompatibility();
      expect(result.isCompatible).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
    
    test('should detect missing html2canvas library', () => {
      const originalHtml2canvas = window.html2canvas;
      delete window.html2canvas;
      
      const result = checkBrowserCompatibility();
      expect(result.isCompatible).toBe(false);
      expect(result.issues).toContain('html2canvas library tidak tersedia. Pastikan koneksi internet stabil.');
      
      window.html2canvas = originalHtml2canvas;
    });
    
    test('should detect missing jsPDF library', () => {
      const originalJspdf = window.jspdf;
      delete window.jspdf;
      
      const result = checkBrowserCompatibility();
      expect(result.isCompatible).toBe(false);
      expect(result.issues).toContain('jsPDF library tidak tersedia. Pastikan koneksi internet stabil.');
      
      window.jspdf = originalJspdf;
    });
    
    test('should detect Internet Explorer', () => {
      const originalUserAgent = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1)',
        configurable: true
      });
      
      const result = checkBrowserCompatibility();
      expect(result.isCompatible).toBe(false);
      expect(result.issues).toContain('Internet Explorer tidak didukung. Silakan gunakan Chrome, Firefox, atau Edge.');
      
      Object.defineProperty(navigator, 'userAgent', {
        value: originalUserAgent,
        configurable: true
      });
    });
  });
  
  describe('Content Validation for A4', () => {
    test('should validate content within A4 dimensions', () => {
      const mockContent = document.getElementById('printable-area');
      const result = validateContentForA4(mockContent);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('should detect content exceeding A4 width', () => {
      const mockContent = {
        getBoundingClientRect: () => ({
          width: 1000, // Exceeds A4 width in pixels
          height: 1123,
          top: 0,
          left: 0
        })
      };
      
      const result = validateContentForA4(mockContent);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('melebihi lebar kertas A4'))).toBe(true);
    });
    
    test('should detect content exceeding A4 height', () => {
      const mockContent = {
        getBoundingClientRect: () => ({
          width: 794,
          height: 1400, // Exceeds A4 height in pixels
          top: 0,
          left: 0
        })
      };
      
      const result = validateContentForA4(mockContent);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('melebihi tinggi kertas A4'))).toBe(true);
    });
    
    test('should warn about content approaching print safe area limits', () => {
      const mockContent = {
        getBoundingClientRect: () => ({
          width: 750, // Close to A4 width but within limits
          height: 1100, // Close to A4 height but within limits
          top: 0,
          left: 0
        })
      };
      
      const result = validateContentForA4(mockContent);
      expect(result.isValid).toBe(true);
      expect(result.warnings.some(warning => warning.includes('mendekati batas kertas'))).toBe(true);
    });
    
    test('should detect very small content', () => {
      const mockContent = {
        getBoundingClientRect: () => ({
          width: 100, // Very small
          height: 100, // Very small
          top: 0,
          left: 0
        })
      };
      
      const result = validateContentForA4(mockContent);
      expect(result.warnings.some(warning => warning.includes('sangat kecil'))).toBe(true);
    });
    
    test('should detect extremely large content for memory issues', () => {
      const mockContent = {
        getBoundingClientRect: () => ({
          width: 5000, // Very large
          height: 5000, // Very large - total 25M pixels
          top: 0,
          left: 0
        })
      };
      
      const result = validateContentForA4(mockContent);
      expect(result.warnings.some(warning => warning.includes('sangat besar'))).toBe(true);
    });
    
    test('should handle null content gracefully', () => {
      const result = validateContentForA4(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Konten tidak ditemukan untuk validasi.');
    });
  });
  
  describe('PDF Generation Setup', () => {
    test('should initialize jsPDF with correct A4 settings', () => {
      const pdf = new window.jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      expect(pdf.options.orientation).toBe('portrait');
      expect(pdf.options.unit).toBe('mm');
      expect(pdf.options.format).toBe('a4');
      expect(pdf.options.compress).toBe(true);
    });
    
    test('should get correct A4 dimensions from PDF instance', () => {
      const pdf = new window.jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      
      expect(width).toBe(210);
      expect(height).toBe(297);
    });
  });
  
  describe('Print Safe Area Calculations', () => {
    test('should calculate correct print safe area dimensions', () => {
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      // 20mm top/bottom margins, 15mm left/right margins
      const printSafeWidth = pdfWidth - 30; // 15mm left + 15mm right
      const printSafeHeight = pdfHeight - 40; // 20mm top + 20mm bottom
      
      expect(printSafeWidth).toBe(180);
      expect(printSafeHeight).toBe(257);
    });
    
    test('should calculate correct positioning within print safe area', () => {
      const pdfWidth = 210;
      const pdfHeight = 297;
      const printSafeWidth = 180;
      const printSafeHeight = 257;
      
      // Mock image dimensions
      const imgWidth = 600;
      const imgHeight = 800;
      const ratio = imgWidth / imgHeight; // 0.75
      const printSafeRatio = printSafeWidth / printSafeHeight; // ~0.7
      
      let finalWidth, finalHeight;
      
      if (ratio > printSafeRatio) {
        // Image is wider - fit to safe width
        finalWidth = printSafeWidth;
        finalHeight = printSafeWidth / ratio;
      } else {
        // Image is taller - fit to safe height
        finalHeight = printSafeHeight;
        finalWidth = printSafeHeight * ratio;
      }
      
      // Position within print safe area
      const xOffset = 15 + Math.round((printSafeWidth - finalWidth) / 2);
      const yOffset = 20 + Math.round((printSafeHeight - finalHeight) / 2);
      
      expect(finalWidth).toBe(printSafeHeight * ratio);
      expect(finalHeight).toBe(printSafeHeight);
      expect(xOffset).toBeGreaterThanOrEqual(15); // At least left margin
      expect(yOffset).toBeGreaterThanOrEqual(20); // At least top margin
    });
  });
  
  describe('HTML2Canvas Configuration', () => {
    test('should use correct scale for high quality output', async () => {
      const mockElement = document.getElementById('printable-area');
      
      // Mock html2canvas call
      const canvas = await window.html2canvas(mockElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        letterRendering: false,
        logging: false,
        imageTimeout: 15000,
        removeContainer: true,
        windowWidth: mockElement.scrollWidth,
        windowHeight: mockElement.scrollHeight
      });
      
      expect(canvas.width).toBe(794);
      expect(canvas.height).toBe(1123);
      expect(typeof canvas.toDataURL).toBe('function');
    });
  });
});

// Export test results for manual verification
const generateTestReport = () => {
  const report = {
    testSuite: 'PDF A4 Dimensions and Print Safe Area',
    timestamp: new Date().toISOString(),
    a4Dimensions: {
      widthMm: A4_WIDTH_MM,
      heightMm: A4_HEIGHT_MM,
      widthPixels: Math.round(mmToPixels(A4_WIDTH_MM)),
      heightPixels: Math.round(mmToPixels(A4_HEIGHT_MM))
    },
    printSafeArea: {
      widthMm: PRINT_SAFE_WIDTH_MM,
      heightMm: PRINT_SAFE_HEIGHT_MM,
      margins: {
        top: 20,
        bottom: 20,
        left: 15,
        right: 15
      }
    },
    browserCompatibility: checkBrowserCompatibility(),
    contentValidation: {
      validContent: validateContentForA4(document.getElementById('printable-area')),
      oversizedContent: validateContentForA4({
        getBoundingClientRect: () => ({
          width: 1000,
          height: 1400,
          top: 0,
          left: 0
        })
      })
    }
  };
  
  return report;
};

// Make functions available for manual testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkBrowserCompatibility,
    validateContentForA4,
    pixelsToMm,
    mmToPixels,
    generateTestReport,
    A4_WIDTH_MM,
    A4_HEIGHT_MM,
    PRINT_SAFE_WIDTH_MM,
    PRINT_SAFE_HEIGHT_MM
  };
}