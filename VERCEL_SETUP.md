# Vercel Deployment Setup

## Environment Variables

Untuk menjalankan aplikasi ini di Vercel, Anda perlu mengatur environment variables berikut:

### 1. Buka Vercel Dashboard
- Buka project Anda di [Vercel Dashboard](https://vercel.com/dashboard)
- Pilih project Anda
- Klik tab **Settings**
- Klik **Environment Variables** di sidebar

### 2. Tambahkan Environment Variables

Tambahkan variable berikut:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://hjftvsozcjdlilsruccj.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqZnR2c296Y2pkbGlsc3J1Y2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MjM5NTgsImV4cCI6MjA3ODM5OTk1OH0.UkjIWaYmsFzAjZD0j2txJGFjSv3D0XVF9ugLhE929-s` |

**PENTING:** Pilih **All Environments** (Production, Preview, Development) untuk setiap variable.

### 3. Redeploy

Setelah menambahkan environment variables:
1. Klik tab **Deployments**
2. Pilih deployment terbaru
3. Klik tombol **⋯** (three dots)
4. Pilih **Redeploy**

## Verifikasi

Aplikasi sekarang sudah bisa dibuka di Vercel. Jika masih ada masalah:

1. Cek browser console untuk error messages (F12)
2. Pastikan environment variables sudah ter-set dengan benar
3. Cek Vercel deployment logs untuk error details

## Build Configuration

Project ini menggunakan konfigurasi berikut (sudah diatur di `vercel.json`):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## Troubleshooting

### Blank Page
- Pastikan semua environment variables sudah diatur
- Cek browser console untuk error messages
- Redeploy setelah mengatur environment variables

### 404 Errors
- Vercel sudah dikonfigurasi untuk routing SPA dengan rewrites
- Semua routes akan diarahkan ke `index.html`

## Catatan

- App akan tetap bisa load meskipun environment variables tidak ada, tetapi fitur authentication tidak akan berfungsi
- Untuk development lokal, copy `.env.example` ke `.env` dan isi dengan nilai yang sesuai
