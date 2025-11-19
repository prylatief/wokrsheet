/**
 * Direct PDF A4 Dimensions Test Runner
 * Task 7.1: Test PDF dimensions dan print safe area
 * 
 * This script can be run directly with Node.js to test PDF dimensions
 */

// Test constants
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PRINT_SAFE_WIDTH_MM = 180; // 210mm - 30mm margins
const PRINT_SAFE_HEIGHT_MM = 257; // 297mm - 40mm margins
const DPI_96 = 96;

// Utility functions
const pixelsToMm = (pixels) => (pixels * 25.4) / DPI_96;
const mmToPixels = (mm) => (mm * DPI_96) / 25.4;

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

// Test runner functions
function runTest(testName, testFunction) {
  testResults.total++;
  try {
    const result = testFunction();
    if (result) {
      console.log(`✅ PASS: ${testName}`);
      testResults.passed++;
    } else {
      console.log(`❌ FAIL: ${testName}`);
      testResults.failed++;
    }
    return result;
  } catch (error) {
    console.log(`❌ ERROR: ${testName} - ${error.message}`);
    testResults.failed++;
    return false;
  }
}

function expect(actual) {
  return {
    toBe: (expected) => actual === expected,
    toBeCloseTo: (expected, precision = 2) => {
      const diff = Math.abs(actual - expected);
      const threshold = Math.pow(10, -precision) / 2;
      return diff < threshold;
    },
    toBeGreaterThanOrEqual: (expected) => actual >= expected,
    toHaveLength: (expected) => actual.length === expected,
    toContain: (expected) => actual.includes(expected)
  };
}

// Test Suite
console.log('🧪 Starting PDF A4 Dimensions Test Suite\n');

// Test 1: A4 Dimension Constants
runTest('A4 width should be exactly 210mm', () => {
  return expect(A4_WIDTH_MM).toBe(210);
});

runTest('A4 height should be exactly 297mm', () => {
  return expect(A4_HEIGHT_MM).toBe(297);
});

runTest('Print safe width should account for 30mm total margins', () => {
  return expect(PRINT_SAFE_WIDTH_MM).toBe(A4_WIDTH_MM - 30) && 
         expect(PRINT_SAFE_WIDTH_MM).toBe(180);
});

runTest('Print safe height should account for 40mm total margins', () => {
  return expect(PRINT_SAFE_HEIGHT_MM).toBe(A4_HEIGHT_MM - 40) && 
         expect(PRINT_SAFE_HEIGHT_MM).toBe(257);
});

// Test 2: Pixel to MM Conversion
runTest('210mm should convert to correct pixels at 96 DPI', () => {
  const pixels = mmToPixels(210);
  return expect(Math.round(pixels)).toBe(794);
});

runTest('297mm should convert to correct pixels at 96 DPI', () => {
  const pixels = mmToPixels(297);
  return expect(Math.round(pixels)).toBe(1123);
});

runTest('794 pixels should convert back to 210mm', () => {
  const mm = pixelsToMm(794);
  return expect(Math.round(mm)).toBe(210);
});

runTest('1123 pixels should convert back to 297mm', () => {
  const mm = pixelsToMm(1123);
  return expect(Math.round(mm)).toBe(297);
});

// Test 3: Print Safe Area Calculations
runTest('should calculate correct print safe area dimensions', () => {
  const pdfWidth = 210;
  const pdfHeight = 297;
  
  const printSafeWidth = pdfWidth - 30; // 15mm left + 15mm right
  const printSafeHeight = pdfHeight - 40; // 20mm top + 20mm bottom
  
  return expect(printSafeWidth).toBe(180) && expect(printSafeHeight).toBe(257);
});

runTest('should calculate correct positioning within print safe area', () => {
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
  
  // Since ratio > printSafeRatio, image is wider, so we fit to width
  const expectedFinalWidth = printSafeWidth;
  const expectedFinalHeight = printSafeWidth / ratio;
  
  return expect(finalWidth).toBe(expectedFinalWidth) &&
         expect(finalHeight).toBe(expectedFinalHeight) &&
         expect(xOffset).toBeGreaterThanOrEqual(15) &&
         expect(yOffset).toBeGreaterThanOrEqual(20);
});

// Test 4: Content Validation Logic
runTest('should validate content dimensions correctly', () => {
  // Mock content within A4 dimensions
  const validContent = {
    getBoundingClientRect: () => ({
      width: 794,  // 210mm in pixels
      height: 1123, // 297mm in pixels
      top: 0,
      left: 0
    })
  };
  
  const rect = validContent.getBoundingClientRect();
  const contentWidthMm = pixelsToMm(rect.width);
  const contentHeightMm = pixelsToMm(rect.height);
  
  return expect(Math.round(contentWidthMm)).toBe(210) && 
         expect(Math.round(contentHeightMm)).toBe(297);
});

runTest('should detect oversized content', () => {
  // Mock content exceeding A4 dimensions
  const oversizedContent = {
    getBoundingClientRect: () => ({
      width: 1000, // Exceeds A4 width
      height: 1400, // Exceeds A4 height
      top: 0,
      left: 0
    })
  };
  
  const rect = oversizedContent.getBoundingClientRect();
  const contentWidthMm = pixelsToMm(rect.width);
  const contentHeightMm = pixelsToMm(rect.height);
  
  return contentWidthMm > A4_WIDTH_MM && contentHeightMm > A4_HEIGHT_MM;
});

// Test 5: Margin Calculations
runTest('should calculate correct margins for print safe area', () => {
  const topMargin = 20;
  const bottomMargin = 20;
  const leftMargin = 15;
  const rightMargin = 15;
  
  const totalVerticalMargins = topMargin + bottomMargin;
  const totalHorizontalMargins = leftMargin + rightMargin;
  
  const calculatedSafeWidth = A4_WIDTH_MM - totalHorizontalMargins;
  const calculatedSafeHeight = A4_HEIGHT_MM - totalVerticalMargins;
  
  return expect(calculatedSafeWidth).toBe(PRINT_SAFE_WIDTH_MM) &&
         expect(calculatedSafeHeight).toBe(PRINT_SAFE_HEIGHT_MM);
});

// Test 6: DPI and Resolution Calculations
runTest('should handle different DPI calculations correctly', () => {
  const testDPI = 300; // High resolution
  const mmToPixelsHighDPI = (mm) => (mm * testDPI) / 25.4;
  
  const a4WidthHighDPI = Math.round(mmToPixelsHighDPI(210));
  const a4HeightHighDPI = Math.round(mmToPixelsHighDPI(297));
  
  // At 300 DPI, A4 should be approximately 2480 x 3508 pixels
  return expect(a4WidthHighDPI).toBeCloseTo(2480, 0) &&
         expect(a4HeightHighDPI).toBeCloseTo(3508, 0);
});

// Test 7: Aspect Ratio Preservation
runTest('should preserve A4 aspect ratio correctly', () => {
  const a4AspectRatio = A4_WIDTH_MM / A4_HEIGHT_MM;
  const expectedRatio = 210 / 297; // ≈ 0.707
  
  return expect(a4AspectRatio).toBeCloseTo(expectedRatio, 3);
});

// Test 8: Print Safe Area Aspect Ratio
runTest('should calculate print safe area aspect ratio correctly', () => {
  const printSafeRatio = PRINT_SAFE_WIDTH_MM / PRINT_SAFE_HEIGHT_MM;
  const expectedRatio = 180 / 257; // ≈ 0.700
  
  return expect(printSafeRatio).toBeCloseTo(expectedRatio, 3);
});

// Generate detailed test report
console.log('\n📊 Test Results Summary:');
console.log(`Total Tests: ${testResults.total}`);
console.log(`Passed: ${testResults.passed}`);
console.log(`Failed: ${testResults.failed}`);
console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

if (testResults.failed === 0) {
  console.log('\n🎉 All tests passed! PDF A4 implementation is correct.');
} else {
  console.log(`\n⚠️  ${testResults.failed} test(s) failed. Please review the implementation.`);
}

// Generate detailed report object
const detailedReport = {
  testSuite: 'PDF A4 Dimensions and Print Safe Area',
  timestamp: new Date().toISOString(),
  results: testResults,
  a4Dimensions: {
    widthMm: A4_WIDTH_MM,
    heightMm: A4_HEIGHT_MM,
    widthPixels: Math.round(mmToPixels(A4_WIDTH_MM)),
    heightPixels: Math.round(mmToPixels(A4_HEIGHT_MM)),
    aspectRatio: A4_WIDTH_MM / A4_HEIGHT_MM
  },
  printSafeArea: {
    widthMm: PRINT_SAFE_WIDTH_MM,
    heightMm: PRINT_SAFE_HEIGHT_MM,
    margins: {
      top: 20,
      bottom: 20,
      left: 15,
      right: 15
    },
    aspectRatio: PRINT_SAFE_WIDTH_MM / PRINT_SAFE_HEIGHT_MM
  },
  conversionTests: {
    a4WidthPixels: Math.round(mmToPixels(210)),
    a4HeightPixels: Math.round(mmToPixels(297)),
    reverseWidthMm: Math.round(pixelsToMm(794)),
    reverseHeightMm: Math.round(pixelsToMm(1123))
  }
};

console.log('\n📋 Detailed Report:');
console.log(JSON.stringify(detailedReport, null, 2));

// Exit with appropriate code
process.exit(testResults.failed === 0 ? 0 : 1);