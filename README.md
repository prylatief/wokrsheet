<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Kids Worksheet Generator 📝

Generator lembar kerja interaktif untuk anak-anak dengan autentikasi Supabase.

## ⚠️ SETUP PENTING (WAJIB!)

**Login tidak akan berfungsi jika file `.env` tidak dibuat!**

## Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd wokrsheet
npm install
```

### 2. Setup Environment Variables

**PENTING:** Copy file `.env.example` menjadi `.env`

```bash
cp .env.example .env
```

File `.env` harus berisi:
```
VITE_SUPABASE_URL=https://hjftvsozcjdlilsruccj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Jalankan Aplikasi

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## 🎯 Demo Account

Akun demo tersedia untuk testing:

- **Email:** `latief@email.com`
- **Password:** `zxcvbnm`

### Cara Menggunakan:

1. Buka aplikasi di browser
2. Klik panel **"Demo Account Setup"** di pojok kanan bawah
3. Klik **"Buat Akun Demo"**
4. Login menggunakan kredensial di atas, atau klik **"Isi Kredensial Demo"**

Untuk panduan lengkap, lihat [DEMO_ACCOUNT.md](DEMO_ACCOUNT.md)

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Authentication:** Supabase Auth
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## 📁 Project Structure

```
wokrsheet/
├── components/          # React components
│   ├── LoginPage.tsx   # Login form
│   ├── RegisterPage.tsx # Registration form
│   ├── DemoAccountSetup.tsx # Demo account creation
│   └── UserProfile.tsx # User profile display
├── lib/
│   ├── supabase.ts     # Supabase client
│   └── AuthContext.tsx # Auth state management
├── App.tsx             # Main app with routing
├── .env.example        # Environment variables template
└── DEMO_ACCOUNT.md     # Demo account documentation

```

## 🐛 Troubleshooting

### Login Tidak Berfungsi

**Penyebab:** File `.env` tidak ada

**Solusi:**
```bash
cp .env.example .env
# Restart dev server
npm run dev
```

### Cek di Browser Console

1. Buka Developer Tools (F12)
2. Lihat tab Console
3. Jika ada warning `"Missing Supabase environment variables"` → file `.env` tidak ter-load

Untuk troubleshooting lengkap, lihat [DEMO_ACCOUNT.md](DEMO_ACCOUNT.md)

## 📝 Available Scripts

- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔗 Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Vercel Deployment](https://vercel.com)
