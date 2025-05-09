'use client';

import { useState } from 'react';
import { saveAs } from 'file-saver';

export default function RSAKeys() {
  const [status, setStatus] = useState('🔓 Pública: ❌\n🔐 Privada: ❌');
  const [fileNameBase, setFileNameBase] = useState('mi_clave');

  const arrayBufferToPem = (buffer: ArrayBuffer, type: 'public' | 'private') => {
    const b64 = window.btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const pem = `-----BEGIN ${type.toUpperCase()} KEY-----\n` +
      b64.match(/.{1,64}/g)?.join('\n') +
      `\n-----END ${type.toUpperCase()} KEY-----\n`;
    return pem;
  };

  const generarClaves = async () => {
    try {
      setStatus('⏳ Generando claves...');
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      );

      const privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
      const publicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);

      const privatePem = arrayBufferToPem(privateKey, 'private');
      const publicPem = arrayBufferToPem(publicKey, 'public');

      const safeName = fileNameBase.trim() || 'mi_clave';
      saveAs(new Blob([privatePem], { type: 'text/plain' }), `${safeName}.private.pem`);
      saveAs(new Blob([publicPem], { type: 'text/plain' }), `${safeName}.public.pem`);

      setStatus('✅ Claves generadas y descargadas correctamente.');
    } catch (error) {
      console.error(error);
      setStatus('❌ Error al generar las claves.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-white">
        <h1 className="text-3xl font-bold mb-6 text-center text-white-400">🔐 Generador de Claves RSA</h1>

        <label className="block text-sm mb-2 text-gray-300">Nombre base del archivo:</label>
        <input
          type="text"
          value={fileNameBase}
          onChange={(e) => setFileNameBase(e.target.value)}
          placeholder="mi_clave"
          className="w-full px-4 py-2 mb-6 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        <button
          onClick={generarClaves}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded transition"
        >
          📥 Generar y Descargar Claves
        </button>

        <pre className="mt-6 border border-emerald-500 text-emerald-400 p-4 rounded text-sm whitespace-pre-line text-center">
          {status}
        </pre>
      </div>
    </div>
  );
}
