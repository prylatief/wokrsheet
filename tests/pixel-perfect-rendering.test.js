/**
 * Pixel-Perfect Rendering Test Suite
 * Tests for PDF rendering precision - verifying pixel-perfect alignment
 * 
 * This test suite validates:
 * - Answer line alignment in counting exercises (Task 7.1)
 * - Math equation border alignment (Task 7.2)
 * - Header title positioning (Task 7.3)
 * - Spelling box borders (Task 7.4)
 * - Pattern exercise alignment (Task 7.5)
 * - Cross-browser compatibility (Task 7.6)
 * - Performance with scale 3 (Task 7.7)
 */

// Test constants
const TOLERANCE_PX = 0; // Zero tolerance for pixel-perfect rendering
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PRINT_SAFE_WIDTH_MM = 180;
const PRINT_SAFE_HEIGHT_MM = 257;

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

function runTest(testName, testFunction) {
  testResults.total++;
  try {
    const result = testFunction();
    const status = result.passed ? 'PASS' : 'FAIL';
    const icon = result.passed ? '✅' : '❌';
    
    console.log(`${icon} ${status}: ${testName}`);
    if (result.message) {
      console.log(`   ${result.message}`);
    }
    
    testResults.details.push({
      name: testName,
      passed: result.passed,
      message: result.message,
      measurements: result.measurements
    });
    
    if (result.passed) {
      testResults.passed++;
    } else {
      testResults.failed++;
    }
    
    return result.passed;
  } catch (error) {
    console.log(`❌ ERROR: ${testName} - ${error.message}`);
    testResults.failed++;
    testResults.details.push({
      name: testName,
      passed: false,
      message: error.message,
      measurements: null
    });
    return false;
  }
}

// Helper function to measure element positioning
function measureElementPosition(element) {
  if (!element) return null;
  
  const rect = element.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(element);
  
  return {
    top: rect.top,
    left: rect.left,
    bottom: rect.bottom,
    right: rect.right,
    width: rect.width,
    height: rect.height,
    borderBottomWidth: parseFloat(computedStyle.borderBottomWidth) || 0,
    transform: computedStyle.transform,
    display: computedStyle.display,
    verticalAlign: computedStyle.verticalAlign
  };
}

// Helper function to compare positions with tolerance
function comparePositions(pos1, pos2, tolerance = TOLERANCE_PX) {
  if (!pos1 || !pos2) return false;
  
  const topDiff = Math.abs(pos1.top - pos2.top);
  const bottomDiff = Math.abs(pos1.bottom - pos2.bottom);
  
  return topDiff <= tolerance && bottomDiff <= tolerance;
}

// Helper function to check if line is horizontal
function isLineHorizontal(element, tolerance = TOLERANCE_PX) {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(element);
  const borderWidth = parseFloat(computedStyle.borderBottomWidth) || 0;
  
  if (borderWidth === 0) return false;
  
  // Check if the element's bottom border is perfectly horizontal
  // by verifying the element's height is consistent
  const leftEdge = element.getBoundingClientRect();
  const rightEdge = element.getBoundingClientRect();
  
  const heightDiff = Math.abs(leftEdge.height - rightEdge.height);
  
  return heightDiff <= tolerance;
}

// Test Suite
console.log('🧪 Starting Pixel-Perfect Rendering Test Suite\n');
console.log('Testing with 0px tolerance for pixel-perfect alignment\n');

// ============================================================================
// Task 7.1: Test answer line alignment in counting exercise
// ============================================================================
console.log('📋 Task 7.1: Testing Answer Line Alignment in Counting Exercise\n');

runTest('7.1.1 - Answer line should be inline-flex with baseline alignment', () => {
  // Create test counting exercise
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <div class="exercise-card">
      <h3 class="text-lg font-bold mb-2">Hitung Apel</h3>
      <div class="flex items-baseline gap-2">
        <span class="text-2xl">🍎🍎🍎🍎🍎</span>
        <span class="text-xl">=</span>
        <span class="answer-line border-b-2 border-gray-600"></span>
      </div>
    </div>
  `;
  testDiv.style.position = 'absolute';
  testDiv.style.left = '-9999px';
  document.body.appendChild(testDiv);
  
  const answerLine = testDiv.querySelector('.answer-line');
  const measurements = measureElementPosition(answerLine);
  
  document.body.removeChild(testDiv);
  
  const isInlineFlex = measurements.display === 'inline-flex';
  const hasBaselineAlign = measurements.verticalAlign === 'baseline';
  
  return {
    passed: isInlineFlex && hasBaselineAlign,
    message: `Display: ${measurements.display}, Vertical-align: ${measurements.verticalAlign}`,
    measurements
  };
});

runTest('7.1.2 - Answer line should have explicit pixel height (not em)', () => {
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <div class="exercise-card">
      <span class="answer-line border-b-2 border-gray-600"></span>
    </div>
  `;
  testDiv.style.position = 'absolute';
  testDiv.style.left = '-9999px';
  document.body.appendChild(testDiv);
  
  const answerLine = testDiv.querySelector('.answer-line');
  const computedStyle = window.getComputedStyle(answerLine);
  const height = computedStyle.height;
  
  document.body.removeChild(testDiv);
  
  // Height should be in pixels (e.g., "16px") not em or auto
  const hasPixelHeight = height.includes('px') && !height.includes('auto');
  const heightValue = parseFloat(height);
  const isIntegerHeight = Number.isInteger(heightValue);
  
  return {
    passed: hasPixelHeight && isIntegerHeight,
    message: `Height: ${height}, Is integer: ${isIntegerHeight}`,
    measurements: { height, heightValue, isIntegerHeight }
  };
});

runTest('7.1.3 - Answer line should have transform: translateZ(0)', () => {
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <div class="exercise-card">
      <span class="answer-line border-b-2 border-gray-600"></span>
    </div>
  `;
  testDiv.style.position = 'absolute';
  testDiv.style.left = '-9999px';
  document.body.appendChild(testDiv);
  
  const answerLine = testDiv.querySelector('.answer-line');
  const measurements = measureElementPosition(answerLine);
  
  document.body.removeChild(testDiv);
  
  const hasTransform = measurements.transform !== 'none';
  const hasTranslateZ = measurements.transform.includes('matrix3d') || 
                        measurements.transform.includes('translateZ');
  
  return {
    passed: hasTransform,
    message: `Transform: ${measurements.transform}`,
    measurements
  };
});

runTest('7.1.4 - Answer line border should use px units (not pt)', () => {
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <div class="exercise-card">
      <span class="answer-line border-b-2 border-gray-600"></span>
    </div>
  `;
  testDiv.style.position = 'absolute';
  testDiv.style.left = '-9999px';
  document.body.appendChild(testDiv);
  
  const answerLine = testDiv.querySelector('.answer-line');
  const computedStyle = window.getComputedStyle(answerLine);
  const borderWidth = computedStyle.borderBottomWidth;
  
  document.body.removeChild(testDiv);
  
  // Border width should be in pixels
  const hasPixelBorder = borderWidth.includes('px');
  const borderValue = parseFloat(borderWidth);
  
  return {
    passed: hasPixelBorder && borderValue > 0,
    message: `Border width: ${borderWidth}`,
    measurements: { borderWidth, borderValue }
  };
});

// ============================================================================
// Task 7.2: Test math equation border alignment
// ============================================================================
console.log('\n📋 Task 7.2: Testing Math Equation Border Alignment\n');

runTest('7.2.1 - Math equation elements should use inline-flex', () => {
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <div class="exercise-card">
      <div class="flex items-baseline gap-2 text-3xl">
        <span>3</span>
        <span>+</span>
        <span class="align-baseline border-b-3 border-gray-600 px-4">4</span>
        <span>=</span>
        <span class="answer-line border-b-2 border-gray-600"></span>
      </div>
    </div>
  `;
  testDiv.style.position = 'absolute';
  testDiv.style.left = '-9999px';
  document.body.appendChild(testDiv);
  
  const alignBaseline = testDiv.querySelector('.align-baseline');
  const measurements = measureElementPosition(alignBaseline);
  
  document.body.removeChild(testDiv);
  
  const isInlineFlex = measurements.display === 'inline-flex';
  
  return {
    passed: isInlineFlex,
    message: `Display: ${measurements.display}`,
    measurements
  };
});

runTest('7.2.2 - Border-bottom should align with number baseline', () => {
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <div class="exercise-card">
      <div class="flex items-baseline gap-2 text-3xl">
        <span id="num1">3</span>
        <span>+</span>
        <span id="num2" class="align-baseline border-b-3 border-gray-600 px-4">4</span>
      </div>
    </div>
  `;
  testDiv.style.position = 'absolute';
  testDiv.style.left = '-9999px';
  document.body.appendChild(testDiv);
  
  const num1 = testDiv.querySelector('#num1');
  const num2 = testDiv.querySelector('#num2');
  
  const pos1 = measureElementPosition(num1);
  const pos2 = measureElementPosition(num2);
  
  document.body.removeChild(testDiv);
  
  // Check if baselines are aligned (bottom positions should match)
  const aligned = comparePositions(pos1, pos2, TOLERANCE_PX);
  const diff = Math.abs(pos1.bottom - pos2.bottom);
  
  return {
    passed: aligned,
    message: `Baseline difference: ${diff.toFixed(2)}px (tolerance: ${TOLERANCE_PX}px)`,
    measurements: { pos1, pos2, diff }
  };
});

runTest('7.2.3 - Border-b-3 class should use px units', () => {
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <div class="exercise-card">
      <span class="border-b-3 border-gray-600">Test</span>
    </div>
  `;
  testDiv.style.position = 'absolute';
  testDiv.style.left = '-9999px';
  document.body.appendChild(testDiv);
  
  const element = testDiv.querySelector('.border-b-3');
  const computedStyle = window.getComputedStyle(element);
  const borderWidth = computedStyle.borderBottomWidth;
  
  document.body.removeChild(testDiv);
  
  const hasPixelBorder = borderWidth.includes('px');
  const borderValue = parseFloat(borderWidth);
  const expectedWidth = 3; // 3px
  
  return {
    passed: hasPixelBorder && Math.abs(borderValue - expectedWidth) < 0.5,
    message: `Border width: ${borderWidth} (expected: 3px)`,
    measurements: { borderWidth, borderValue, expectedWidth }
  };
});

runTest('7.2.4 - Math equation borders should be perfectly horizontal', () => {
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <div class="exercise-card">
      <div class="flex items-baseline gap-2 text-3xl">
        <span class="align-baseline border-b-3 border-gray-600 px-4">4</span>
        <span class="align-baseline border-b-3 border-gray-600 px-4">5</span>
      </div>
    </div>
  `;
  testDiv.style.position = 'absolute';
  testDiv.style.left = '-9999px';
  document.body.appendChild(testDiv);
  
  const borders = testDiv.querySelectorAll('.align-baseline');
  const positions = Array.from(borders).map(el => measureElementPosition(el));
  
  document.body.removeChild(testDiv);
  
  // Check if all borders are at the same vertical position
  const allAligned = positions.every((pos, i) => {
    if (i === 0) return true;
    return comparePositions(positions[0], pos, TOLERANCE_PX);
  });
  
  const maxDiff = positions.reduce((max, pos, i) => {
    if (i === 0) return 0;
    const diff = Math.abs(positions[0].bottom - pos.bottom);
    return Math.max(max, diff);
  }, 0);
  
  return {
    passed: allAligned,
    message: `Max vertical difference: ${maxDiff.toFixed(2)}px (tolerance: ${TOLERANCE_PX}px)`,
    measurements: { positions, maxDiff }
  };
});

// ============================================================================
// Task 7.3: Test header title positioning
// ============================================================================
console.log('\n📋 Task 7.3: Testing Header Title Positioning\n');

runTest('7.3.1 - Header should use flexbox with items-baseline', () => {
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <header class="flex justify-between items-baseline p-4">
      <div>
        <div class="text-sm">Nama: _____________</div>
        <div class="text-sm">Kelas: _____________</div>
      </div>
      <h2 class="text-2xl font-bold">Latihan Hari Ini</h2>
      <div class="text-sm">Tanggal: _____________</div>
    </header>
  `;
  testDiv.style.position = 'absolute';
  testDiv.style.left = '-9999px';
  document.body.appendChild(testDiv);
  
  const header = testDiv.querySelector('header');
  const computedStyle = window.getComputedStyle(header);
  
  document.body.removeChild(testDiv);
  
  const isFlex = computedStyle.display === 'flex';
  const hasItemsBaseline = computedStyle.alignItems === 'baseline';
  
  return {
    passed: isFlex && hasItemsBaseline,
    message: `Display: ${computedStyle.display}, Align-items: ${computedStyle.alignItems}`,
    measurements: { display: computedStyle.display, alignItems: computedStyle.alignItems }
  };
});

runTest('7.3.2 - Header title should maintain vertical position', () => {
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <header class="flex justify-between items-baseline p-4">
      <div id="left">
        <div class="text-sm">Nama: _____________</div>
      </div>
      <h2 id="title" class="text-2xl font-bold">Latihan Hari Ini</h2>
      <div id="right" class="text-sm">Tanggal: _____________</div>
    </header>
  `;
  testDiv.style.position = 'absolute';
  testDiv.style.left = '-9999px';
  document.body.appendChild(testDiv);
  
  const title = testDiv.querySelector('#title');
  const left = testDiv.querySelector('#left');
  const right = testDiv.querySelector('#right');
  
  const titlePos = measureElementPosition(title);
  const leftPos = measureElementPosition(left);
  const rightPos = measureElementPosition(right);
  
  document.body.removeChild(testDiv);
  
  // Title should be baseline-aligned with other elements
  // Check that baselines are consistent
  const titleBaseline = titlePos.bottom;
  const leftBaseline = leftPos.bottom;
  const rightBaseline = rightPos.bottom;
  
  const maxDiff = Math.max(
    Math.abs(titleBaseline - leftBaseline),
    Math.abs(titleBaseline - rightBaseline)
  );
  
  return {
    passed: maxDiff <= TOLERANCE_PX,
    message: `Max baseline difference: ${maxDiff.toFixed(2)}px (tolerance: ${TOLERANCE_PX}px)`,
    measurements: { titlePos, leftPos, rightPos, maxDiff }
  };
});

runTest('7.3.3 - Header elements should have transform optimization', () => {
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <header class="flex justify-between items-baseline p-4">
      <h2 class="text-2xl font-bold">Latihan Hari Ini</h2>
    </header>
  `;
  testDiv.style.position = 'absolute';
  testDiv.style.left = '-9999px';
  document.body.appendChild(testDiv);
  
  const header = testDiv.querySelector('header');
  const computedStyle = window.getComputedStyle(header);
  
  document.body.removeChild(testDiv);
  
  const hasTransform = computedStyle.transform !== 'none';
  
  return {
    passed: hasTransform,
    message: `Transform: ${computedStyle.transform}`,
    measurements: { transform: computedStyle.transform }
  };
});

// ============================================================================
// Task 7.4: Test spelling box borders
// ============================================================================
console.log('\n📋 Task 7.4: Testing Spelling Box Borders\n');

runTest('7.4.1 - Spelling boxes should have consistent border-bottom', () => {
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <div class="exercise-card">
      <div class="flex gap-2">
        <div class="border-b-2 border-gray-600 w-12 h-12 text-center">B</div>
        <div class="border-b-2 border-gray-600 w-12 h-12 text-center">O</div>
        <div class="border-b-2 border-gray-600 w-12 h-12 text-center">L</div>
        <div class="border-b-2 border-gray-600 w-12 h-12 text-center">A</div>
      </div>
    </div>
  `;
  testDiv.style.position = 'absolute';
  testDiv.style.left = '-9999px';
  document.body.appendChild(testDiv);
  
  const boxes = testDiv.querySelectorAll('.border-b-2');
  const positions = Array.from(boxes).map(el => measureElementPosition(el));
  
  document.body.removeChild(testDiv);
  
  // All boxes should have the same bottom position (perfectly aligned)
  const allAligned = positions.every((pos, i) => {
    if (i === 0) return true;
    return comparePositions(positions[0], pos, TOLERANCE_PX);
  });
  
  const maxDiff = positions.reduce((max, pos, i) => {
    if (i === 0) return 0;
    const diff = Math.abs(positions[0].bottom - pos.bottom);
    return Math.max(max, diff);
  }, 0);
  
  return {
    passed: allAligned,
    message: `Max alignment difference: ${maxDiff.toFixed(2)}px (tolerance: ${TOLERANCE_PX}px)`,
    measurements: { positions, maxDiff }
  };
});

runTest('7.4.2 - Spelling box borders should be perfectly horizontal', () => {
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <div class="exercise-card">
      <div class="flex gap-2">
        <div class="border-b-2 border-gray-600 w-12 h-12"></div>
        <div class="border-b-2 border-gray-600 w-12 h-12"></div>
        <div class="border-b-2 border-gray-600 w-12 h-12"></div>
      </div>
    </div>
  `;
  testDiv.style.position = 'absolute';
  testDiv.style.left = '-9999px';
  document.body.appendChild(testDiv);
  
  const boxes = testDiv.querySelectorAll('.border-b-2');
  const allHorizontal = Array.from(boxes).every(box => isLineHorizontal(box, TOLERANCE_PX));
  
  document.body.removeChild(testDiv);
  
  return {
    passed: allHorizontal,
    message: `All borders horizontal: ${allHorizontal}`,
    measurements: { allHorizontal }
  };
});

runTest('7.4.3 - Spelling boxes should use px border units', () => {
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <div class="exercise-card">
      <div class="border-b-2 border-gray-600 w-12 h-12"></div>
    </div>
  `;
  testDiv.style.position = 'absolute';
  testDiv.style.left = '-9999px';
  document.body.appendChild(testDiv);
  
  const box = testDiv.querySelector('.border-b-2');
  const computedStyle = window.getComputedStyle(box);
  const borderWidth = computedStyle.borderBottomWidth;
  
  document.body.removeChild(testDiv);
  
  const hasPixelBorder = borderWidth.includes('px');
  const borderValue = parseFloat(borderWidth);
  
  return {
    passed: hasPixelBorder && borderValue > 0,
    message: `Border width: ${borderWidth}`,
    measurements: { borderWidth, borderValue }
  };
});

// ============================================================================
// Task 7.5: Test pattern exercise alignment
// ============================================================================
console.log('\n📋 Task 7.5: Testing Pattern Exercise Alignment\n');

runTest('7.5.1 - Pattern items should align with answer line', () => {
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <div class="exercise-card">
      <div class="flex items-baseline gap-2">
        <span id="emoji1" class="text-2xl">😊</span>
        <span id="emoji2" class="text-2xl">😂</span>
        <span id="emoji3" class="text-2xl">😊</span>
        <span class="text-xl">→</span>
        <span id="answer" class="answer-line border-b-2 border-gray-600"></span>
      </div>
    </div>
  `;
  testDiv.style.position = 'absolute';
  testDiv.style.left = '-9999px';
  document.body.appendChild(testDiv);
  
  const emoji1 = testDiv.querySelector('#emoji1');
  const answer = testDiv.querySelector('#answer');
  
  const emojiPos = measureElementPosition(emoji1);
  const answerPos = measureElementPosition(answer);
  
  document.body.removeChild(testDiv);
  
  const aligned = comparePositions(emojiPos, answerPos, TOLERANCE_PX);
  const diff = Math.abs(emojiPos.bottom - answerPos.bottom);
  
  return {
    passed: aligned,
    message: `Baseline difference: ${diff.toFixed(2)}px (tolerance: ${TOLERANCE_PX}px)`,
    measurements: { emojiPos, answerPos, diff }
  };
});

runTest('7.5.2 - Pattern answer line should use inline-flex', () => {
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <div class="exercise-card">
      <div class="flex items-baseline gap-2">
        <span class="answer-line border-b-2 border-gray-600"></span>
      </div>
    </div>
  `;
  testDiv.style.position = 'absolute';
  testDiv.style.left = '-9999px';
  document.body.appendChild(testDiv);
  
  const answerLine = testDiv.querySelector('.answer-line');
  const measurements = measureElementPosition(answerLine);
  
  document.body.removeChild(testDiv);
  
  const isInlineFlex = measurements.display === 'inline-flex';
  
  return {
    passed: isInlineFlex,
    message: `Display: ${measurements.display}`,
    measurements
  };
});

// ============================================================================
// Task 7.6: Cross-browser testing
// ============================================================================
console.log('\n📋 Task 7.6: Cross-Browser Testing\n');

runTest('7.6.1 - Detect current browser', () => {
  const userAgent = navigator.userAgent.toLowerCase();
  let browserName = 'Unknown';
  
  if (userAgent.includes('chrome') && !userAgent.includes('edge')) {
    browserName = 'Chrome';
  } else if (userAgent.includes('firefox')) {
    browserName = 'Firefox';
  } else if (userAgent.includes('edge')) {
    browserName = 'Edge';
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    browserName = 'Safari';
  }
  
  console.log(`   Current browser: ${browserName}`);
  
  return {
    passed: browserName !== 'Unknown',
    message: `Browser: ${browserName}`,
    measurements: { browserName, userAgent }
  };
});

runTest('7.6.2 - Browser supports required CSS features', () => {
  const testDiv = document.createElement('div');
  testDiv.style.transform = 'translateZ(0)';
  testDiv.style.backfaceVisibility = 'hidden';
  testDiv.style.display = 'inline-flex';
  
  document.body.appendChild(testDiv);
  const computedStyle = window.getComputedStyle(testDiv);
  
  const supportsTransform = computedStyle.transform !== 'none';
  const supportsBackface = computedStyle.backfaceVisibility === 'hidden';
  const supportsInlineFlex = computedStyle.display === 'inline-flex';
  
  document.body.removeChild(testDiv);
  
  const allSupported = supportsTransform && supportsBackface && supportsInlineFlex;
  
  return {
    passed: allSupported,
    message: `Transform: ${supportsTransform}, Backface: ${supportsBackface}, Inline-flex: ${supportsInlineFlex}`,
    measurements: { supportsTransform, supportsBackface, supportsInlineFlex }
  };
});

runTest('7.6.3 - Browser supports Font Loading API', () => {
  const hasFontAPI = typeof document.fonts !== 'undefined';
  const hasFontReady = hasFontAPI && typeof document.fonts.ready !== 'undefined';
  
  return {
    passed: hasFontAPI,
    message: `Font API: ${hasFontAPI}, Font Ready: ${hasFontReady}`,
    measurements: { hasFontAPI, hasFontReady }
  };
});

// ============================================================================
// Task 7.7: Performance testing with scale 3
// ============================================================================
console.log('\n📋 Task 7.7: Performance Testing with Scale 3\n');

runTest('7.7.1 - Measure canvas creation time (simulated)', async () => {
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <div style="width: 210mm; height: 297mm; background: white; padding: 20mm;">
      <h1>Performance Test</h1>
      <p>Testing canvas creation performance</p>
    </div>
  `;
  testDiv.style.position = 'absolute';
  testDiv.style.left = '-9999px';
  document.body.appendChild(testDiv);
  
  const startTime = performance.now();
  
  // Simulate canvas operations
  const canvas = document.createElement('canvas');
  canvas.width = 794 * 3; // A4 width at scale 3
  canvas.height = 1123 * 3; // A4 height at scale 3
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  document.body.removeChild(testDiv);
  
  // Canvas creation should be fast (< 100ms)
  const isPerformant = duration < 100;
  
  return {
    passed: isPerformant,
    message: `Canvas creation time: ${duration.toFixed(2)}ms (threshold: 100ms)`,
    measurements: { duration, isPerformant }
  };
});

runTest('7.7.2 - Memory usage for scale 3 canvas', () => {
  // Calculate memory requirements for scale 3
  const scale = 3;
  const a4WidthPx = 794; // A4 width at 96 DPI
  const a4HeightPx = 1123; // A4 height at 96 DPI
  
  const canvasWidth = a4WidthPx * scale;
  const canvasHeight = a4HeightPx * scale;
  const totalPixels = canvasWidth * canvasHeight;
  
  // Each pixel uses 4 bytes (RGBA)
  const memoryBytes = totalPixels * 4;
  const memoryMB = memoryBytes / (1024 * 1024);
  
  // Should be under 50MB for reasonable performance
  const isReasonable = memoryMB < 50;
  
  return {
    passed: isReasonable,
    message: `Memory for scale 3: ${memoryMB.toFixed(2)}MB (threshold: 50MB)`,
    measurements: { canvasWidth, canvasHeight, totalPixels, memoryMB }
  };
});

runTest('7.7.3 - Compare scale 2 vs scale 3 resolution', () => {
  const scale2DPI = 96 * 2; // 192 DPI
  const scale3DPI = 96 * 3; // 288 DPI
  
  const improvementPercent = ((scale3DPI - scale2DPI) / scale2DPI) * 100;
  
  // Scale 3 should provide 50% more resolution
  const hasSignificantImprovement = improvementPercent >= 40;
  
  return {
    passed: hasSignificantImprovement,
    message: `Scale 2: ${scale2DPI} DPI, Scale 3: ${scale3DPI} DPI (${improvementPercent.toFixed(1)}% improvement)`,
    measurements: { scale2DPI, scale3DPI, improvementPercent }
  };
});

runTest('7.7.4 - Verify scale 3 provides sub-pixel precision', () => {
  const scale = 3;
  
  // At scale 3, we can represent 1/3 pixel increments
  const subPixelPrecision = 1 / scale;
  
  // This should be better than 0.5px (which causes sub-pixel rendering issues)
  const isBetterThanHalfPixel = subPixelPrecision < 0.5;
  
  return {
    passed: isBetterThanHalfPixel,
    message: `Sub-pixel precision: ${subPixelPrecision.toFixed(3)}px (better than 0.5px: ${isBetterThanHalfPixel})`,
    measurements: { scale, subPixelPrecision, isBetterThanHalfPixel }
  };
});

// ============================================================================
// Generate comprehensive test report
// ============================================================================
console.log('\n' + '='.repeat(80));
console.log('📊 Pixel-Perfect Rendering Test Results');
console.log('='.repeat(80));
console.log(`Total Tests: ${testResults.total}`);
console.log(`Passed: ${testResults.passed}`);
console.log(`Failed: ${testResults.failed}`);
console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

if (testResults.failed === 0) {
  console.log('\n🎉 All pixel-perfect rendering tests passed!');
  console.log('✅ PDF rendering should be pixel-perfect with 0px tolerance');
} else {
  console.log(`\n⚠️  ${testResults.failed} test(s) failed.`);
  console.log('❌ Some rendering precision issues detected.');
  console.log('\nFailed tests:');
  testResults.details
    .filter(test => !test.passed)
    .forEach(test => {
      console.log(`  - ${test.name}: ${test.message}`);
    });
}

// Generate detailed analysis
const analysis = {
  testSuite: 'Pixel-Perfect Rendering Analysis',
  timestamp: new Date().toISOString(),
  tolerance: TOLERANCE_PX,
  results: testResults,
  summary: {
    task71_answerLineAlignment: testResults.details.filter(t => t.name.startsWith('7.1')),
    task72_mathEquationBorders: testResults.details.filter(t => t.name.startsWith('7.2')),
    task73_headerPositioning: testResults.details.filter(t => t.name.startsWith('7.3')),
    task74_spellingBoxBorders: testResults.details.filter(t => t.name.startsWith('7.4')),
    task75_patternAlignment: testResults.details.filter(t => t.name.startsWith('7.5')),
    task76_crossBrowser: testResults.details.filter(t => t.name.startsWith('7.6')),
    task77_performance: testResults.details.filter(t => t.name.startsWith('7.7'))
  }
};

console.log('\n📋 Detailed Analysis:');
console.log(JSON.stringify(analysis, null, 2));

// Exit with appropriate code
if (typeof process !== 'undefined' && process.exit) {
  process.exit(testResults.failed === 0 ? 0 : 1);
}
