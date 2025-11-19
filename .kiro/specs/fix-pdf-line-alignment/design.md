# Design Document

## Overview

Masalah garis yang tidak lurus di PDF disebabkan oleh beberapa faktor:
1. Penggunaan `vertical-align: text-bottom` dan `position: relative; bottom: -3px` pada `.answer-line` yang menyebabkan inkonsistensi
2. Penggunaan `inline-block` dengan `border-bottom` yang tidak sejajar dengan baseline teks
3. Sub-pixel rendering issues saat html2canvas melakukan capture dengan scale 2
4. Mixing antara unit `pt` dan `px` yang menyebabkan rounding errors

Solusi yang akan diterapkan:
1. Menggunakan `vertical-align: baseline` untuk semua answer lines
2. Menghapus positioning relatif yang menyebabkan shift
3. Menggunakan flexbox alignment untuk memastikan baseline alignment
4. Memastikan semua border menggunakan unit yang konsisten
5. Menyesuaikan padding dan margin untuk alignment yang tepat

## Architecture

### Component Structure

```
PreviewPanel
├── ExerciseRenderer
│   ├── Counting Exercise (dengan answer line)
│   ├── Addition/Subtraction Exercise (dengan answer line)
│   ├── Pattern Exercise (dengan answer line)
│   ├── Spelling Exercise (dengan border-bottom boxes)
│   └── Other Exercises
└── Worksheet Header (dengan answer lines untuk nama/kelas)
```

### CSS Architecture

```
index.html (Global Styles)
├── .answer-line (untuk garis jawaban)
├── .border-b-3 (untuk border bawah)
├── .trace-text (untuk teks tebal)
└── Print-specific styles (@media print)
```

## Components and Interfaces

### 1. Answer Line Component (CSS Class)

**Current Implementation:**
```css
.answer-line {
  border-bottom-width: 2pt;
  border-bottom-style: solid;
  border-bottom-color: #4b5563;
  display: inline-block;
  vertical-align: text-bottom;  /* ❌ Masalah */
  margin-left: 0.5rem;
  padding-bottom: 2px;
  position: relative;
  bottom: -3px;  /* ❌ Masalah */
}
```

**New Implementation:**
```css
.answer-line {
  border-bottom-width: 2pt;
  border-bottom-style: solid;
  border-bottom-color: #4b5563;
  display: inline-block;
  vertical-align: baseline;  /* ✅ Fix */
  margin-left: 0.5rem;
  height: 1em;  /* ✅ Consistent height */
  line-height: 1;  /* ✅ Prevent line-height issues */
}
```

### 2. Border Bottom for Math Equations

**Current Implementation:**
```jsx
<span className="inline-block border-b-3 border-slate-700 w-32 print:w-24"></span>
```

**Issue:** `inline-block` dengan `border-b-3` tidak sejajar dengan angka di sebelahnya

**New Implementation:**
```jsx
<span className="inline-block border-b-3 border-slate-700 w-32 print:w-24 align-baseline"></span>
```

**New CSS Class:**
```css
.align-baseline {
  vertical-align: baseline;
  height: 1.2em;
  line-height: 1;
}
```

### 3. Spelling Exercise Boxes

**Current Implementation:**
```jsx
<div className="w-14 h-14 border-b-3 border-slate-700 flex items-center justify-center">
```

**Issue:** Border bottom tidak konsisten karena flex alignment

**New Implementation:**
```jsx
<div className="w-14 h-14 border-b-3 border-slate-700 flex items-end justify-center pb-1">
```

**Explanation:** Menggunakan `items-end` dan `pb-1` untuk memastikan border selalu di bawah dengan jarak yang konsisten

### 4. Header Answer Lines

**Current Implementation:**
```jsx
<span className="answer-line border-purple-400 w-56 print:w-40"></span>
```

**New Implementation:**
```jsx
<span className="answer-line-header border-purple-400 w-56 print:w-40"></span>
```

**New CSS Class:**
```css
.answer-line-header {
  border-bottom-width: 2pt;
  border-bottom-style: solid;
  display: inline-block;
  vertical-align: baseline;
  margin-left: 0.5rem;
  height: 1em;
  line-height: 1;
}
```

## Data Models

Tidak ada perubahan pada data models. Semua perubahan adalah pada presentasi layer (CSS dan JSX).

## Error Handling

### Potential Issues and Solutions

1. **Issue:** Browser rendering differences
   - **Solution:** Menggunakan unit `pt` yang lebih konsisten across browsers dan PDF

2. **Issue:** html2canvas scale causing blur
   - **Solution:** Sudah menggunakan scale 2 yang optimal. Tidak perlu diubah.

3. **Issue:** Font loading timing
   - **Solution:** Sudah ada `waitForFonts()` function. Tidak perlu diubah.

4. **Issue:** Print media query conflicts
   - **Solution:** Memastikan print styles tidak override alignment fixes

## Testing Strategy

### Visual Testing

1. **Test Case 1: Counting Exercise**
   - Buat worksheet dengan counting exercise
   - Download PDF
   - Verify: Garis "Jumlah:" sejajar dengan teks

2. **Test Case 2: Math Exercise**
   - Buat worksheet dengan addition dan subtraction
   - Download PDF
   - Verify: Garis jawaban sejajar dengan angka dan operator

3. **Test Case 3: Pattern Exercise**
   - Buat worksheet dengan pattern exercise
   - Download PDF
   - Verify: Garis jawaban sejajar dengan emoji pattern

4. **Test Case 4: Spelling Exercise**
   - Buat worksheet dengan spelling exercise
   - Download PDF
   - Verify: Semua kotak memiliki border bottom yang sejajar

5. **Test Case 5: Header Lines**
   - Buat worksheet dengan nama dan kelas
   - Download PDF
   - Verify: Garis nama dan kelas sejajar dengan teks

### Cross-Browser Testing

- Test di Chrome (primary)
- Test di Firefox
- Test di Edge

### Print Testing

- Test dengan berbagai zoom levels
- Test dengan berbagai page sizes
- Verify consistency antara preview dan PDF

## Implementation Notes

### CSS Changes Priority

1. **High Priority:**
   - Fix `.answer-line` vertical alignment
   - Fix math equation border alignment
   - Fix spelling boxes border alignment

2. **Medium Priority:**
   - Fix header answer lines
   - Add new utility classes

3. **Low Priority:**
   - Optimize print styles
   - Add documentation comments

### Backward Compatibility

Semua perubahan CSS bersifat non-breaking karena:
- Hanya mengubah styling, tidak mengubah structure
- Tidak menghapus class yang sudah ada
- Menambahkan class baru untuk specific cases

### Performance Considerations

- CSS changes tidak mempengaruhi performance
- html2canvas rendering time tetap sama
- PDF generation time tidak berubah

## Design Decisions and Rationales

### Decision 1: Menggunakan `vertical-align: baseline`

**Rationale:**
- `baseline` adalah alignment yang paling konsisten untuk inline elements
- `text-bottom` menyebabkan shift yang berbeda tergantung font metrics
- `baseline` bekerja dengan baik di semua browser dan PDF renderer

### Decision 2: Menghapus `position: relative; bottom: -3px`

**Rationale:**
- Positioning relatif menyebabkan sub-pixel rendering issues
- html2canvas tidak selalu merender positioning relatif dengan akurat
- Lebih baik menggunakan vertical-align dan padding untuk positioning

### Decision 3: Menggunakan `height: 1em` untuk answer lines

**Rationale:**
- `1em` memberikan height yang proporsional dengan font size
- Memastikan garis tidak terlalu tinggi atau rendah
- Konsisten dengan line-height dari teks di sekitarnya

### Decision 4: Menggunakan `items-end` untuk spelling boxes

**Rationale:**
- Flexbox `items-end` memastikan border selalu di bawah
- Lebih reliable daripada menggunakan `items-center` dengan border-bottom
- Memberikan visual yang lebih baik untuk writing space

### Decision 5: Tetap menggunakan unit `pt` untuk borders

**Rationale:**
- `pt` (points) adalah unit yang designed untuk print
- Lebih konsisten dalam PDF rendering
- Sudah digunakan di codebase, tidak perlu diubah
