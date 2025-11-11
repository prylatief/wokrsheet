/**
 * JWT Decoder Utility
 * Decodes JWT tokens and extracts header and payload information
 */

export interface JWTHeader {
  alg: string;
  typ: string;
  [key: string]: any;
}

export interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: any;
}

export interface DecodedJWT {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
  raw: {
    header: string;
    payload: string;
    signature: string;
  };
}

/**
 * Base64URL decode function
 * Converts Base64URL encoded string to regular string
 */
function base64UrlDecode(base64Url: string): string {
  // Replace Base64URL characters with Base64 characters
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if necessary
  const padding = base64.length % 4;
  if (padding) {
    base64 += '='.repeat(4 - padding);
  }

  // Decode base64 to string
  try {
    const decoded = atob(base64);
    // Handle UTF-8 encoding
    return decodeURIComponent(escape(decoded));
  } catch (error) {
    throw new Error('Invalid base64 string');
  }
}

/**
 * Decodes a JWT token
 * @param token - The JWT token string
 * @returns Decoded JWT object containing header, payload, and signature
 * @throws Error if token is invalid
 */
export function decodeJWT(token: string): DecodedJWT {
  if (!token || typeof token !== 'string') {
    throw new Error('Token must be a non-empty string');
  }

  // Split token into parts
  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new Error('Invalid JWT format. Token must have 3 parts separated by dots');
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  try {
    // Decode header
    const headerJson = base64UrlDecode(headerB64);
    const header: JWTHeader = JSON.parse(headerJson);

    // Decode payload
    const payloadJson = base64UrlDecode(payloadB64);
    const payload: JWTPayload = JSON.parse(payloadJson);

    return {
      header,
      payload,
      signature: signatureB64,
      raw: {
        header: headerB64,
        payload: payloadB64,
        signature: signatureB64,
      },
    };
  } catch (error) {
    throw new Error(`Failed to decode JWT: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Checks if a JWT token is expired
 * @param token - The JWT token string or decoded JWT payload
 * @returns true if token is expired, false otherwise
 */
export function isTokenExpired(token: string | JWTPayload): boolean {
  try {
    const payload = typeof token === 'string' ? decodeJWT(token).payload : token;

    if (!payload.exp) {
      return false; // No expiration time means token doesn't expire
    }

    // exp is in seconds, Date.now() is in milliseconds
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    return true; // If we can't decode, consider it expired
  }
}

/**
 * Gets the expiration date of a JWT token
 * @param token - The JWT token string or decoded JWT payload
 * @returns Date object or null if no expiration
 */
export function getTokenExpirationDate(token: string | JWTPayload): Date | null {
  try {
    const payload = typeof token === 'string' ? decodeJWT(token).payload : token;

    if (!payload.exp) {
      return null;
    }

    // exp is in seconds, convert to milliseconds for Date
    return new Date(payload.exp * 1000);
  } catch (error) {
    return null;
  }
}

/**
 * Gets the issued at date of a JWT token
 * @param token - The JWT token string or decoded JWT payload
 * @returns Date object or null if no issued at time
 */
export function getTokenIssuedDate(token: string | JWTPayload): Date | null {
  try {
    const payload = typeof token === 'string' ? decodeJWT(token).payload : token;

    if (!payload.iat) {
      return null;
    }

    // iat is in seconds, convert to milliseconds for Date
    return new Date(payload.iat * 1000);
  } catch (error) {
    return null;
  }
}

/**
 * Formats a JWT token for display
 * @param token - The JWT token string
 * @returns Formatted string with token information
 */
export function formatJWTInfo(token: string): string {
  try {
    const decoded = decodeJWT(token);
    const expDate = getTokenExpirationDate(decoded.payload);
    const iatDate = getTokenIssuedDate(decoded.payload);
    const expired = isTokenExpired(decoded.payload);

    let info = '=== JWT Token Information ===\n\n';
    info += '--- Header ---\n';
    info += JSON.stringify(decoded.header, null, 2) + '\n\n';
    info += '--- Payload ---\n';
    info += JSON.stringify(decoded.payload, null, 2) + '\n\n';
    info += '--- Signature ---\n';
    info += decoded.signature + '\n\n';
    info += '--- Token Status ---\n';

    if (iatDate) {
      info += `Issued At: ${iatDate.toLocaleString()}\n`;
    }

    if (expDate) {
      info += `Expires At: ${expDate.toLocaleString()}\n`;
      info += `Status: ${expired ? '❌ EXPIRED' : '✅ VALID'}\n`;
    } else {
      info += 'Status: ✅ NEVER EXPIRES\n';
    }

    return info;
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}
