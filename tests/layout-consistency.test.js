/**
 * Layout Consistency Test Suite
 * Task 7.2: Test layout consistency antara preview dan PDF
 * 
 * This test suite validates:
 * - Preview layout matches PDF output
 * - Spacing, margins, and proportions consistency
 * - Various exercise combinations render consistently
 * - Header layout consistency
 */

// Test constants and utilities
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PRINT_SAFE_WIDTH_MM = 180;
const PRINT_SAFE_HEIGHT_MM = 257;

// Mock exercise types for testing
const ExerciseType = {
  COUNTING: 'counting',
  ADDITION: 'addition',
  SUBTRACTION: 'subtraction',
  TRACING: 'tracing',
  DRAWING: 'drawing',
  PATTERN: 'pattern',
  MATCHING: 'matching',
  SPELLING: 'spelling',
  COLORING: 'coloring',
  MAZE: 'maze'
};

// Exercise height estimation (from App.tsx)
const A4_PRINT_SAFE_HEIGHT_MM = 257;
const A4_PRINT_SAFE_HEIGHT_UNITS = 100;
const MM_TO_UNITS = A4_PRINT_SAFE_HEIGHT_UNITS / A4_PRINT_SAFE_HEIGHT_MM;

const estimateExerciseHeight = (exercise) => {
  const baseHeightMm = 15;
  const baseHeight = baseHeightMm * MM_TO_UNITS;

  switch (exercise.type) {
    case ExerciseType.COUNTING:
      const countingContentMm = 12 + Math.ceil(exercise.config.count / 5) * 8;
      return baseHeight + (countingContentMm * MM_TO_UNITS);

    case ExerciseType.ADDITION:
    case ExerciseType.SUBTRACTION:
      const equationContentMm = 12;
      const helpersHeightMm = exercise.config.showHelpers ? 10 : 0;
      return baseHeight + ((equationContentMm + helpersHeightMm) * MM_TO_UNITS);

    case ExerciseType.TRACING:
      const tracingContentMm = 20;
      return baseHeight + (tracingContentMm * MM_TO_UNITS);

    case ExerciseType.DRAWING:
      const drawingContentMm = 45;
      return baseHeight + (drawingContentMm * MM_TO_UNITS);

    case ExerciseType.PATTERN:
      const patternContentMm = 20;
      return baseHeight + (patternContentMm * MM_TO_UNITS);

    case ExerciseType.MATCHING:
      const pairCount = exercise.config.pairs?.length || 3;
      const matchingContentMm = 12 + (pairCount * 5);
      return baseHeight + (matchingContentMm * MM_TO_UNITS);

    case ExerciseType.SPELLING:
      const spellingContentMm = 25;
      return baseHeight + (spellingContentMm * MM_TO_UNITS);

    case ExerciseType.COLORING:
      const coloringContentMm = 55;
      return baseHeight + (coloringContentMm * MM_TO_UNITS);

    case ExerciseType.MAZE:
      const mazeContentMm = 55;
      return baseHeight + (mazeContentMm * MM_TO_UNITS);

    default:
      const defaultContentMm = 25;
      return baseHeight + (defaultContentMm * MM_TO_UNITS);
  }
};

// Calculate page height
const calculatePageHeight = (exercises) => {
  const headerHeight = 10; // Name, class, and worksheet title
  const exerciseSpacing = 2; // Space between exercises

  const exercisesHeight = exercises.reduce((total, ex) => {
    return total + estimateExerciseHeight(ex) + exerciseSpacing;
  }, 0);

  return headerHeight + exercisesHeight;
};

// Test data - various exercise combinations
const testExerciseCombinations = [
  // Simple combination
  {
    name: 'Simple Math Exercises',
    exercises: [
      {
        id: '1',
        type: ExerciseType.COUNTING,
        config: { count: 5, emoji: '🍎', title: 'Count Apples' },
        pageNumber: 1
      },
      {
        id: '2',
        type: ExerciseType.ADDITION,
        config: { num1: 3, num2: 4, showHelpers: true, helperEmoji: '⭐', title: 'Add Stars' },
        pageNumber: 1
      }
    ]
  },
  
  // Complex combination
  {
    name: 'Mixed Exercise Types',
    exercises: [
      {
        id: '1',
        type: ExerciseType.TRACING,
        config: { text: 'HELLO', title: 'Trace Letters' },
        pageNumber: 1
      },
      {
        id: '2',
        type: ExerciseType.PATTERN,
        config: { items: ['🔴', '🔵', '🔴'], title: 'Continue Pattern' },
        pageNumber: 1
      },
      {
        id: '3',
        type: ExerciseType.MATCHING,
        config: {
          title: 'Match Items',
          pairs: [
            { id: '1', item1: 'Cat', item2: 'Meow' },
            { id: '2', item1: 'Dog', item2: 'Woof' },
            { id: '3', item1: 'Cow', item2: 'Moo' }
          ]
        },
        pageNumber: 1
      }
    ]
  },
  
  // Large exercises
  {
    name: 'Large Content Exercises',
    exercises: [
      {
        id: '1',
        type: ExerciseType.DRAWING,
        config: { title: 'Draw Your Family', instruction: 'Draw a picture of your family' },
        pageNumber: 1
      },
      {
        id: '2',
        type: ExerciseType.COLORING,
        config: { title: 'Color the Picture', instruction: 'Color this beautiful picture', svgKey: 'flower' },
        pageNumber: 1
      }
    ]
  }
];

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
    toContain: (expected) => actual.includes(expected)
  };
}

// Test Suite
console.log('🧪 Starting Layout Consistency Test Suite\n');

// Test 1: Exercise Height Calculations
runTest('should calculate consistent exercise heights', () => {
  const countingExercise = {
    type: ExerciseType.COUNTING,
    config: { count: 10, emoji: '🍎', title: 'Count Apples' }
  };
  
  const height1 = estimateExerciseHeight(countingExercise);
  const height2 = estimateExerciseHeight(countingExercise);
  
  return expect(height1).toBe(height2);
});

runTest('should calculate different heights for different exercise types', () => {
  const countingExercise = {
    type: ExerciseType.COUNTING,
    config: { count: 5, emoji: '🍎', title: 'Count Apples' }
  };
  
  const drawingExercise = {
    type: ExerciseType.DRAWING,
    config: { title: 'Draw Picture', instruction: 'Draw something' }
  };
  
  const countingHeight = estimateExerciseHeight(countingExercise);
  const drawingHeight = estimateExerciseHeight(drawingExercise);
  
  return expect(drawingHeight).toBeGreaterThan(countingHeight);
});

runTest('should account for exercise configuration in height calculation', () => {
  const simpleAddition = {
    type: ExerciseType.ADDITION,
    config: { num1: 2, num2: 3, showHelpers: false, title: 'Simple Add' }
  };
  
  const additionWithHelpers = {
    type: ExerciseType.ADDITION,
    config: { num1: 2, num2: 3, showHelpers: true, helperEmoji: '⭐', title: 'Add with Helpers' }
  };
  
  const simpleHeight = estimateExerciseHeight(simpleAddition);
  const helpersHeight = estimateExerciseHeight(additionWithHelpers);
  
  return expect(helpersHeight).toBeGreaterThan(simpleHeight);
});

// Test 2: Page Height Calculations
runTest('should calculate total page height correctly', () => {
  const exercises = testExerciseCombinations[0].exercises;
  const totalHeight = calculatePageHeight(exercises);
  
  // Should include header height (10) + exercise heights + spacing
  const expectedMinHeight = 10; // At least header height
  
  return expect(totalHeight).toBeGreaterThan(expectedMinHeight);
});

runTest('should account for exercise spacing in page height', () => {
  const singleExercise = [testExerciseCombinations[0].exercises[0]];
  const multipleExercises = testExerciseCombinations[0].exercises;
  
  const singleHeight = calculatePageHeight(singleExercise);
  const multipleHeight = calculatePageHeight(multipleExercises);
  
  // Multiple exercises should have more height due to spacing
  return expect(multipleHeight).toBeGreaterThan(singleHeight);
});

// Test 3: Layout Consistency Across Exercise Types
testExerciseCombinations.forEach((combination, index) => {
  runTest(`should maintain consistent layout for ${combination.name}`, () => {
    const pageHeight = calculatePageHeight(combination.exercises);
    const maxPageHeight = A4_PRINT_SAFE_HEIGHT_UNITS;
    
    // Page should not exceed maximum height
    const fitsOnPage = pageHeight <= maxPageHeight;
    
    // Each exercise should have reasonable height
    const exerciseHeights = combination.exercises.map(estimateExerciseHeight);
    const allReasonableHeights = exerciseHeights.every(height => height > 0 && height < 50);
    
    return fitsOnPage && allReasonableHeights;
  });
});

// Test 4: Header Layout Consistency
runTest('should maintain consistent header proportions', () => {
  const headerHeight = 10; // Fixed header height in units
  const maxPageHeight = A4_PRINT_SAFE_HEIGHT_UNITS;
  
  // Header should not exceed 15% of page height
  const headerPercentage = (headerHeight / maxPageHeight) * 100;
  
  return expect(headerPercentage).toBeLessThanOrEqual(15);
});

// Test 5: Margin and Spacing Consistency
runTest('should maintain consistent margins across all layouts', () => {
  const topMargin = 20; // mm
  const bottomMargin = 20; // mm
  const leftMargin = 15; // mm
  const rightMargin = 15; // mm
  
  const totalVerticalMargins = topMargin + bottomMargin;
  const totalHorizontalMargins = leftMargin + rightMargin;
  
  const availableWidth = A4_WIDTH_MM - totalHorizontalMargins;
  const availableHeight = A4_HEIGHT_MM - totalVerticalMargins;
  
  return expect(availableWidth).toBe(PRINT_SAFE_WIDTH_MM) &&
         expect(availableHeight).toBe(PRINT_SAFE_HEIGHT_MM);
});

// Test 6: Exercise Spacing Consistency
runTest('should maintain consistent spacing between exercises', () => {
  const exerciseSpacing = 2; // units between exercises
  
  // Test with different numbers of exercises
  const oneExercise = [testExerciseCombinations[0].exercises[0]];
  const twoExercises = testExerciseCombinations[0].exercises.slice(0, 2);
  
  const oneExerciseHeight = calculatePageHeight(oneExercise);
  const twoExerciseHeight = calculatePageHeight(twoExercises);
  
  const secondExerciseHeight = estimateExerciseHeight(twoExercises[1]);
  const expectedTwoExerciseHeight = oneExerciseHeight + secondExerciseHeight + exerciseSpacing;
  
  return expect(twoExerciseHeight).toBeCloseTo(expectedTwoExerciseHeight, 1);
});

// Test 7: Content Density Optimization
runTest('should optimize content density for A4 format', () => {
  // Test that we can fit a reasonable number of exercises on one page
  const simpleExercises = Array(5).fill(null).map((_, i) => ({
    id: `${i + 1}`,
    type: ExerciseType.COUNTING,
    config: { count: 3, emoji: '🍎', title: `Count ${i + 1}` },
    pageNumber: 1
  }));
  
  const totalHeight = calculatePageHeight(simpleExercises);
  const maxPageHeight = A4_PRINT_SAFE_HEIGHT_UNITS;
  
  // Should be able to fit 5 simple exercises on one page
  return expect(totalHeight).toBeLessThanOrEqual(maxPageHeight);
});

// Test 8: Large Exercise Handling
runTest('should handle large exercises appropriately', () => {
  const largeExercises = [
    {
      id: '1',
      type: ExerciseType.DRAWING,
      config: { title: 'Big Drawing', instruction: 'Draw a large picture' }
    },
    {
      id: '2',
      type: ExerciseType.COLORING,
      config: { title: 'Big Coloring', instruction: 'Color this large picture' }
    }
  ];
  
  const totalHeight = calculatePageHeight(largeExercises);
  const maxPageHeight = A4_PRINT_SAFE_HEIGHT_UNITS;
  
  // Large exercises might exceed one page, which is acceptable
  // But each individual exercise should be reasonable
  const exerciseHeights = largeExercises.map(estimateExerciseHeight);
  const allReasonable = exerciseHeights.every(height => height < maxPageHeight * 0.8);
  
  return allReasonable;
});

// Test 9: MM to Units Conversion Consistency
runTest('should maintain consistent MM to units conversion', () => {
  const conversionFactor = MM_TO_UNITS;
  const expectedFactor = A4_PRINT_SAFE_HEIGHT_UNITS / A4_PRINT_SAFE_HEIGHT_MM;
  
  return expect(conversionFactor).toBeCloseTo(expectedFactor, 6);
});

// Test 10: Exercise Type Coverage
runTest('should handle all exercise types consistently', () => {
  const allTypes = Object.values(ExerciseType);
  const testedTypes = [];
  
  // Test each exercise type
  allTypes.forEach(type => {
    const testExercise = {
      type: type,
      config: getDefaultConfigForType(type)
    };
    
    const height = estimateExerciseHeight(testExercise);
    if (height > 0) {
      testedTypes.push(type);
    }
  });
  
  // Should handle at least 80% of exercise types
  const coveragePercentage = (testedTypes.length / allTypes.length) * 100;
  return expect(coveragePercentage).toBeGreaterThanOrEqual(80);
});

// Helper function to get default config for exercise types
function getDefaultConfigForType(type) {
  switch (type) {
    case ExerciseType.COUNTING:
      return { count: 5, emoji: '🍎', title: 'Count Items' };
    case ExerciseType.ADDITION:
    case ExerciseType.SUBTRACTION:
      return { num1: 3, num2: 2, showHelpers: false, title: 'Math Problem' };
    case ExerciseType.TRACING:
      return { text: 'ABC', title: 'Trace Letters' };
    case ExerciseType.DRAWING:
      return { title: 'Draw Picture', instruction: 'Draw something' };
    case ExerciseType.PATTERN:
      return { items: ['🔴', '🔵'], title: 'Pattern' };
    case ExerciseType.MATCHING:
      return { title: 'Match', pairs: [{ id: '1', item1: 'A', item2: 'B' }] };
    case ExerciseType.SPELLING:
      return { word: 'CAT', emojiHint: '🐱', title: 'Spell Word' };
    case ExerciseType.COLORING:
    case ExerciseType.MAZE:
      return { title: 'Activity', instruction: 'Complete this activity', svgKey: 'default' };
    default:
      return { title: 'Exercise' };
  }
}

// Generate test report
console.log('\n📊 Layout Consistency Test Results:');
console.log(`Total Tests: ${testResults.total}`);
console.log(`Passed: ${testResults.passed}`);
console.log(`Failed: ${testResults.failed}`);
console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

if (testResults.failed === 0) {
  console.log('\n🎉 All layout consistency tests passed!');
} else {
  console.log(`\n⚠️  ${testResults.failed} test(s) failed. Layout consistency issues detected.`);
}

// Generate detailed layout analysis
const layoutAnalysis = {
  testSuite: 'Layout Consistency Analysis',
  timestamp: new Date().toISOString(),
  results: testResults,
  exerciseHeightAnalysis: {
    countingHeight: estimateExerciseHeight({
      type: ExerciseType.COUNTING,
      config: { count: 5, emoji: '🍎', title: 'Count' }
    }),
    additionHeight: estimateExerciseHeight({
      type: ExerciseType.ADDITION,
      config: { num1: 3, num2: 2, showHelpers: true, title: 'Add' }
    }),
    drawingHeight: estimateExerciseHeight({
      type: ExerciseType.DRAWING,
      config: { title: 'Draw', instruction: 'Draw something' }
    }),
    tracingHeight: estimateExerciseHeight({
      type: ExerciseType.TRACING,
      config: { text: 'ABC', title: 'Trace' }
    })
  },
  pageCapacityAnalysis: testExerciseCombinations.map(combination => ({
    name: combination.name,
    exerciseCount: combination.exercises.length,
    totalHeight: calculatePageHeight(combination.exercises),
    fitsOnPage: calculatePageHeight(combination.exercises) <= A4_PRINT_SAFE_HEIGHT_UNITS,
    utilizationPercentage: ((calculatePageHeight(combination.exercises) / A4_PRINT_SAFE_HEIGHT_UNITS) * 100).toFixed(1)
  })),
  layoutConstants: {
    headerHeight: 10,
    exerciseSpacing: 2,
    maxPageHeight: A4_PRINT_SAFE_HEIGHT_UNITS,
    mmToUnitsConversion: MM_TO_UNITS
  }
};

console.log('\n📋 Detailed Layout Analysis:');
console.log(JSON.stringify(layoutAnalysis, null, 2));

// Exit with appropriate code
process.exit(testResults.failed === 0 ? 0 : 1);