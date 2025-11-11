import React, { useState, useCallback } from 'react';
import { decodeJWT, isTokenExpired, getTokenExpirationDate, getTokenIssuedDate, type DecodedJWT } from '../utils/jwtDecoder';

export const JWTDecoder: React.FC = () => {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecode = useCallback(() => {
    setError(null);
    setDecoded(null);

    if (!token.trim()) {
      setError('Please enter a JWT token');
      return;
    }

    try {
      const decodedToken = decodeJWT(token.trim());
      setDecoded(decodedToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decode token');
    }
  }, [token]);

  const handleClear = useCallback(() => {
    setToken('');
    setDecoded(null);
    setError(null);
  }, []);

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">🔐</span>
        <h2 className="text-2xl font-bold text-gray-800">JWT Token Decoder</h2>
      </div>

      <p className="text-gray-600 mb-4">
        Masukkan JWT token untuk melihat isi header dan payload-nya
      </p>

      <div className="mb-4">
        <label htmlFor="jwt-input" className="block text-sm font-medium text-gray-700 mb-2">
          JWT Token
        </label>
        <textarea
          id="jwt-input"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT token here (e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical min-h-[100px] font-mono text-sm"
        />
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={handleDecode}
          disabled={!token.trim()}
          className="px-6 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          🔓 Decode Token
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          🗑️ Clear
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">❌</span>
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {decoded && (
        <div className="space-y-4">
          {/* Token Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <span>📊</span> Token Status
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700 font-medium">Issued At:</span>
                <span className="text-blue-900">{formatDate(decoded.payload.iat)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 font-medium">Expires At:</span>
                <span className="text-blue-900">
                  {decoded.payload.exp ? formatDate(decoded.payload.exp) : 'Never'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700 font-medium">Status:</span>
                <span className={`font-semibold ${isTokenExpired(decoded.payload) ? 'text-red-600' : 'text-green-600'}`}>
                  {isTokenExpired(decoded.payload) ? '❌ EXPIRED' : '✅ VALID'}
                </span>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span>📋</span> Header
            </h3>
            <pre className="bg-white p-3 rounded border border-gray-300 overflow-x-auto text-sm">
              <code>{JSON.stringify(decoded.header, null, 2)}</code>
            </pre>
          </div>

          {/* Payload */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span>📦</span> Payload
            </h3>
            <pre className="bg-white p-3 rounded border border-gray-300 overflow-x-auto text-sm">
              <code>{JSON.stringify(decoded.payload, null, 2)}</code>
            </pre>

            {/* Additional Payload Info */}
            <div className="mt-3 space-y-1 text-sm">
              {decoded.payload.iss && (
                <div className="flex gap-2">
                  <span className="text-gray-600 font-medium">Issuer:</span>
                  <span className="text-gray-900">{decoded.payload.iss}</span>
                </div>
              )}
              {decoded.payload.sub && (
                <div className="flex gap-2">
                  <span className="text-gray-600 font-medium">Subject:</span>
                  <span className="text-gray-900">{decoded.payload.sub}</span>
                </div>
              )}
              {decoded.payload.aud && (
                <div className="flex gap-2">
                  <span className="text-gray-600 font-medium">Audience:</span>
                  <span className="text-gray-900">{decoded.payload.aud}</span>
                </div>
              )}
              {decoded.payload.role && (
                <div className="flex gap-2">
                  <span className="text-gray-600 font-medium">Role:</span>
                  <span className="text-gray-900">{decoded.payload.role}</span>
                </div>
              )}
              {decoded.payload.ref && (
                <div className="flex gap-2">
                  <span className="text-gray-600 font-medium">Reference:</span>
                  <span className="text-gray-900 font-mono text-xs">{decoded.payload.ref}</span>
                </div>
              )}
            </div>
          </div>

          {/* Signature */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span>✍️</span> Signature
            </h3>
            <pre className="bg-white p-3 rounded border border-gray-300 overflow-x-auto text-sm">
              <code className="font-mono">{decoded.signature}</code>
            </pre>
            <p className="text-xs text-gray-500 mt-2">
              ⚠️ Signature verification requires the secret key and is not performed in the browser for security reasons.
            </p>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <span className="text-xl">⚠️</span>
              <div className="text-sm">
                <h4 className="font-semibold text-yellow-900 mb-1">Security Notice</h4>
                <p className="text-yellow-800">
                  JWT tokens can be decoded by anyone, so never store sensitive information in the payload.
                  Always verify the signature on the server before trusting the token contents.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
