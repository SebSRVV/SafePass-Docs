import { useState } from 'react';

export default function SafePage() {
  const [message, setMessage] = useState('');

  const handleEncrypt = async () => {
    const res = await fetch('/api/encrypt', { method: 'POST' });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>🔐 SafePass&Docs</h1>
      <p>Bienvenido a tu bóveda segura.</p>
      <button onClick={handleEncrypt}>Probar conexión con backend</button>
      {message && <p style={{ marginTop: 20 }}>🔁 Respuesta: {message}</p>}
    </div>
  );
}
