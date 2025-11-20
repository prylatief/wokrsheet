# Design Document

## Overview

Masalah rendering PDF yang tidak sesuai dengan preview disebabkan oleh beberapa faktor teknis:

1. **html2canvas Sub-pixel Rendering**: Saat html2canvas menangkap DOM dengan scale 2, terjadi sub-pixel rendering yang menyebabkan elemen bergeser sedikit (0.5-1px)
2. **Baseline Alignment Inconsistency**: Browser dan canvas memiliki cara berbeda dalam menghitung baseline alignment, terutama untuk inline-block elements
3. **Border Rendering Artifacts**: Border dengan unit `pt` di-render berbeda antara browser dan canvas
4. **Flexbox Alignment Shift**: Flexbox alignment (items-baseline) tidak selalu di-capture dengan akurat oleh html2canvas
5. **Font Rendering Timing**: Font belum sepenuhnya di-render saat html2canvas melakukan capture

## Architecture

### Current PDF Generation Flow

```
User clicks Download → ExportOptionsModal → handleExportPdf() → 
For each page:
  1. setCurrentPage(pageNum)
  2. Wait 300ms for re-render
  3. waitForFonts() - wait for fonts to load
  4. html2canvas capture with scale: 2
  5. Convert canvas to PNG
  6. Calculate dimensions for A4 print safe area
  7. Add image to PDF
→ Save PDF file
```

### Root Causes Analysis

#### 1. html2canvas Scale Factor Issue

**Current Setting:**
```javascript
canvas = await window.html2canvas(printableArea, {
  scale: 2,
  letterRendering: false,
  // ...
});
```

**Problem:**
- Scale 2 menyebabkan sub-pixel positioning (0.5px shifts)
- letterRendering: false mencegah text optimization tapi tidak mencegah border shifts

**Solution:**
- Gunakan scale 3 untuk lebih presisi (3x resolution)
- Enable letterRendering: true untuk better text rendering
- Tambahkan CSS transform untuk force pixel-perfect positioning

#### 2. Baseline Alignment Inconsistency

**Current CSS:**
```css
.answer-line {
  vertical-align: baseline;
  height: 1em;
  line-height: 1;
}

.align-baseline {
  vertical-align: baseline;
  height: 1.2em;
  line-height: 1;
}
```

**Problem:**
- `vertical-align: baseline` di-interpret berbeda oleh html2canvas
- `height: 1em` bisa menyebabkan fractional pixels
- Inline-block dengan border-bottom tidak selalu align dengan teks

**Solution:**
- Gunakan `display: inline-flex` dengan `align-items: baseline` untuk lebih presisi
- Set explicit `transform: translateZ(0)` untuk force GPU rendering
- Gunakan integer pixel values untuk height

#### 3. Border Rendering Artifacts

**Current CSS:**
```css
.border-b-3 {
  border-bottom-width: 3pt;
  border-bottom-style: solid;
}

.answer-line {
  border-bottom-width: 2pt;
  border-bottom-style: solid;
}
```

**Problem:**
- Unit `pt` di-convert ke pixels dengan rounding errors
- Border position bisa shift 0.5-1px saat di-capture

**Solution:**
- Gunakan `px` units untuk border width (lebih presisi di canvas)
- Set `will-change: transform` untuk optimize rendering
- Tambahkan `backface-visibility: hidden` untuk prevent sub-pixel rendering

#### 4. Flexbox Alignment Shift

**Current Header:**
```jsx
<header className="flex justify-between items-baseline ...">
```

**Problem:**
- `items-baseline` alignment bisa shift saat di-capture oleh html2canvas
- Flexbox baseline calculation berbeda antara browser dan canvas

**Solution:**
- Tambahkan explicit `align-self: baseline` pada child elements
- Gunakan `transform: translateY(0)` untuk force integer positioning
- Set explicit line-height untuk konsistensi

#### 5. Font Rendering Timing

**Current Implementation:**
```javascript
const waitForFonts = async (): Promise<void> => {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  await new Promise(resolve => setTimeout(resolve, 300));
  // Force reflow
  if (printableArea) {
    printableArea.offsetHeight;
  }
};
```

**Problem:**
- 300ms mungkin tidak cukup untuk Arabic fonts
- Reflow tidak menjamin font sudah fully rendered

**Solution:**
- Increase wait time to 500ms
- Add explicit font loading check untuk Amiri (Arabic font)
- Force multiple reflows untuk ensure complete rendering

## Components and Interfaces

### 1. Enhanced CSS for Pixel-Perfect Rendering

**New CSS Classes:**

```css
/* Force pixel-perfect rendering for PDF export */
.pdf-optimized {
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
  -webkit-font-smoothing: subpixel-antialiased;
  -moz-osx-font-smoothing: auto;
}

/* Enhanced answer line with pixel-perfect positioning */
.answer-line {
  border-bottom-width: 2px; /* Changed from 2pt to 2px */
  border-bottom-style: solid;
  border-bottom-color: #4b5563;
  display: inline-flex; /* Changed from inline-block */
  align-items: baseline;
  vertical-align: baseline;
  margin-left: 0.5rem;
  height: 16px; /* Changed from 1em to explicit px */
  line-height: 16px; /* Match height */
  transform: translateZ(0); /* Force GPU rendering */
  backface-visibility: hidden;
}

/* Enhanced baseline alignment for math equations */
.align-baseline {
  vertical-align: baseline;
  height: 20px; /* Changed from 1.2em to explicit px */
  line-height: 20px; /* Match height */
  display: inline-flex; /* Changed from inline-block */
  align-items: baseline;
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* Enhanced border for consistent rendering */
.border-b-3 {
  border-bottom-width: 3px; /* Changed from 3pt to 3px */
  border-bottom-style: solid;
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* Force integer positioning for all exercise cards */
.exercise-card {
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
}

/* Optimize header for pixel-perfect alignment */
#printable-area header {
  transform: translateZ(0);
  backface-visibility: hidden;
}

#printable-area header > * {
  align-self: baseline;
  transform: translateY(0);
}
```

### 2. Enhanced html2canvas Configuration

**Current Configuration:**
```javascript
canvas = await window.html2canvas(printableArea, {
  scale: 2,
  useCORS: true,
  allowTaint: true,
  backgroundColor: '#ffffff',
  letterRendering: false,
  logging: false,
  imageTimeout: 15000,
  removeContainer: true,
  windowWidth: printableArea.scrollWidth,
  windowHeight: printableArea.scrollHeight,
});
```

**New Configuration:**
```javascript
canvas = await window.html2canvas(printableArea, {
  scale: 3, // Increased from 2 to 3 for better precision
  useCORS: true,
  allowTaint: true,
  backgroundColor: '#ffffff',
  letterRendering: true, // Changed to true for better text rendering
  logging: false,
  imageTimeout: 15000,
  removeContainer: true,
  windowWidth: printableArea.scrollWidth,
  windowHeight: printableArea.scrollHeight,
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
  // Add pixel ratio for sharper rendering
  foreignObjectRendering: false, // Disable for better border rendering
});
```

### 3. Enhanced Font Loading

**Current Implementation:**
```javascript
const waitForFonts = async (): Promise<void> => {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  await new Promise(resolve => setTimeout(resolve, 300));
  if (printableArea) {
    printableArea.offsetHeight;
  }
};
```

**New Implementation:**
```javascript
const waitForFonts = async (): Promise<void> => {
  // Wait for all fonts to be ready
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
```

### 4. Pre-Render Optimization

**New Function:**
```javascript
const optimizeForPdfRendering = (element: HTMLElement): void => {
  // Add pdf-optimized class to all elements
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
  
  // Force reflow
  element.offsetHeight;
};

const cleanupPdfOptimization = (element: HTMLElement): void => {
  // Remove pdf-optimized class
  element.classList.remove('pdf-optimized');
  
  const allElements = element.querySelectorAll('.pdf-optimized');
  allElements.forEach((el) => {
    el.classList.remove('pdf-optimized');
  });
};
```

### 5. Enhanced PDF Generation Flow

**New Flow:**
```
User clicks Download → ExportOptionsModal → handleExportPdf() → 
For each page:
  1. setCurrentPage(pageNum)
  2. Wait 300ms for React re-render
  3. optimizeForPdfRendering(printableArea) - add optimization classes
  4. waitForFonts() - enhanced font loading (500ms + multiple reflows)
  5. Additional wait 200ms for GPU rendering
  6. html2canvas capture with scale: 3, letterRendering: true
  7. cleanupPdfOptimization(printableArea) - remove optimization classes
  8. Convert canvas to PNG
  9. Calculate dimensions for A4 print safe area
  10. Add image to PDF
→ Save PDF file
```

## Data Models

No changes to data models. All changes are in presentation layer (CSS) and rendering logic (JavaScript).

## Error Handling

### Rendering Validation

**New Function:**
```javascript
const validateRendering = async (element: HTMLElement): Promise<boolean> => {
  // Check if all fonts are loaded
  if (document.fonts && document.fonts.status !== 'loaded') {
    console.warn('Fonts not fully loaded');
    return false;
  }

  // Check if element has proper dimensions
  const rect = element.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    console.warn('Element has zero dimensions');
    return false;
  }

  // Check if all images are loaded
  const images = element.querySelectorAll('img');
  const imageChecks = Array.from(images).map((img) => {
    return img.complete && img.naturalHeight !== 0;
  });

  if (imageChecks.some(check => !check)) {
    console.warn('Some images not fully loaded');
    return false;
  }

  return true;
};
```

## Testing Strategy

### Visual Regression Testing

1. **Test Case 1: Answer Line Alignment**
   - Create worksheet with counting exercise
   - Take screenshot of preview
   - Generate PDF
   - Compare answer line position in preview vs PDF
   - Verify: No vertical shift (tolerance: 0px)

2. **Test Case 2: Math Equation Alignment**
   - Create worksheet with addition/subtraction
   - Take screenshot of preview
   - Generate PDF
   - Compare border-bottom position in preview vs PDF
   - Verify: No vertical shift (tolerance: 0px)

3. **Test Case 3: Header Title Alignment**
   - Create worksheet with title "Latihan Hari Ini"
   - Take screenshot of preview
   - Generate PDF
   - Compare title vertical position in preview vs PDF
   - Verify: No vertical shift (tolerance: 0px)

4. **Test Case 4: Spelling Box Borders**
   - Create worksheet with spelling exercise
   - Take screenshot of preview
   - Generate PDF
   - Compare border-bottom alignment across all boxes
   - Verify: All borders perfectly horizontal (tolerance: 0px)

5. **Test Case 5: Pattern Exercise Alignment**
   - Create worksheet with pattern exercise
   - Take screenshot of preview
   - Generate PDF
   - Compare answer line alignment with emoji items
   - Verify: Perfect baseline alignment (tolerance: 0px)

### Cross-Browser Testing

- Test di Chrome (primary)
- Test di Firefox
- Test di Edge
- Compare rendering consistency

### Performance Testing

- Measure PDF generation time with scale 3 vs scale 2
- Verify memory usage doesn't exceed limits
- Test with complex worksheets (10+ exercises)

## Implementation Notes

### CSS Changes Priority

1. **High Priority:**
   - Convert all `pt` units to `px` for borders
   - Add `transform: translateZ(0)` to all elements with borders
   - Change `inline-block` to `inline-flex` for answer lines
   - Add explicit pixel heights instead of `em` units

2. **Medium Priority:**
   - Add `pdf-optimized` class system
   - Enhance font loading with explicit checks
   - Add pre-render optimization function

3. **Low Priority:**
   - Add rendering validation
   - Optimize performance for scale 3

### Backward Compatibility

All changes are non-breaking:
- CSS changes only affect rendering, not structure
- JavaScript changes are additive (new functions)
- Existing functionality remains intact

### Performance Considerations

- Scale 3 will increase capture time by ~30-50%
- Memory usage will increase by ~2x
- Trade-off is acceptable for pixel-perfect rendering
- Can add option for "Fast Mode" (scale 2) vs "Precision Mode" (scale 3)

## Design Decisions and Rationales

### Decision 1: Use scale 3 instead of scale 2

**Rationale:**
- Scale 2 causes sub-pixel positioning (0.5px shifts)
- Scale 3 provides 3x resolution, reducing sub-pixel issues
- Better precision for border and text rendering
- Trade-off: Slightly slower generation time

### Decision 2: Convert pt to px for borders

**Rationale:**
- `pt` (points) are designed for print but cause rounding errors in canvas
- `px` (pixels) are native to canvas, no conversion needed
- More predictable rendering in html2canvas
- Better alignment consistency

### Decision 3: Use inline-flex instead of inline-block

**Rationale:**
- Flexbox provides better baseline alignment control
- `align-items: baseline` is more reliable than `vertical-align: baseline`
- Better support in html2canvas
- More predictable rendering

### Decision 4: Add transform: translateZ(0)

**Rationale:**
- Forces GPU rendering layer
- Prevents sub-pixel anti-aliasing
- Ensures integer pixel positioning
- Better rendering consistency

### Decision 5: Explicit pixel heights instead of em

**Rationale:**
- `em` units can result in fractional pixels
- Explicit `px` values ensure integer positioning
- More predictable across different font sizes
- Better for canvas rendering

### Decision 6: Enhanced font loading with multiple reflows

**Rationale:**
- Single reflow not always sufficient for complex fonts (Arabic)
- Multiple reflows ensure complete rendering
- 500ms wait time accommodates slower font loading
- Better reliability across different network speeds

### Decision 7: Add onclone callback to html2canvas

**Rationale:**
- Allows optimization of cloned document before capture
- Can ensure fonts are loaded in cloned context
- Can force pixel-perfect positioning in clone
- Better control over rendering process

## Browser Compatibility

### Supported Browsers
- Chrome 80+ (primary target)
- Firefox 75+
- Edge 80+
- Safari 13+ (limited testing)

### Known Issues
- Safari: transform: translateZ(0) may cause flickering in preview (acceptable for PDF generation)
- Firefox: Slightly different baseline calculation (within 1px tolerance)
- Edge: Consistent with Chrome

### Fallback Strategies
- If scale 3 causes memory issues, fallback to scale 2
- If letterRendering: true causes issues, fallback to false
- Provide user option to choose rendering quality
