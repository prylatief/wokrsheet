# Implementation Plan

- [x] 1. Buat AuthContext dan AuthProvider untuk state management autentikasi





  - Buat file `lib/AuthContext.tsx` dengan Context API
  - Implementasi interface `AuthContextType` dengan user state, loading state, dan auth methods
  - Implementasi `signUp` method yang memanggil `supabase.auth.signUp()`
  - Implementasi `signIn` method yang memanggil `supabase.auth.signInWithPassword()`
  - Implementasi `signOut` method yang memanggil `supabase.auth.signOut()`
  - Setup listener untuk `onAuthStateChange` dari Supabase untuk auto-update user state
  - Implementasi session persistence dengan `getSession()` saat aplikasi dimuat
  - _Requirements: 2.1, 2.2, 2.5, 3.1, 3.3, 4.1, 4.2, 4.3, 4.4_

- [x] 2. Buat komponen LoginPage dengan form dan validasi





  - Buat file `components/LoginPage.tsx` dengan form login
  - Implementasi input field untuk email dan password
  - Implementasi client-side validation untuk format email
  - Implementasi client-side validation untuk password minimal 6 karakter
  - Implementasi error state untuk menampilkan pesan error
  - Implementasi loading state saat proses login
  - Integrasikan dengan `signIn` method dari AuthContext
  - Implementasi error handling dengan pesan dalam Bahasa Indonesia
  - Tambahkan link navigasi ke halaman register
  - Styling dengan Tailwind CSS sesuai tema aplikasi (gradient purple-pink, rounded corners, shadows)
  - _Requirements: 2.1, 2.3, 2.4_

- [x] 3. Buat komponen RegisterPage dengan form registrasi





  - Buat file `components/RegisterPage.tsx` dengan form registrasi
  - Implementasi input field untuk email, password, dan konfirmasi password
  - Implementasi client-side validation untuk format email
  - Implementasi client-side validation untuk password minimal 6 karakter
  - Implementasi validation untuk password confirmation matching
  - Implementasi error state untuk menampilkan pesan error
  - Implementasi loading state saat proses registrasi
  - Integrasikan dengan `signUp` method dari AuthContext
  - Implementasi error handling untuk email yang sudah terdaftar
  - Tambahkan success message dan redirect ke login setelah registrasi berhasil
  - Tambahkan link navigasi ke halaman login
  - Styling dengan Tailwind CSS sesuai tema aplikasi
  - _Requirements: 1.1, 1.3, 1.4, 1.5_

- [x] 4. Buat komponen UserProfile untuk menampilkan info user di header





  - Buat file `components/UserProfile.tsx`
  - Implementasi tampilan email pengguna yang sedang login
  - Implementasi avatar atau initial dari email pengguna
  - Implementasi tombol logout yang memanggil `signOut` dari AuthContext
  - Implementasi conditional rendering (hanya tampil jika user sudah login)
  - Styling dengan Tailwind CSS sesuai tema aplikasi
  - _Requirements: 3.1, 3.2, 5.1, 5.2, 5.3, 5.4_

- [x] 5. Modifikasi App.tsx untuk implementasi protected routes dan routing





  - Wrap aplikasi dengan `AuthProvider` di root level
  - Implementasi conditional rendering berdasarkan auth state
  - Jika user belum login, tampilkan LoginPage atau RegisterPage
  - Jika user sudah login, tampilkan main application (worksheet generator)
  - Implementasi simple routing logic untuk switch antara login dan register page
  - Integrasikan komponen UserProfile ke dalam header aplikasi
  - Implementasi loading state saat memeriksa session
  - _Requirements: 2.4, 3.4, 4.1, 4.2, 4.3_

- [ ]* 6. Testing dan validasi fitur autentikasi
  - Test registrasi dengan email baru
  - Test registrasi dengan email yang sudah ada (harus error)
  - Test login dengan kredensial yang benar
  - Test login dengan kredensial yang salah (harus error)
  - Test session persistence setelah refresh browser
  - Test logout functionality dan redirect ke login
  - Test protected routes tidak bisa diakses tanpa login
  - Test email validation di form
  - Test password validation di form
  - Verify error messages ditampilkan dengan jelas
  - _Requirements: All requirements_
