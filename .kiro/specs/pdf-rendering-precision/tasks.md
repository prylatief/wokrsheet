# Implementation Plan

- [x] 1. Update CSS untuk pixel-perfect rendering





  - Convert semua border units dari `pt` ke `px` di index.html
  - Tambahkan `transform: translateZ(0)` dan `backface-visibility: hidden` untuk force GPU rendering
  - Update `.answer-line` class: change `inline-block` ke `inline-flex`, set explicit pixel heights
  - Update `.align-baseline` class: change `inline-block` ke `inline-flex`, set explicit pixel heights
  - Update `.border-b-3` class: add transform dan backface-visibility
  - Tambahkan `.pdf-optimized` utility class untuk pre-render optimization
  - Add transform optimization untuk `.exercise-card` dan header elements
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3_

- [x] 2. Enhance html2canvas configuration di App.tsx






  - [x] 2.1 Update html2canvas scale dari 2 ke 3

    - Modify handleExportPdf function untuk menggunakan scale: 3
    - Update letterRendering dari false ke true
    - _Requirements: 1.4, 4.3, 7.1, 7.2_
  

  - [x] 2.2 Add onclone callback untuk optimize cloned document

    - Implement onclone callback di html2canvas options
    - Force pixel-perfect rendering di cloned document
    - Ensure fonts loaded di cloned context
    - _Requirements: 1.4, 6.1, 6.2_
  

  - [x] 2.3 Disable foreignObjectRendering untuk better border rendering

    - Add foreignObjectRendering: false ke html2canvas options
    - _Requirements: 2.3, 4.2, 5.2_

- [x] 3. Enhance font loading function






  - [x] 3.1 Update waitForFonts function dengan explicit font checks

    - Add explicit loading checks untuk Poppins, Comic Neue, dan Amiri fonts
    - Load both normal dan bold weights untuk each font
    - _Requirements: 6.2, 6.3, 7.3_
  

  - [x] 3.2 Increase wait time dan add multiple reflows




    - Increase wait time dari 300ms ke 500ms
    - Add multiple reflows (3x) dengan delays
    - Add requestAnimationFrame untuk wait GPU rendering
    - _Requirements: 6.2, 6.3, 6.4_

- [x] 4. Implement pre-render optimization functions






  - [x] 4.1 Create optimizeForPdfRendering function

    - Add pdf-optimized class ke printable area dan all children
    - Force integer positioning untuk elements dengan borders
    - Force reflow after optimization
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 4.1, 4.2_
  

  - [x] 4.2 Create cleanupPdfOptimization function

    - Remove pdf-optimized class setelah capture
    - Cleanup inline styles yang ditambahkan
    - _Requirements: 6.1_

  
  - [x] 4.3 Integrate optimization functions ke PDF generation flow

    - Call optimizeForPdfRendering sebelum html2canvas capture
    - Call cleanupPdfOptimization setelah capture
    - Add additional 200ms wait setelah optimization
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 6.1, 6.2_

- [x] 5. Add rendering validation




  - [x] 5.1 Create validateRendering function


    - Check if all fonts are loaded
    - Check if element has proper dimensions
    - Check if all images are loaded
    - _Requirements: 6.4_
  
  - [x] 5.2 Integrate validation ke PDF generation flow


    - Call validateRendering sebelum html2canvas capture
    - Show warning jika validation fails
    - Allow user to retry atau continue
    - _Requirements: 6.4_

- [x] 6. Update PreviewPanel component untuk consistency





  - Add same CSS classes yang digunakan untuk PDF rendering
  - Ensure preview menggunakan same styling sebagai PDF
  - Update exercise rendering untuk use inline-flex instead of inline-block
  - _Requirements: 1.3, 2.4, 3.3, 6.1_

- [x] 7. Test dan verify pixel-perfect rendering




  - [x] 7.1 Test answer line alignment di counting exercise


    - Create worksheet dengan counting exercise
    - Generate PDF dan compare dengan preview
    - Verify garis sejajar dengan teks (tolerance: 0px)
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [x] 7.2 Test math equation border alignment

    - Create worksheet dengan addition dan subtraction
    - Generate PDF dan compare dengan preview
    - Verify border-bottom sejajar dengan angka (tolerance: 0px)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 7.3 Test header title positioning

    - Create worksheet dengan title "Latihan Hari Ini"
    - Generate PDF dan compare dengan preview
    - Verify title tidak turun atau naik (tolerance: 0px)
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [x] 7.4 Test spelling box borders

    - Create worksheet dengan spelling exercise
    - Generate PDF dan compare dengan preview
    - Verify semua borders lurus dan sejajar (tolerance: 0px)
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [x] 7.5 Test pattern exercise alignment

    - Create worksheet dengan pattern exercise
    - Generate PDF dan compare dengan preview
    - Verify answer line sejajar dengan emoji items (tolerance: 0px)
    - _Requirements: 1.1, 1.2, 2.1, 2.2_
  
  - [x] 7.6 Cross-browser testing

    - Test PDF generation di Chrome, Firefox, dan Edge
    - Verify consistency across browsers
    - Document any browser-specific issues
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [x] 7.7 Performance testing dengan scale 3

    - Measure PDF generation time dengan scale 3 vs scale 2
    - Verify memory usage tidak exceed limits
    - Test dengan complex worksheets (10+ exercises)
    - _Requirements: 4.3, 7.1_
