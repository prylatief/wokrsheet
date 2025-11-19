# Requirements Document

## Introduction

Memperbaiki masalah garis yang tidak lurus/sejajar dengan teks pada hasil download PDF. Masalah ini terjadi pada:
1. Garis jawaban di latihan menghitung (counting exercise)
2. Garis jawaban di latihan penjumlahan dan pengurangan (addition/subtraction)
3. Garis jawaban di latihan pola (pattern exercise)
4. Kotak jawaban di latihan mengeja (spelling exercise)
5. Garis nama dan kelas di header worksheet

## Glossary

- **PDF Generator**: Sistem yang menggunakan html2canvas dan jsPDF untuk menghasilkan file PDF dari tampilan HTML
- **Answer Line**: Garis horizontal yang digunakan sebagai tempat menulis jawaban
- **Exercise Card**: Komponen kartu yang menampilkan satu latihan
- **Worksheet Header**: Bagian atas worksheet yang berisi nama, kelas, dan judul
- **Vertical Alignment**: Posisi vertikal elemen relatif terhadap baseline teks
- **Border Bottom**: Properti CSS untuk membuat garis di bawah elemen

## Requirements

### Requirement 1

**User Story:** Sebagai pengguna, saya ingin garis jawaban di latihan menghitung sejajar dengan teks "Jumlah:", sehingga hasil PDF terlihat rapi dan profesional

#### Acceptance Criteria

1. WHEN THE PDF Generator merender latihan menghitung, THE Answer Line SHALL sejajar dengan baseline teks "Jumlah:"
2. THE Answer Line SHALL memiliki jarak yang konsisten dari teks di sebelahnya
3. THE Answer Line SHALL mempertahankan ketebalan garis yang sama di layar dan PDF
4. THE Answer Line SHALL tidak bergeser posisinya saat di-render ke PDF

### Requirement 2

**User Story:** Sebagai pengguna, saya ingin garis jawaban di latihan penjumlahan/pengurangan sejajar dengan angka dan operator, sehingga persamaan matematika terlihat benar

#### Acceptance Criteria

1. WHEN THE PDF Generator merender latihan matematika, THE Answer Line SHALL sejajar dengan baseline angka dan operator matematika
2. THE Answer Line SHALL memiliki lebar yang konsisten
3. THE Answer Line SHALL tidak bergeser ke atas atau ke bawah relatif terhadap angka
4. THE Answer Line SHALL terlihat sebagai bagian yang natural dari persamaan matematika

### Requirement 3

**User Story:** Sebagai pengguna, saya ingin garis jawaban di latihan pola sejajar dengan item pola, sehingga latihan terlihat teratur

#### Acceptance Criteria

1. WHEN THE PDF Generator merender latihan pola, THE Answer Line SHALL sejajar dengan baseline item pola (emoji)
2. THE Answer Line SHALL memiliki jarak yang sama dengan jarak antar item pola
3. THE Answer Line SHALL tidak terlihat lebih tinggi atau lebih rendah dari item pola

### Requirement 4

**User Story:** Sebagai pengguna, saya ingin kotak jawaban di latihan mengeja sejajar dengan garis bawahnya, sehingga anak-anak dapat menulis dengan rapi

#### Acceptance Criteria

1. WHEN THE PDF Generator merender latihan mengeja, THE Border Bottom dari kotak jawaban SHALL berada di posisi yang konsisten
2. THE Border Bottom SHALL memiliki ketebalan yang sama untuk semua kotak
3. THE Border Bottom SHALL sejajar horizontal di semua kotak jawaban
4. THE Border Bottom SHALL tidak bergeser saat di-render ke PDF

### Requirement 5

**User Story:** Sebagai pengguna, saya ingin garis nama dan kelas di header worksheet sejajar dengan teksnya, sehingga header terlihat profesional

#### Acceptance Criteria

1. WHEN THE PDF Generator merender worksheet header, THE Answer Line untuk nama SHALL sejajar dengan teks "Nama:"
2. THE Answer Line untuk kelas SHALL sejajar dengan teks "Kelas:"
3. THE Answer Line di header SHALL memiliki ketebalan dan style yang konsisten
4. THE Answer Line di header SHALL tidak bergeser posisinya di PDF

### Requirement 6

**User Story:** Sebagai pengguna, saya ingin semua garis di PDF memiliki rendering yang konsisten, sehingga tidak ada perbedaan antara tampilan di layar dan di PDF

#### Acceptance Criteria

1. THE PDF Generator SHALL menggunakan unit yang konsisten untuk semua border dan garis
2. THE PDF Generator SHALL mempertahankan alignment yang sama antara preview dan PDF
3. THE PDF Generator SHALL tidak mengalami sub-pixel rendering issues
4. WHEN THE PDF Generator menggunakan html2canvas, THE scale setting SHALL menghasilkan garis yang lurus dan tidak blur
