'use client'

import { useState } from 'react'

export default function DocsPage() {
  const [publicKey, setPublicKey] = useState<CryptoKey | null>(null)
  const [privateKey, setPrivateKey] = useState<CryptoKey | null>(null)

  const handlePublicKeyUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const pem = await file.text()
    const binaryDer = str2ab(pemToDer(pem))
    const key = await window.crypto.subtle.importKey(
      'spki',
      binaryDer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['encrypt']
    )
    setPublicKey(key)
    alert('🔓 Clave pública cargada.')
  }

  const handlePrivateKeyUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const pem = await file.text()
    const binaryDer = str2ab(pemToDer(pem))
    const key = await window.crypto.subtle.importKey(
      'pkcs8',
      binaryDer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['decrypt']
    )
    setPrivateKey(key)
    alert('🔐 Clave privada cargada.')
  }

  const str2ab = (str: string): ArrayBuffer => {
    const b64 = window.atob(str)
    const bytes = new Uint8Array(b64.length)
    for (let i = 0; i < b64.length; i++) {
      bytes[i] = b64.charCodeAt(i)
    }
    return bytes.buffer
  }

  const pemToDer = (pem: string): string => {
    return pem.replace(/-----BEGIN.*KEY-----/, '')
              .replace(/-----END.*KEY-----/, '')
              .replace(/\s+/g, '')
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">📁 Cifrado / Descifrado de Documentos</h1>

      <div className="mb-6 space-y-3">
        <div>
          <label className="block font-medium mb-1">📂 Cargar Clave Pública (.pem)</label>
          <input type="file" accept=".pem" onChange={handlePublicKeyUpload} />
        </div>

        <div>
          <label className="block font-medium mb-1">📂 Cargar Clave Privada (.pem)</label>
          <input type="file" accept=".pem" onChange={handlePrivateKeyUpload} />
        </div>
      </div>

      <div className="mt-8 space-x-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => alert('🔒 Aún no implementado: encriptar archivo')}
          disabled={!publicKey}
        >
          🔒 Encriptar documento
        </button>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => alert('🔓 Aún no implementado: desencriptar archivo')}
          disabled={!privateKey}
        >
          🔓 Desencriptar documento
        </button>
      </div>
    </div>
  )
}
