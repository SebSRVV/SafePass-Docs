'use client';

import { useState } from 'react';
import { saveAs } from 'file-saver';

export default function Docs() {
  const [publicKey, setPublicKey] = useState<CryptoKey | null>(null);
  const [privateKey, setPrivateKey] = useState<CryptoKey | null>(null);
  const [status, setStatus] = useState('');

  const loadKeyFromPem = async (pem: string, isPrivate: boolean) => {
    const b64 = pem.replace(/-----(BEGIN|END)( PUBLIC| PRIVATE)? KEY-----/g, '').replace(/\n/g, '');
    const binaryDer = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    return await window.crypto.subtle.importKey(
      isPrivate ? 'pkcs8' : 'spki',
      binaryDer.buffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      isPrivate ? ['decrypt'] : ['encrypt']
    );
  };

  const handleLoadPublicKey = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const text = await e.target.files[0].text();
    const key = await loadKeyFromPem(text, false);
    setPublicKey(key);
    setStatus('🔓 Clave pública cargada correctamente.');
  };

  const handleLoadPrivateKey = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const text = await e.target.files[0].text();
    const key = await loadKeyFromPem(text, true);
    setPrivateKey(key);
    setStatus('🔐 Clave privada cargada correctamente.');
  };

  const handleEncrypt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !publicKey) return;
    const file = await e.target.files[0].arrayBuffer();
    const aesKey = await window.crypto.subtle.generateKey({ name: 'AES-CBC', length: 256 }, true, ['encrypt']);
    const iv = window.crypto.getRandomValues(new Uint8Array(16));

    const encryptedContent = await window.crypto.subtle.encrypt(
      { name: 'AES-CBC', iv },
      aesKey,
      file
    );

    const rawAes = await window.crypto.subtle.exportKey('raw', aesKey);
    const encryptedAes = await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, rawAes);

    const safedoc = new Uint8Array(4 + encryptedAes.byteLength + 16 + encryptedContent.byteLength);
    const view = new DataView(safedoc.buffer);
    view.setUint32(0, encryptedAes.byteLength);
    safedoc.set(new Uint8Array(encryptedAes), 4);
    safedoc.set(iv, 4 + encryptedAes.byteLength);
    safedoc.set(new Uint8Array(encryptedContent), 4 + encryptedAes.byteLength + 16);

    saveAs(new Blob([safedoc], { type: 'application/octet-stream' }), e.target.files[0].name + '.safedocs');
    setStatus('✅ Archivo cifrado exitosamente y descargado.');
  };

  const handleDecrypt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !privateKey) return;
    const buffer = await e.target.files[0].arrayBuffer();
    const view = new DataView(buffer);
    const keyLen = view.getUint32(0);
    const encryptedKey = buffer.slice(4, 4 + keyLen);
    const iv = buffer.slice(4 + keyLen, 4 + keyLen + 16);
    const data = buffer.slice(4 + keyLen + 16);

    const rawAes = await window.crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, encryptedKey);
    const aesKey = await window.crypto.subtle.importKey('raw', rawAes, 'AES-CBC', false, ['decrypt']);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-CBC', iv: new Uint8Array(iv) },
      aesKey,
      data
    );

    saveAs(new Blob([decrypted]), 'archivo_descifrado.txt');
    setStatus('✅ Archivo descifrado correctamente.');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-extrabold text-center">🔐 Cifrado y Descifrado de Documentos</h1>
        <p className="text-center text-gray-300">Sube tus claves y documentos para proteger tu información de forma segura.</p>

        <section className="bg-gray-800 rounded-lg p-6 space-y-4 shadow-lg">
          <h2 className="text-lg font-semibold text-green-400">1️⃣ Cargar clave pública (.pem)</h2>
          <input
            type="file"
            accept=".pem"
            onChange={handleLoadPublicKey}
            className="block w-full text-sm text-white file:bg-blue-600 file:hover:bg-blue-700 file:text-white file:rounded file:px-4 file:py-2 cursor-pointer"
          />
        </section>

        <section className="bg-gray-800 rounded-lg p-6 space-y-4 shadow-lg">
          <h2 className="text-lg font-semibold text-blue-400">2️⃣ Seleccionar archivo a cifrar</h2>
          <input
            type="file"
            onChange={handleEncrypt}
            disabled={!publicKey}
            className="block w-full text-sm text-white disabled:opacity-50 file:bg-blue-600 file:hover:bg-blue-700 file:text-white file:rounded file:px-4 file:py-2 cursor-pointer"
          />
          {!publicKey && <p className="text-sm text-red-400">🔔 Primero debes cargar la clave pública.</p>}
        </section>

        <section className="bg-gray-800 rounded-lg p-6 space-y-4 shadow-lg">
          <h2 className="text-lg font-semibold text-yellow-400">3️⃣ Cargar clave privada (.pem)</h2>
          <input
            type="file"
            accept=".pem"
            onChange={handleLoadPrivateKey}
            className="block w-full text-sm text-white file:bg-yellow-600 file:hover:bg-yellow-700 file:text-white file:rounded file:px-4 file:py-2 cursor-pointer"
          />
        </section>

        <section className="bg-gray-800 rounded-lg p-6 space-y-4 shadow-lg">
          <h2 className="text-lg font-semibold text-purple-400">4️⃣ Seleccionar archivo cifrado (.safedocs)</h2>
          <input
            type="file"
            onChange={handleDecrypt}
            disabled={!privateKey}
            className="block w-full text-sm text-white disabled:opacity-50 file:bg-purple-600 file:hover:bg-purple-700 file:text-white file:rounded file:px-4 file:py-2 cursor-pointer"
          />
          {!privateKey && <p className="text-sm text-red-400">🔔 Primero debes cargar la clave privada.</p>}
        </section>

        {status && (
          <div className="bg-green-800 text-green-100 text-center p-4 rounded-lg">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
