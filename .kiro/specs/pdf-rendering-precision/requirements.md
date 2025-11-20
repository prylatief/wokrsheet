# Requirements Document

## Introduction

Memperbaiki masalah presisi rendering PDF dimana hasil PDF tidak sesuai dengan preview. Masalah spesifik yang terjadi:
1. Garis jawaban tidak lurus/sejajar dengan teks di PDF padahal di preview sudah bagus
2. Garis di latihan tidak sejajar dengan elemen lainnya
3. Judul "Latihan Hari Ini" posisinya turun sedikit di PDF padahal di preview sudah di tengah
4. Border dan garis mengalami sub-pixel shift saat di-render ke PDF

## Glossary

- **html2canvas**: Library yang digunakan untuk menangkap tampilan HTML dan mengkonversinya menjadi canvas
- **Sub-pixel Rendering**: Rendering yang terjadi pada posisi pecahan pixel, menyebabkan blur atau shift
- **Baseline Alignment**: Posisi vertikal elemen relatif terhadap baseline teks
- **Canvas Scale**: Faktor perbesaran saat menangkap HTML ke canvas (saat ini menggunakan scale 2)
- **PDF Renderer**: Sistem yang mengkonversi canvas menjadi PDF menggunakan jsPDF
- **Answer Line**: Garis horizontal yang digunakan sebagai tempat menulis jawaban
- **Border Bottom**: Properti CSS untuk membuat garis di bawah elemen
- **Print Safe Area**: Area yang aman untuk dicetak tanpa terpotong (180mm x 257mm untuk A4)

## Requirements

### Requirement 1

**User Story:** Sebagai pengguna, saya ingin garis jawaban di PDF sejajar dengan teks seperti di preview, sehingga hasil PDF terlihat profesional dan rapi

#### Acceptance Criteria

1. WHEN THE PDF Renderer menangkap tampilan dengan html2canvas, THE Answer Line SHALL tetap sejajar dengan baseline teks
2. THE Answer Line SHALL tidak mengalami vertical shift saat di-render ke canvas
3. THE Answer Line SHALL memiliki posisi yang identik antara preview dan PDF
4. THE PDF Renderer SHALL menggunakan rendering settings yang mencegah sub-pixel shift

### Requirement 2

**User Story:** Sebagai pengguna, saya ingin garis di latihan matematika sejajar dengan angka dan operator di PDF, sehingga persamaan terlihat benar

#### Acceptance Criteria

1. WHEN THE PDF Renderer menangkap latihan matematika, THE Border Bottom SHALL sejajar dengan baseline angka
2. THE Border Bottom SHALL tidak bergeser ke atas atau ke bawah di PDF
3. THE Border Bottom SHALL memiliki ketebalan yang sama di preview dan PDF
4. THE PDF Renderer SHALL mempertahankan alignment yang tepat untuk semua elemen inline

### Requirement 3

**User Story:** Sebagai pengguna, saya ingin judul worksheet tetap di posisi tengah di PDF seperti di preview, sehingga header terlihat rapi

#### Acceptance Criteria

1. WHEN THE PDF Renderer menangkap header worksheet, THE judul SHALL tetap di posisi vertikal yang sama seperti preview
2. THE judul SHALL tidak turun atau naik saat di-render ke PDF
3. THE header alignment SHALL konsisten antara preview dan PDF
4. THE PDF Renderer SHALL mempertahankan flexbox alignment dengan akurat

### Requirement 4

**User Story:** Sebagai pengguna, saya ingin semua border dan garis di PDF memiliki posisi yang presisi, sehingga tidak ada elemen yang terlihat miring atau tidak lurus

#### Acceptance Criteria

1. THE PDF Renderer SHALL menggunakan integer positioning untuk semua border
2. THE PDF Renderer SHALL menghindari sub-pixel rendering untuk garis dan border
3. THE PDF Renderer SHALL menggunakan scale factor yang optimal untuk presisi rendering
4. WHEN THE html2canvas menangkap tampilan, THE rendering SHALL menggunakan settings yang mencegah anti-aliasing issues

### Requirement 5

**User Story:** Sebagai pengguna, saya ingin kotak jawaban di latihan mengeja memiliki border yang lurus dan sejajar di PDF, sehingga anak-anak dapat menulis dengan rapi

#### Acceptance Criteria

1. WHEN THE PDF Renderer menangkap latihan mengeja, THE Border Bottom dari kotak SHALL lurus dan horizontal
2. THE Border Bottom SHALL sejajar di semua kotak jawaban
3. THE Border Bottom SHALL tidak mengalami vertical misalignment di PDF
4. THE PDF Renderer SHALL mempertahankan grid alignment dengan presisi

### Requirement 6

**User Story:** Sebagai pengguna, saya ingin hasil PDF identik dengan preview yang saya lihat, sehingga tidak ada kejutan saat mencetak

#### Acceptance Criteria

1. THE PDF Renderer SHALL menggunakan rendering settings yang konsisten dengan browser rendering
2. THE PDF Renderer SHALL menangkap tampilan setelah semua font dan style dimuat dengan sempurna
3. THE PDF Renderer SHALL menggunakan timing yang tepat untuk menghindari incomplete rendering
4. THE PDF Renderer SHALL memvalidasi hasil rendering sebelum membuat PDF

### Requirement 7

**User Story:** Sebagai pengguna, saya ingin text rendering di PDF tetap crisp dan tidak blur, sehingga mudah dibaca saat dicetak

#### Acceptance Criteria

1. THE PDF Renderer SHALL menggunakan scale factor yang optimal untuk text clarity
2. THE PDF Renderer SHALL menggunakan letterRendering setting yang tepat
3. THE PDF Renderer SHALL mempertahankan font weight dan style dengan akurat
4. THE PDF Renderer SHALL tidak menyebabkan text blur atau anti-aliasing artifacts
