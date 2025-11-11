# JWT Decoder Feature

## Overview

Fitur JWT Decoder telah ditambahkan ke aplikasi Kids Worksheet Generator. Fitur ini memungkinkan pengguna untuk decode (membaca isi) JWT tokens secara visual melalui interface yang user-friendly.

## Apa itu JWT?

JWT (JSON Web Token) adalah standar terbuka (RFC 7519) yang mendefinisikan cara untuk mentransmisikan informasi secara aman antara pihak-pihak sebagai objek JSON. Token ini biasanya digunakan untuk autentikasi dan pertukaran informasi.

Struktur JWT terdiri dari 3 bagian yang dipisahkan oleh titik (.):
```
header.payload.signature
```

## Fitur

### 1. Decode JWT Token
- Masukkan JWT token ke dalam text area
- Klik tombol "🔓 Decode Token" untuk melihat isi token
- Token akan di-decode menjadi 3 bagian: Header, Payload, dan Signature

### 2. Informasi Token Status
- **Issued At**: Waktu kapan token dibuat
- **Expires At**: Waktu kapan token akan kadaluarsa
- **Status**: Menunjukkan apakah token masih valid atau sudah expired

### 3. Detail Header
Menampilkan informasi algoritma dan tipe token:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### 4. Detail Payload
Menampilkan data yang tersimpan dalam token, seperti:
- `iss` (Issuer): Penerbit token
- `sub` (Subject): Subjek token
- `aud` (Audience): Target audiens
- `exp` (Expiration Time): Waktu kadaluarsa
- `iat` (Issued At): Waktu pembuatan
- `role`: Role pengguna (untuk Supabase)
- `ref`: Reference ID (untuk Supabase)
- Dan field custom lainnya

### 5. Signature
Menampilkan signature token yang digunakan untuk verifikasi integritas.

## Cara Menggunakan

### Di UI Web:
1. Buka aplikasi di browser
2. Scroll ke bagian "JWT Token Decoder" di bagian atas halaman
3. Paste JWT token Anda ke dalam text area
4. Klik tombol "🔓 Decode Token"
5. Lihat hasil decode di bawahnya

### Programmatically:

```typescript
import { decodeJWT, isTokenExpired, getTokenExpirationDate } from './utils/jwtDecoder';

// Decode token
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const decoded = decodeJWT(token);

console.log('Header:', decoded.header);
console.log('Payload:', decoded.payload);
console.log('Signature:', decoded.signature);

// Check if token is expired
const expired = isTokenExpired(token);
console.log('Is expired?', expired);

// Get expiration date
const expDate = getTokenExpirationDate(token);
console.log('Expires at:', expDate);
```

## Contoh Token Supabase

Token yang Anda berikan adalah Supabase anon key:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqZnR2c296Y2pkbGlsc3J1Y2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MjM5NTgsImV4cCI6MjA3ODM5OTk1OH0.UkjIWaYmsFzAjZD0j2txJGFjSv3D0XVF9ugLhE929-s
```

Hasil decode:

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "iss": "supabase",
  "ref": "hjftvsozxjdlilsruccj",
  "role": "anon",
  "iat": 1762823958,
  "exp": 2078399958
}
```

**Informasi:**
- **Issuer**: supabase
- **Reference**: hjftvsozxjdlilsruccj
- **Role**: anon (anonymous/public access)
- **Issued At**: November 11, 2025, 08:05:58
- **Expires At**: November 11, 2035, 09:59:18
- **Status**: ✅ VALID (berlaku selama 10 tahun)

## Security Notice ⚠️

**PENTING:**
- JWT tokens dapat di-decode oleh siapapun (bukan enkripsi!)
- Jangan pernah menyimpan informasi sensitif dalam JWT payload
- Signature hanya bisa diverifikasi dengan secret key di server
- Decoder ini hanya untuk membaca isi token, tidak memverifikasi signature
- Selalu verifikasi signature di server sebelum mempercayai isi token

## API Functions

### `decodeJWT(token: string): DecodedJWT`
Decode JWT token dan return object dengan header, payload, signature.

### `isTokenExpired(token: string | JWTPayload): boolean`
Check apakah token sudah expired.

### `getTokenExpirationDate(token: string | JWTPayload): Date | null`
Get tanggal expiration token.

### `getTokenIssuedDate(token: string | JWTPayload): Date | null`
Get tanggal pembuatan token.

### `formatJWTInfo(token: string): string`
Format informasi token menjadi string yang readable.

## Files Added

1. **`/utils/jwtDecoder.ts`** - Core utility functions untuk decode JWT
2. **`/components/JWTDecoder.tsx`** - React component untuk UI decoder
3. **`/utils/jwtDecoder.test.ts`** - Demo dan test untuk JWT decoder

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS (untuk styling)
- Pure JavaScript (tidak ada external dependencies untuk JWT decoding)

## Browser Compatibility

JWT Decoder menggunakan:
- `atob()` untuk Base64 decoding (supported di semua modern browsers)
- Native JavaScript untuk parsing JSON
- No external dependencies required

## Future Improvements

Possible enhancements:
- [ ] JWT token validation (dengan public key verification)
- [ ] Support untuk berbagai algoritma signature (RS256, ES256, dll)
- [ ] Token generation feature
- [ ] Save/load token history
- [ ] Export decoded token ke JSON file
- [ ] QR code generation untuk token
