# Design Document

## Overview

Analisis kode menunjukkan bahwa PDF generator sudah menggunakan format A4, namun ada beberapa masalah dalam implementasi layout dan rendering yang menyebabkan hasil PDF tidak optimal:

1. **Format A4 sudah benar** - jsPDF sudah dikonfigurasi dengan `format: 'a4'` dan `orientation: 'portrait'`
2. **Masalah layout utama** - Konten tidak menggunakan margin yang konsisten dan optimal untuk A4
3. **Masalah scaling** - Image fitting algorithm tidak mempertimbangkan print safe area
4. **Masalah spacing** - Exercise spacing tidak dioptimalkan untuk ukuran A4
5. **Masalah responsive** - Layout tidak fully responsive untuk ukuran A4 yang tepat

## Architecture

### Current PDF Generation Flow

```
User clicks Download → ExportOptionsModal → handleExportPdf() → 
For each page:
  1. setCurrentPage(pageNum)
  2. Wait for re-render (300ms)
  3. html2canvas capture (scale: 2)
  4. Calculate image dimensions
  5. Center image on A4 page
  6. Add to PDF
→ Save PDF file
```

### Issues in Current Implementation

1. **Printable Area Sizing**
   - Current: `max-w-[210mm]` and `min-h-[297mm]` - correct A4 dimensions
   - Issue: Padding dan margin tidak optimal untuk print safe area

2. **Image Fitting Algorithm**
   - Current: Centers image on page, maintains aspect ratio
   - Issue: Tidak mempertimbangkan print margins, bisa terpotong saat dicetak

3. **Content Density**
   - Current: Uses `MAX_PAGE_HEIGHT = 85` untuk page capacity calculation
   - Issue: Tidak sesuai dengan ukuran A4 sebenarnya

## Components and Interfaces

### 1. Printable Area Container

**Current Implementation:**
```jsx
<div id="printable-area" className={`w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-[210mm] min-h-[297mm] ... p-4 sm:p-6 md:p-8`}>
```

**Issues:**
- Responsive breakpoints tidak konsisten dengan A4
- Padding tidak optimal untuk print safe area
- Width constraints tidak tepat untuk A4

**New Implementation:**
```jsx
<div id="printable-area" className={`w-[210mm] h-[297mm] ... p-[20mm_15mm]`}>
```

**Changes:**
- Fixed width/height sesuai A4 exact dimensions
- Padding menggunakan print safe margins (20mm top/bottom, 15mm left/right)
- Remove responsive breakpoints yang tidak perlu

### 2. Print Styles Enhancement

**Current Print Styles:**
```css
@media print {
  #printable-area {
    padding: 1.2cm 1cm 1cm 1cm !important;
    width: 21cm !important;
    min-height: 29.7cm !important;
  }
}
```

**Issues:**
- Inconsistent units (cm vs mm)
- Margins tidak optimal
- Width/height tidak exact

**New Print Styles:**
```css
@media print {
  #printable-area {
    width: 210mm !important;
    height: 297mm !important;
    padding: 20mm 15mm !important;
    margin: 0 !important;
    box-sizing: border-box !important;
  }
  @page {
    size: A4 portrait;
    margin: 0;
  }
}
```

### 3. PDF Generation Algorithm Enhancement

**Current Algorithm:**
```javascript
// Calculate dimensions to fit image properly on A4 page
const ratio = imgWidth / imgHeight;
const pageRatio = pdfWidth / pdfHeight;

let finalWidth = pdfWidth;
let finalHeight = pdfHeight;

if (ratio > pageRatio) {
  finalHeight = pdfWidth / ratio;
} else {
  finalWidth = pdfHeight * ratio;
}

// Center the image on the page
const xOffset = Math.round((pdfWidth - finalWidth) / 2);
const yOffset = Math.round((pdfHeight - finalHeight) / 2);
```

**Issues:**
- Uses full page dimensions, tidak mempertimbangkan print margins
- Centering bisa menyebabkan content terpotong saat dicetak

**New Algorithm:**
```javascript
// A4 dimensions with print safe margins
const printSafeWidth = pdfWidth - 30; // 15mm left + 15mm right
const printSafeHeight = pdfHeight - 40; // 20mm top + 20mm bottom
const printSafeRatio = printSafeWidth / printSafeHeight;

const ratio = imgWidth / imgHeight;

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
```

### 4. Exercise Spacing Optimization

**Current Implementation:**
```javascript
const MAX_PAGE_HEIGHT = 85; // Arbitrary units
```

**Issue:** Tidak berdasarkan ukuran A4 sebenarnya

**New Implementation:**
```javascript
// Based on A4 dimensions with print safe area
const A4_PRINT_SAFE_HEIGHT_MM = 257; // 297mm - 20mm top - 20mm bottom
const A4_PRINT_SAFE_HEIGHT_UNITS = 100; // Normalized units for calculation

// Convert mm to calculation units
const MM_TO_UNITS = A4_PRINT_SAFE_HEIGHT_UNITS / A4_PRINT_SAFE_HEIGHT_MM;

const estimateExerciseHeight = (exercise: Exercise): number => {
  // Heights in mm, converted to units
  const baseHeight = 15 * MM_TO_UNITS; // 15mm base height
  
  switch (exercise.type) {
    case ExerciseType.COUNTING:
      return baseHeight + (10 * MM_TO_UNITS) + Math.ceil(exercise.config.count / 5) * (5 * MM_TO_UNITS);
    // ... other cases with mm-based calculations
  }
};
```

### 5. Header and Content Layout

**Current Header:**
```jsx
<header className="flex justify-between items-baseline border-b-2 border-purple-300 pb-3 mb-5">
```

**Issues:**
- Spacing tidak optimal untuk A4
- Header bisa terlalu besar atau kecil

**New Header:**
```jsx
<header className="flex justify-between items-baseline border-b-2 border-purple-300 pb-[8mm] mb-[10mm] h-[25mm]">
```

**Changes:**
- Fixed height untuk konsistensi
- Spacing dalam mm units
- Memastikan header tidak lebih dari 10% tinggi halaman

## Data Models

Tidak ada perubahan pada data models. Semua perubahan pada presentation layer.

## Error Handling

### Print Safe Area Validation

```javascript
const validatePrintSafeArea = (content: HTMLElement): boolean => {
  const rect = content.getBoundingClientRect();
  const maxWidth = 180; // 210mm - 30mm margins in mm
  const maxHeight = 257; // 297mm - 40mm margins in mm
  
  if (rect.width > maxWidth || rect.height > maxHeight) {
    console.warn('Content exceeds print safe area');
    return false;
  }
  return true;
};
```

### PDF Generation Error Handling

```javascript
try {
  // Validate content before generation
  if (!validatePrintSafeArea(printableArea)) {
    throw new Error('Content too large for A4 print safe area');
  }
  
  // Generate PDF...
} catch (error) {
  if (error.message.includes('print safe area')) {
    alert('Konten terlalu besar untuk dicetak dengan baik. Kurangi jumlah latihan per halaman.');
  } else {
    alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
  }
}
```

## Testing Strategy

### Visual Testing

1. **A4 Format Verification**
   - Print PDF dan ukur dengan penggaris
   - Verify: 210mm x 297mm exact
   - Test di berbagai printer

2. **Print Safe Area Testing**
   - Print dengan berbagai printer settings
   - Verify: Tidak ada content yang terpotong
   - Test dengan margin settings berbeda

3. **Layout Consistency Testing**
   - Compare preview vs printed result
   - Verify: Spacing dan proportions sama
   - Test dengan berbagai exercise combinations

4. **Cross-Browser Testing**
   - Test PDF generation di Chrome, Firefox, Edge
   - Verify: Consistent A4 output
   - Test dengan berbagai zoom levels

### Automated Testing

```javascript
// Test A4 dimensions
const testA4Dimensions = () => {
  const printableArea = document.getElementById('printable-area');
  const rect = printableArea.getBoundingClientRect();
  
  // Convert pixels to mm (assuming 96 DPI)
  const widthMM = (rect.width * 25.4) / 96;
  const heightMM = (rect.height * 25.4) / 96;
  
  expect(widthMM).toBeCloseTo(210, 1);
  expect(heightMM).toBeCloseTo(297, 1);
};
```

## Implementation Notes

### CSS Changes Priority

1. **High Priority:**
   - Fix printable area dimensions
   - Update print styles for exact A4
   - Implement print safe margins

2. **Medium Priority:**
   - Update PDF generation algorithm
   - Fix exercise height calculations
   - Optimize header layout

3. **Low Priority:**
   - Add print safe area validation
   - Enhance error handling
   - Add automated tests

### Performance Considerations

- CSS changes tidak mempengaruhi performance
- PDF generation time mungkin sedikit meningkat karena validation
- html2canvas rendering time tetap sama
- File size PDF mungkin sedikit lebih kecil karena better optimization

## Design Decisions and Rationales

### Decision 1: Menggunakan Fixed A4 Dimensions

**Rationale:**
- Responsive breakpoints tidak diperlukan untuk PDF generation
- Fixed dimensions memastikan konsistensi across devices
- Lebih mudah untuk calculate print safe area

### Decision 2: Implement Print Safe Margins

**Rationale:**
- Printer margins bervariasi (biasanya 5-15mm)
- 20mm top/bottom dan 15mm left/right adalah safe margins
- Memastikan content tidak terpotong di printer manapun

### Decision 3: Update PDF Fitting Algorithm

**Rationale:**
- Current algorithm bisa menyebabkan content terpotong
- Print safe area approach lebih reliable
- Better user experience untuk printing

### Decision 4: Use MM Units Consistently

**Rationale:**
- MM adalah unit standar untuk print
- Lebih akurat daripada mixing px, pt, cm
- Easier untuk calculate dan debug

### Decision 5: Optimize Exercise Height Calculations

**Rationale:**
- Current calculations tidak berdasarkan A4 real dimensions
- MM-based calculations lebih akurat
- Better page capacity estimation

## Browser Compatibility

### Supported Browsers
- Chrome 80+ (primary target)
- Firefox 75+
- Edge 80+
- Safari 13+ (limited testing)

### Known Issues
- Safari: html2canvas performance bisa lebih lambat
- Firefox: Font rendering sedikit berbeda
- Edge: Consistent dengan Chrome

### Fallback Strategies
- Jika html2canvas gagal, show error message dengan troubleshooting tips
- Jika jsPDF gagal, suggest browser update
- Provide manual print option sebagai fallback