import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';

const DemoAccountSetup: React.FC = () => {
  const { signUp } = useAuth();
  const [status, setStatus] = useState<'idle' | 'creating' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const demoEmail = 'latief@email.com';
  const demoPassword = 'zxcvbnm';

  const createDemoAccount = async () => {
    setStatus('creating');
    setMessage('Membuat akun demo...');

    try {
      await signUp(demoEmail, demoPassword);
      setStatus('success');
      setMessage('✅ BERHASIL! Akun demo berhasil dibuat!\n\n📧 Email: latief@email.com\n🔑 Password: zxcvbnm\n\n✓ Silakan login menggunakan kredensial di atas atau klik tombol "Isi Kredensial Demo".');
    } catch (error: any) {
      if (error.message?.includes('already registered') || error.message?.includes('sudah terdaftar')) {
        setStatus('success');
        setMessage('✅ BERHASIL! Akun demo sudah ada!\n\n📧 Email: latief@email.com\n🔑 Password: zxcvbnm\n\n✓ Anda dapat langsung login menggunakan kredensial di atas atau klik tombol "Isi Kredensial Demo".');
      } else {
        setStatus('error');
        setMessage(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '2px solid #3b82f6',
      maxWidth: '350px',
      zIndex: 1000
    }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#1e40af' }}>
        Demo Account Setup
      </h3>

      {status === 'idle' && (
        <div>
          <p style={{ margin: '0 0 15px 0', fontSize: '14px' }}>
            Klik tombol di bawah untuk membuat akun demo:
          </p>
          <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#6b7280' }}>
            Email: {demoEmail}<br />
            Password: {demoPassword}
          </p>
          <button
            onClick={createDemoAccount}
            style={{
              width: '100%',
              padding: '10px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Buat Akun Demo
          </button>
        </div>
      )}

      {status === 'creating' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '10px' }}>⏳</div>
          <p style={{ margin: 0, fontSize: '14px' }}>{message}</p>
        </div>
      )}

      {status === 'success' && (
        <div>
          <div style={{
            whiteSpace: 'pre-line',
            fontSize: '14px',
            marginBottom: '15px',
            color: '#059669'
          }}>
            {message}
          </div>
          <button
            onClick={() => setStatus('idle')}
            style={{
              width: '100%',
              padding: '8px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Tutup
          </button>
        </div>
      )}

      {status === 'error' && (
        <div>
          <div style={{
            fontSize: '14px',
            marginBottom: '15px',
            color: '#dc2626'
          }}>
            {message}
          </div>
          <button
            onClick={() => setStatus('idle')}
            style={{
              width: '100%',
              padding: '8px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Coba Lagi
          </button>
        </div>
      )}
    </div>
  );
};

export default DemoAccountSetup;
