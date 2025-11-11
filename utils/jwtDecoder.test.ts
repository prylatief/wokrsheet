/**
 * JWT Decoder Test/Demo
 * Demonstrates how to use the JWT decoder utility
 */

import { decodeJWT, isTokenExpired, getTokenExpirationDate, getTokenIssuedDate, formatJWTInfo } from './jwtDecoder';

// Example Supabase JWT token
const exampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqZnR2c296Y2pkbGlsc3J1Y2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MjM5NTgsImV4cCI6MjA3ODM5OTk1OH0.UkjIWaYmsFzAjZD0j2txJGFjSv3D0XVF9ugLhE929-s';

console.log('=== JWT Decoder Demo ===\n');

// Test 1: Basic decoding
console.log('Test 1: Decoding JWT token');
try {
  const decoded = decodeJWT(exampleToken);
  console.log('✅ Successfully decoded token');
  console.log('Header:', JSON.stringify(decoded.header, null, 2));
  console.log('Payload:', JSON.stringify(decoded.payload, null, 2));
  console.log('Signature:', decoded.signature);
  console.log('\n');
} catch (error) {
  console.error('❌ Error:', error);
}

// Test 2: Check expiration
console.log('Test 2: Checking token expiration');
try {
  const expired = isTokenExpired(exampleToken);
  console.log(`Token expired: ${expired ? '❌ Yes' : '✅ No'}`);
  console.log('\n');
} catch (error) {
  console.error('❌ Error:', error);
}

// Test 3: Get dates
console.log('Test 3: Getting token dates');
try {
  const expDate = getTokenExpirationDate(exampleToken);
  const iatDate = getTokenIssuedDate(exampleToken);

  if (iatDate) {
    console.log('Issued At:', iatDate.toLocaleString('id-ID'));
  }

  if (expDate) {
    console.log('Expires At:', expDate.toLocaleString('id-ID'));
  }
  console.log('\n');
} catch (error) {
  console.error('❌ Error:', error);
}

// Test 4: Format full info
console.log('Test 4: Formatted token information');
try {
  const info = formatJWTInfo(exampleToken);
  console.log(info);
} catch (error) {
  console.error('❌ Error:', error);
}

// Test 5: Invalid token handling
console.log('\nTest 5: Handling invalid token');
try {
  const invalidToken = 'invalid.token.here';
  decodeJWT(invalidToken);
} catch (error) {
  console.log('✅ Correctly caught error for invalid token');
  console.log('Error message:', error instanceof Error ? error.message : 'Unknown error');
}

console.log('\n=== Demo Complete ===');

/**
 * Expected output for the example token:
 *
 * Header:
 * {
 *   "alg": "HS256",
 *   "typ": "JWT"
 * }
 *
 * Payload:
 * {
 *   "iss": "supabase",
 *   "ref": "hjftvsozxjdlilsruccj",
 *   "role": "anon",
 *   "iat": 1762823958,
 *   "exp": 2078399958
 * }
 *
 * This is a Supabase anonymous (anon) token with:
 * - Issued: November 11, 2025
 * - Expires: November 11, 2035
 * - Valid for 10 years
 */
