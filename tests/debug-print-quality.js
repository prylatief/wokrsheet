// Debug the failing print quality tests

// Test the tracing font size issue
function analyzeFontReadability(fontSize, fontFamily, lineHeight, contentType = 'body') {
  const FONT_SIZE_RECOMMENDATIONS = {
    body: { min: 12, max: 16, optimal: 14 },
    title: { min: 18, max: 32, optimal: 24 },
    exerciseTitle: { min: 14, max: 20, optimal: 16 },
    smallText: { min: 10, max: 14, optimal: 12 },
    largeDisplay: { min: 24, max: 48, optimal: 36 },
    tracing: { min: 32, max: 72, optimal: 48 }
  };
  
  const recommendations = FONT_SIZE_RECOMMENDATIONS[contentType] || FONT_SIZE_RECOMMENDATIONS.body;
  
  return {
    sizeAppropriate: fontSize >= recommendations.min && fontSize <= recommendations.max,
    sizeOptimal: Math.abs(fontSize - recommendations.optimal) <= 2,
    lineHeightGood: lineHeight >= 1.2 && lineHeight <= 1.8,
    lineHeightOptimal: Math.abs(lineHeight - 1.4) <= 0.2,
    fontFamily: fontFamily,
    recommendations: recommendations
  };
}

// Test tracing font
const tracingAnalysis = analyzeFontReadability(48, 'Arial', 1.0, 'tracing');
console.log('Tracing analysis:', tracingAnalysis);
console.log('Line height good:', tracingAnalysis.lineHeightGood);
console.log('Line height value:', 1.0);
console.log('Line height range:', '1.2 to 1.8');

// Test DPI calculation
function analyzePrintResolution(scale, canvasWidth, canvasHeight) {
  const A4_WIDTH_MM = 210;
  const a4WidthPixels = (A4_WIDTH_MM * 96) / 25.4; // 794 pixels at 96 DPI
  const effectiveDPI = (canvasWidth / a4WidthPixels) * 96 * scale;
  
  console.log('Canvas width:', canvasWidth);
  console.log('A4 width pixels:', a4WidthPixels);
  console.log('Scale:', scale);
  console.log('Effective DPI:', effectiveDPI);
  console.log('Is high quality (>=300):', effectiveDPI >= 300);
  
  return {
    effectiveDPI: effectiveDPI,
    isHighQuality: effectiveDPI >= 300
  };
}

console.log('\nDPI Analysis:');
analyzePrintResolution(2, 794, 1123);

// Test readability score
function calculateReadabilityScore(fontSize, lineHeight, recommendations) {
  let score = 100;
  
  console.log('Starting score:', score);
  console.log('Font size:', fontSize, 'Recommendations:', recommendations);
  
  // Penalize if font size is too small or too large
  if (fontSize < recommendations.min) {
    const penalty = (recommendations.min - fontSize) * 5;
    score -= penalty;
    console.log('Too small penalty:', penalty);
  } else if (fontSize > recommendations.max) {
    const penalty = (fontSize - recommendations.max) * 2;
    score -= penalty;
    console.log('Too large penalty:', penalty);
  }
  
  console.log('After font size penalties:', score);
  
  // Penalize poor line height
  if (lineHeight < 1.2) {
    const penalty = (1.2 - lineHeight) * 20;
    score -= penalty;
    console.log('Line height too tight penalty:', penalty);
  } else if (lineHeight > 1.8) {
    const penalty = (lineHeight - 1.8) * 10;
    score -= penalty;
    console.log('Line height too loose penalty:', penalty);
  }
  
  console.log('Final score:', score);
  return Math.max(0, Math.min(100, score));
}

console.log('\nReadability Score Analysis:');
const poorScore = calculateReadabilityScore(8, 1.0, { min: 12, max: 16, optimal: 14 });
console.log('Poor settings score:', poorScore);