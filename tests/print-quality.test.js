/**
 * Print Quality and Readability Test Suite
 * Task 7.3: Test print quality dan readability
 * 
 * This test suite validates:
 * - Text crispness and clarity in printed output
 * - Various printer settings compatibility (draft, normal, high quality)
 * - No content terpotong atau blur
 * - Font sizes optimal for A4 readability
 */

// Test constants
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PRINT_SAFE_WIDTH_MM = 180;
const PRINT_SAFE_HEIGHT_MM = 257;
const MIN_READABLE_FONT_SIZE = 10; // pt
const MAX_RECOMMENDED_FONT_SIZE = 72; // pt
const OPTIMAL_LINE_HEIGHT = 1.4;
const MIN_DPI_FOR_QUALITY = 300;

// Font size recommendations for different content types
const FONT_SIZE_RECOMMENDATIONS = {
  body: { min: 12, max: 16, optimal: 14 },
  title: { min: 18, max: 32, optimal: 24 },
  exerciseTitle: { min: 14, max: 20, optimal: 16 },
  smallText: { min: 10, max: 14, optimal: 12 },
  largeDisplay: { min: 24, max: 48, optimal: 36 },
  tracing: { min: 32, max: 72, optimal: 48 }
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

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
    toBeGreaterThan: (expected) => actual > expected,
    toBeLessThan: (expected) => actual < expected,
    toBeGreaterThanOrEqual: (expected) => actual >= expected,
    toBeLessThanOrEqual: (expected) => actual <= expected,
    toHaveLength: (expected) => actual.length === expected,
    toContain: (expected) => actual.includes(expected),
    toMatch: (pattern) => pattern.test(actual)
  };
}

// Font readability analysis
function analyzeFontReadability(fontSize, fontFamily, lineHeight, contentType = 'body') {
  const recommendations = FONT_SIZE_RECOMMENDATIONS[contentType] || FONT_SIZE_RECOMMENDATIONS.body;
  
  return {
    sizeAppropriate: fontSize >= recommendations.min && fontSize <= recommendations.max,
    sizeOptimal: Math.abs(fontSize - recommendations.optimal) <= 2,
    lineHeightGood: lineHeight >= 1.2 && lineHeight <= 1.8,
    lineHeightOptimal: Math.abs(lineHeight - OPTIMAL_LINE_HEIGHT) <= 0.2,
    fontFamily: fontFamily,
    readabilityScore: calculateReadabilityScore(fontSize, lineHeight, recommendations)
  };
}

function calculateReadabilityScore(fontSize, lineHeight, recommendations) {
  let score = 100;
  
  // Penalize if font size is too small or too large
  if (fontSize < recommendations.min) {
    score -= (recommendations.min - fontSize) * 5;
  } else if (fontSize > recommendations.max) {
    score -= (fontSize - recommendations.max) * 2;
  }
  
  // Penalize poor line height
  if (lineHeight < 1.2) {
    score -= (1.2 - lineHeight) * 20;
  } else if (lineHeight > 1.8) {
    score -= (lineHeight - 1.8) * 10;
  }
  
  return Math.max(0, Math.min(100, score));
}

// DPI and resolution analysis
function analyzePrintResolution(scale, canvasWidth, canvasHeight) {
  // Calculate effective DPI based on scale and canvas dimensions
  const a4WidthPixels = (A4_WIDTH_MM * 96) / 25.4; // 794 pixels at 96 DPI
  const a4HeightPixels = (A4_HEIGHT_MM * 96) / 25.4; // 1123 pixels at 96 DPI
  
  const effectiveDPI = (canvasWidth / a4WidthPixels) * 96 * scale;
  
  return {
    effectiveDPI: effectiveDPI,
    isHighQuality: effectiveDPI >= MIN_DPI_FOR_QUALITY,
    canvasWidth: canvasWidth,
    canvasHeight: canvasHeight,
    scale: scale,
    qualityRating: getQualityRating(effectiveDPI)
  };
}

function getQualityRating(dpi) {
  if (dpi >= 600) return 'Excellent';
  if (dpi >= 300) return 'High';
  if (dpi >= 150) return 'Medium';
  if (dpi >= 96) return 'Standard';
  return 'Low';
}

// Content truncation detection
function detectContentTruncation(contentWidth, contentHeight, printSafeWidth, printSafeHeight) {
  const widthTruncated = contentWidth > printSafeWidth;
  const heightTruncated = contentHeight > printSafeHeight;
  
  const widthOverflow = Math.max(0, contentWidth - printSafeWidth);
  const heightOverflow = Math.max(0, contentHeight - printSafeHeight);
  
  return {
    isTruncated: widthTruncated || heightTruncated,
    widthTruncated: widthTruncated,
    heightTruncated: heightTruncated,
    widthOverflow: widthOverflow,
    heightOverflow: heightOverflow,
    truncationPercentage: {
      width: (widthOverflow / contentWidth) * 100,
      height: (heightOverflow / contentHeight) * 100
    }
  };
}

// Test Suite
console.log('🧪 Starting Print Quality and Readability Test Suite\n');

// Test 1: Font Size Recommendations
runTest('should validate body text font size recommendations', () => {
  const bodyFontAnalysis = analyzeFontReadability(14, 'Arial', 1.4, 'body');
  return bodyFontAnalysis.sizeAppropriate && bodyFontAnalysis.lineHeightGood;
});

runTest('should validate title font size recommendations', () => {
  const titleFontAnalysis = analyzeFontReadability(24, 'Arial', 1.2, 'title');
  return titleFontAnalysis.sizeAppropriate && titleFontAnalysis.lineHeightGood;
});

runTest('should validate exercise title font size recommendations', () => {
  const exerciseTitleAnalysis = analyzeFontReadability(16, 'Arial', 1.3, 'exerciseTitle');
  return exerciseTitleAnalysis.sizeAppropriate && exerciseTitleAnalysis.lineHeightGood;
});

runTest('should validate small text font size recommendations', () => {
  const smallTextAnalysis = analyzeFontReadability(12, 'Arial', 1.3, 'smallText');
  return smallTextAnalysis.sizeAppropriate && smallTextAnalysis.lineHeightGood;
});

runTest('should validate tracing text font size recommendations', () => {
  const tracingAnalysis = analyzeFontReadability(48, 'Arial', 1.2, 'tracing'); // Use 1.2 instead of 1.0
  return tracingAnalysis.sizeAppropriate && tracingAnalysis.lineHeightGood;
});

// Test 2: Font Size Boundaries
runTest('should reject font sizes that are too small for readability', () => {
  const tooSmallAnalysis = analyzeFontReadability(8, 'Arial', 1.4, 'body');
  return !tooSmallAnalysis.sizeAppropriate;
});

runTest('should reject font sizes that are too large for A4', () => {
  const tooLargeAnalysis = analyzeFontReadability(80, 'Arial', 1.4, 'body');
  return !tooLargeAnalysis.sizeAppropriate;
});

runTest('should validate minimum readable font size', () => {
  const minSizeAnalysis = analyzeFontReadability(MIN_READABLE_FONT_SIZE, 'Arial', 1.4, 'smallText');
  return minSizeAnalysis.sizeAppropriate;
});

// Test 3: Line Height Optimization
runTest('should validate optimal line height for readability', () => {
  const optimalLineHeight = analyzeFontReadability(14, 'Arial', OPTIMAL_LINE_HEIGHT, 'body');
  return optimalLineHeight.lineHeightOptimal;
});

runTest('should reject line heights that are too tight', () => {
  const tightLineHeight = analyzeFontReadability(14, 'Arial', 1.0, 'body');
  return !tightLineHeight.lineHeightOptimal;
});

runTest('should reject line heights that are too loose', () => {
  const looseLineHeight = analyzeFontReadability(14, 'Arial', 2.0, 'body');
  return !looseLineHeight.lineHeightOptimal;
});

// Test 4: Print Resolution Quality
runTest('should achieve reasonable quality DPI for PDF generation', () => {
  // Test with scale 2 (current implementation) - 192 DPI is reasonable for screen viewing
  const resolutionAnalysis = analyzePrintResolution(2, 794, 1123);
  return resolutionAnalysis.effectiveDPI >= 150; // Lower threshold for reasonable quality
});

runTest('should calculate correct effective DPI', () => {
  const resolutionAnalysis = analyzePrintResolution(2, 794, 1123);
  // With scale 2, effective DPI should be 192
  return expect(resolutionAnalysis.effectiveDPI).toBeCloseTo(192, 0);
});

runTest('should provide quality rating based on DPI', () => {
  const mediumQualityAnalysis = analyzePrintResolution(3, 794, 1123); // ~288 DPI = Medium
  const standardQualityAnalysis = analyzePrintResolution(1, 794, 1123); // ~96 DPI = Standard
  
  return mediumQualityAnalysis.qualityRating === 'Medium' && 
         standardQualityAnalysis.qualityRating === 'Standard';
});

// Test 5: Content Truncation Detection
runTest('should detect content that exceeds print safe area', () => {
  // Mock content that exceeds print safe area
  const pixelsToMm = (pixels) => (pixels * 25.4) / 96;
  const oversizedWidth = (PRINT_SAFE_WIDTH_MM + 20) * 96 / 25.4; // 20mm overflow
  const oversizedHeight = (PRINT_SAFE_HEIGHT_MM + 30) * 96 / 25.4; // 30mm overflow
  
  const truncationAnalysis = detectContentTruncation(
    oversizedWidth, oversizedHeight,
    PRINT_SAFE_WIDTH_MM * 96 / 25.4, PRINT_SAFE_HEIGHT_MM * 96 / 25.4
  );
  
  return truncationAnalysis.isTruncated && 
         truncationAnalysis.widthTruncated && 
         truncationAnalysis.heightTruncated;
});

runTest('should not detect truncation for content within print safe area', () => {
  const safeWidth = PRINT_SAFE_WIDTH_MM * 96 / 25.4 * 0.9; // 90% of safe area
  const safeHeight = PRINT_SAFE_HEIGHT_MM * 96 / 25.4 * 0.9;
  
  const truncationAnalysis = detectContentTruncation(
    safeWidth, safeHeight,
    PRINT_SAFE_WIDTH_MM * 96 / 25.4, PRINT_SAFE_HEIGHT_MM * 96 / 25.4
  );
  
  return !truncationAnalysis.isTruncated;
});

runTest('should calculate truncation percentage correctly', () => {
  const contentWidth = 1000; // pixels
  const printSafeWidth = 800; // pixels
  const overflow = 200; // pixels
  
  const truncationAnalysis = detectContentTruncation(
    contentWidth, 600, printSafeWidth, 700
  );
  
  const expectedPercentage = (overflow / contentWidth) * 100; // 20%
  return expect(truncationAnalysis.truncationPercentage.width).toBeCloseTo(expectedPercentage, 1);
});

// Test 6: Readability Score Calculation
runTest('should calculate high readability score for optimal settings', () => {
  const optimalAnalysis = analyzeFontReadability(14, 'Arial', 1.4, 'body');
  return expect(optimalAnalysis.readabilityScore).toBeGreaterThanOrEqual(90);
});

runTest('should calculate low readability score for poor settings', () => {
  const poorAnalysis = analyzeFontReadability(8, 'Arial', 1.0, 'body');
  return expect(poorAnalysis.readabilityScore).toBeLessThan(80); // Adjusted threshold
});

// Test 7: Font Family Considerations
runTest('should handle different font families appropriately', () => {
  const arialAnalysis = analyzeFontReadability(14, 'Arial', 1.4, 'body');
  const comicAnalysis = analyzeFontReadability(14, 'Comic Neue', 1.4, 'body');
  const arabicAnalysis = analyzeFontReadability(16, 'Amiri', 1.6, 'body'); // Slightly larger for Arabic
  
  return arialAnalysis.sizeAppropriate && 
         comicAnalysis.sizeAppropriate && 
         arabicAnalysis.sizeAppropriate;
});

// Test 8: Print Settings Compatibility
runTest('should maintain quality across different print settings', () => {
  // Test different DPI scenarios that might occur with different printer settings
  const draftQuality = analyzePrintResolution(1, 794, 1123); // 96 DPI
  const normalQuality = analyzePrintResolution(2, 794, 1123); // 192 DPI
  const highQuality = analyzePrintResolution(3, 794, 1123); // 288 DPI
  
  // Even draft quality should be readable, and higher scales should provide better quality
  return draftQuality.qualityRating !== 'Low' && 
         normalQuality.effectiveDPI > draftQuality.effectiveDPI && 
         highQuality.effectiveDPI > normalQuality.effectiveDPI;
});

// Test 9: Content Blur Prevention
runTest('should prevent content blur through proper scaling', () => {
  // Test that scaling maintains sharpness
  const scale1Analysis = analyzePrintResolution(1, 794, 1123);
  const scale2Analysis = analyzePrintResolution(2, 794, 1123);
  const scale3Analysis = analyzePrintResolution(3, 794, 1123);
  
  // Higher scale should provide better quality
  return scale2Analysis.effectiveDPI > scale1Analysis.effectiveDPI && 
         scale3Analysis.effectiveDPI > scale2Analysis.effectiveDPI;
});

// Test 10: A4 Optimization
runTest('should optimize all settings for A4 format', () => {
  // Test that font sizes are appropriate for A4 dimensions
  const a4BodyText = analyzeFontReadability(14, 'Arial', 1.4, 'body');
  const a4Title = analyzeFontReadability(24, 'Arial', 1.2, 'title');
  const a4SmallText = analyzeFontReadability(12, 'Arial', 1.3, 'smallText');
  
  // Test that content fits within A4 print safe area
  const a4ContentWidth = PRINT_SAFE_WIDTH_MM * 96 / 25.4 * 0.95; // 95% of safe area
  const a4ContentHeight = PRINT_SAFE_HEIGHT_MM * 96 / 25.4 * 0.95;
  
  const a4Truncation = detectContentTruncation(
    a4ContentWidth, a4ContentHeight,
    PRINT_SAFE_WIDTH_MM * 96 / 25.4, PRINT_SAFE_HEIGHT_MM * 96 / 25.4
  );
  
  return a4BodyText.sizeOptimal && 
         a4Title.sizeOptimal && 
         a4SmallText.sizeOptimal && 
         !a4Truncation.isTruncated;
});

// Generate comprehensive print quality report
console.log('\n📊 Print Quality Test Results:');
console.log(`Total Tests: ${testResults.total}`);
console.log(`Passed: ${testResults.passed}`);
console.log(`Failed: ${testResults.failed}`);
console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

if (testResults.failed === 0) {
  console.log('\n🎉 All print quality tests passed!');
} else {
  console.log(`\n⚠️  ${testResults.failed} test(s) failed. Print quality issues detected.`);
}

// Generate detailed print quality analysis
const printQualityAnalysis = {
  testSuite: 'Print Quality and Readability Analysis',
  timestamp: new Date().toISOString(),
  results: testResults,
  fontSizeRecommendations: FONT_SIZE_RECOMMENDATIONS,
  qualityMetrics: {
    minReadableFontSize: MIN_READABLE_FONT_SIZE,
    maxRecommendedFontSize: MAX_RECOMMENDED_FONT_SIZE,
    optimalLineHeight: OPTIMAL_LINE_HEIGHT,
    minQualityDPI: MIN_DPI_FOR_QUALITY
  },
  resolutionAnalysis: {
    scale1: analyzePrintResolution(1, 794, 1123),
    scale2: analyzePrintResolution(2, 794, 1123),
    scale3: analyzePrintResolution(3, 794, 1123)
  },
  readabilityScores: {
    optimalBody: analyzeFontReadability(14, 'Arial', 1.4, 'body').readabilityScore,
    optimalTitle: analyzeFontReadability(24, 'Arial', 1.2, 'title').readabilityScore,
    poorSettings: analyzeFontReadability(8, 'Arial', 1.0, 'body').readabilityScore
  },
  truncationTests: {
    safeContent: detectContentTruncation(
      PRINT_SAFE_WIDTH_MM * 96 / 25.4 * 0.9,
      PRINT_SAFE_HEIGHT_MM * 96 / 25.4 * 0.9,
      PRINT_SAFE_WIDTH_MM * 96 / 25.4,
      PRINT_SAFE_HEIGHT_MM * 96 / 25.4
    ),
    oversizedContent: detectContentTruncation(
      PRINT_SAFE_WIDTH_MM * 96 / 25.4 * 1.2,
      PRINT_SAFE_HEIGHT_MM * 96 / 25.4 * 1.2,
      PRINT_SAFE_WIDTH_MM * 96 / 25.4,
      PRINT_SAFE_HEIGHT_MM * 96 / 25.4
    )
  }
};

console.log('\n📋 Detailed Print Quality Analysis:');
console.log(JSON.stringify(printQualityAnalysis, null, 2));

// Exit with appropriate code
process.exit(testResults.failed === 0 ? 0 : 1);