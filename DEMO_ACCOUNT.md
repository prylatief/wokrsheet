# Demo Account Setup

## ⚠️ PENTING: Setup Awal

**SEBELUM menjalankan aplikasi, Anda HARUS membuat file `.env` terlebih dahulu!**

### Langkah Setup:

1. **Copy file `.env.example` menjadi `.env`**
   ```bash
   cp .env.example .env
   ```

2. **Verifikasi isi file `.env`**
   ```bash
   cat .env
   ```

   Pastikan berisi:
   ```
   VITE_SUPABASE_URL=https://hjftvsozcjdlilsruccj.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Jalankan aplikasi**
   ```bash
   npm run dev
   ```

## Kredensial Akun Demo

**Email:** `latief@email.com`
**Password:** `zxcvbnm`

## Cara Menggunakan Akun Demo

### Opsi 1: Membuat Akun Demo Melalui UI (Direkomendasikan)

1. Jalankan aplikasi dengan `npm run dev`
2. Buka aplikasi di browser
3. Di halaman login, Anda akan melihat panel "Demo Account Setup" di pojok kanan bawah
4. Klik tombol **"Buat Akun Demo"** untuk membuat akun
5. Setelah berhasil dibuat, gunakan kredensial di atas untuk login

### Opsi 2: Menggunakan Tombol Quick Login

1. Di halaman login, klik tombol **"Isi Kredensial Demo"** (🎯)
2. Form akan otomatis terisi dengan kredensial demo
3. Klik tombol **"Masuk"** untuk login

### Opsi 3: Login Manual

1. Di halaman login, masukkan:
   - Email: `latief@email.com`
   - Password: `zxcvbnm`
2. Klik tombol **"Masuk"**

## Fitur Demo Account

- **DemoAccountSetup Component**: Panel floating di pojok kanan bawah halaman login yang memungkinkan pembuatan akun demo dengan satu klik
- **Quick Fill Button**: Tombol "Isi Kredensial Demo" yang otomatis mengisi form login dengan kredensial demo
- **Auto-created**: Akun demo akan dibuat di Supabase saat pertama kali tombol diklik

## Troubleshooting

### ❌ Login Tidak Berfungsi / Akun Demo Tidak Bisa Dibuat

**Masalah Paling Umum:** File `.env` tidak ada!

**Solusi:**
```bash
# 1. Cek apakah file .env ada
ls -la | grep .env

# 2. Jika tidak ada, copy dari .env.example
cp .env.example .env

# 3. Restart development server
# Tekan Ctrl+C untuk stop, lalu:
npm run dev
```

**Cara Mengecek di Browser:**
1. Buka Developer Console (F12 atau Ctrl+Shift+I)
2. Lihat tab Console
3. Jika ada warning: `"Missing Supabase environment variables"` → berarti file `.env` tidak ada atau tidak ter-load
4. Ikuti solusi di atas, lalu refresh browser

### Akun Sudah Ada
Jika Anda melihat pesan "Akun demo sudah ada!", ini berarti akun telah berhasil dibuat sebelumnya. Anda dapat langsung login menggunakan kredensial di atas.

### Email Confirmation
Tergantung pada pengaturan Supabase Anda:
- Jika **email confirmation dinonaktifkan**: Anda dapat langsung login setelah akun dibuat
- Jika **email confirmation diaktifkan**: Anda perlu mengkonfirmasi email terlebih dahulu, atau nonaktifkan email confirmation di Supabase dashboard

### Error: "Email atau password salah"
Jika mendapat error ini saat login:
1. Pastikan akun sudah dibuat terlebih dahulu menggunakan panel "Demo Account Setup"
2. Pastikan kredensial yang dimasukkan benar:
   - Email: `latief@email.com`
   - Password: `zxcvbnm`
3. Cek browser console untuk error detail

### Network Error
Jika mendapat error koneksi:
1. Pastikan Anda terhubung ke internet
2. Pastikan Supabase project masih aktif
3. Cek URL Supabase di file `.env` masih valid

### Menonaktifkan Email Confirmation di Supabase

1. Buka Supabase Dashboard
2. Pilih project Anda
3. Pergi ke **Authentication** → **Settings**
4. Di bagian **Email Auth**, nonaktifkan **"Enable email confirmations"**
5. Simpan perubahan

Setelah itu, akun demo dapat langsung digunakan tanpa perlu konfirmasi email.

## Implementasi Teknis

### File yang Ditambahkan/Dimodifikasi:

1. **`components/DemoAccountSetup.tsx`** - Component baru untuk membuat akun demo
2. **`components/LoginPage.tsx`** - Ditambahkan:
   - Import DemoAccountSetup component
   - Tombol "Isi Kredensial Demo"
   - Handler `handleDemoLogin()` untuk auto-fill
3. **`scripts/create-demo-account.js`** - Script Node.js untuk membuat akun demo via command line (memerlukan koneksi internet)

### Cara Kerja:

1. Component `DemoAccountSetup` menggunakan `useAuth()` hook dari `AuthContext`
2. Memanggil fungsi `signUp(email, password)` dengan kredensial demo
3. Menangani error jika akun sudah ada (menampilkan pesan sukses)
4. Menampilkan status pembuatan akun dengan UI yang user-friendly

## Keamanan

⚠️ **PENTING**: Akun demo ini hanya untuk tujuan development dan testing. Jangan gunakan kredensial ini di production environment!

Untuk production:
- Hapus atau nonaktifkan fitur demo account
- Gunakan kredensial yang lebih kuat
- Implementasikan role-based access control (RBAC)
