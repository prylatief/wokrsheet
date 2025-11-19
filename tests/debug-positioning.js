// Debug the positioning calculation that's failing

const printSafeWidth = 180;
const printSafeHeight = 257;

// Mock image dimensions
const imgWidth = 600;
const imgHeight = 800;
const ratio = imgWidth / imgHeight; // 0.75
const printSafeRatio = printSafeWidth / printSafeHeight; // ~0.7

console.log('Image ratio:', ratio);
console.log('Print safe ratio:', printSafeRatio);
console.log('Ratio > printSafeRatio:', ratio > printSafeRatio);

let finalWidth, finalHeight;

if (ratio > printSafeRatio) {
  // Image is wider - fit to safe width
  finalWidth = printSafeWidth;
  finalHeight = printSafeWidth / ratio;
  console.log('Using width-based fitting');
} else {
  // Image is taller - fit to safe height
  finalHeight = printSafeHeight;
  finalWidth = printSafeHeight * ratio;
  console.log('Using height-based fitting');
}

console.log('Final dimensions:', finalWidth, 'x', finalHeight);

// Position within print safe area
const xOffset = 15 + Math.round((printSafeWidth - finalWidth) / 2);
const yOffset = 20 + Math.round((printSafeHeight - finalHeight) / 2);

console.log('Positioning:', xOffset, ',', yOffset);

// Expected values for the test
console.log('Expected finalWidth:', printSafeHeight * ratio);
console.log('Expected finalHeight:', printSafeHeight);
console.log('Actual finalWidth:', finalWidth);
console.log('Actual finalHeight:', finalHeight);

console.log('Width match:', finalWidth === printSafeHeight * ratio);
console.log('Height match:', finalHeight === printSafeHeight);