# Setup Stack Auth untuk Worksheet Generator

## Informasi Project

- **Project ID**: `0ecf147b-389f-4d64-b1ba-c27b528838d9`
- **JWKS URL**: `https://api.stack-auth.com/api/v1/projects/0ecf147b-389f-4d64-b1ba-c27b528838d9/.well-known/jwks.json`

## Langkah-langkah Setup

### 1. Konfigurasi di Stack Auth Dashboard

1. Login ke [Stack Auth Dashboard](https://app.stack-auth.com)
2. Pilih project dengan ID: `0ecf147b-389f-4d64-b1ba-c27b528838d9`
3. Aktifkan OAuth providers yang diinginkan (Google, GitHub, dll)
4. Konfigurasi redirect URLs:
   - Development: `http://localhost:3000`
   - Production: [URL production Anda]

### 2. Environment Variables (Opsional)

Jika diperlukan publishable client key, tambahkan ke `.env.local`:

```bash
VITE_STACK_PROJECT_ID=0ecf147b-389f-4d64-b1ba-c27b528838d9
VITE_STACK_PUBLISHABLE_CLIENT_KEY=your-publishable-key-here
```

### 3. Menjalankan Aplikasi

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Fitur Autentikasi

### Login Methods

1. **Email/Password**: Login tradisional dengan email dan password
2. **Google OAuth**: Login cepat menggunakan akun Google
3. **Sign Up**: Redirect ke halaman pendaftaran Stack Auth

### Protected Routes

Seluruh aplikasi worksheet generator dilindungi dengan autentikasi. User harus login terlebih dahulu untuk mengakses fitur-fitur berikut:

- Membuat worksheet
- Mengedit latihan
- Export PDF
- Menyimpan konfigurasi

### User Info Display

Di header aplikasi, akan ditampilkan:
- Nama user atau email
- Tombol logout untuk keluar dari aplikasi

## Troubleshooting

### Error: "Invalid project ID"
- Pastikan project ID sudah benar di `stack.ts`
- Cek apakah project masih aktif di Stack Auth dashboard

### Error: "OAuth provider not configured"
- Login ke Stack Auth dashboard
- Aktifkan OAuth provider yang diinginkan
- Tambahkan redirect URLs yang sesuai

### Error: "User not authenticated"
- Clear browser cache dan cookies
- Coba login ulang
- Pastikan cookies tidak diblokir oleh browser

## Stack Auth Documentation

Untuk informasi lebih lanjut, kunjungi:
- [Stack Auth Docs](https://docs.stack-auth.com)
- [Stack Auth GitHub](https://github.com/stack-auth/stack)
