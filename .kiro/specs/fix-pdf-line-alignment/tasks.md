# Implementation Plan

- [x] 1. Fix CSS untuk answer-line class di index.html


  - Update `.answer-line` class untuk menggunakan `vertical-align: baseline`
  - Hapus `position: relative` dan `bottom: -3px`
  - Tambahkan `height: 1em` dan `line-height: 1`
  - Hapus `padding-bottom: 2px` yang tidak diperlukan
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.2, 5.3, 5.4_

- [x] 2. Fix alignment untuk math equation answer lines

  - [x] 2.1 Tambahkan utility class `.align-baseline` di index.html


    - Buat class baru dengan `vertical-align: baseline`, `height: 1.2em`, `line-height: 1`
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 2.2 Update PreviewPanel.tsx untuk addition exercise


    - Tambahkan class `align-baseline` pada span dengan `border-b-3` di addition exercise
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 2.3 Update PreviewPanel.tsx untuk subtraction exercise

    - Tambahkan class `align-baseline` pada span dengan `border-b-3` di subtraction exercise
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3. Fix alignment untuk pattern exercise answer line


  - Tambahkan class `align-baseline` pada span dengan `border-b-3` di pattern exercise
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 4. Fix spelling exercise boxes border alignment

  - [x] 4.1 Update flexbox alignment di spelling exercise boxes


    - Ubah dari `items-center` ke `items-end` di div kotak spelling
    - Tambahkan `pb-1` untuk padding bottom yang konsisten
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 5. Verify dan test semua perubahan


  - [x] 5.1 Test counting exercise di preview dan PDF






    - Buat worksheet dengan counting exercise
    - Download PDF dan verify garis sejajar dengan teks
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [x] 5.2 Test math exercises di preview dan PDF




  - [ ] 5.2 Test math exercises di preview dan PDF


    - Buat worksheet dengan addition dan subtraction
    - Download PDF dan verify garis sejajar dengan angka
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  

  - [x] 5.3 Test pattern exercise di preview dan PDF





    - Buat worksheet dengan pattern exercise
    - Download PDF dan verify garis sejajar dengan emoji
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 5.4 Test spelling exercise di preview dan PDF






    - Buat worksheet dengan spelling exercise
    - Download PDF dan verify border boxes sejajar
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [x] 5.5 Test header lines di preview dan PDF






    - Buat worksheet dan verify garis nama/kelas sejajar
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
