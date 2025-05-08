'use client'

import { useRef, useState } from 'react'

export default function DocsPage() {
  const [publicKey, setPublicKey] = useState<CryptoKey | null>(null)
  const [privateKey, setPrivateKey] = useState<CryptoKey | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>("")
  const [decryptedOutput, setDecryptedOutput] = useState<string>("")
  const [keyName, setKeyName] = useState<string>("my_key")

  const fileRef = useRef<File | null>(null)
  const decryptFileRef = useRef<File | null>(null)

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => setMessageType(''), 5000)
  }

  const generateAndSaveKeys = async () => {
    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      )
      setPublicKey(keyPair.publicKey)
      setPrivateKey(keyPair.privateKey)

      const exportedPrivate = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
      const exportedPublic = await crypto.subtle.exportKey('spki', keyPair.publicKey)

      const privatePem = convertToPem(exportedPrivate, 'PRIVATE KEY')
      const publicPem = convertToPem(exportedPublic, 'PUBLIC KEY')

      downloadFile(`${keyName}_private.pem`, privatePem)
      downloadFile(`${keyName}_public.pem`, publicPem)

      showMessage('✅ Claves generadas y descargadas.', 'success')
    } catch (err) {
      showMessage('❌ Error generando claves.', 'error')
    }
  }

  const convertToPem = (buffer: ArrayBuffer, label: string): string => {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
    const lines = base64.match(/.{1,64}/g)?.join('\n') ?? ''
    return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----`
  }

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const str2ab = (str: string): ArrayBuffer => {
    const binary = atob(str)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return bytes.buffer
  }

  const pemToDer = (pem: string): string =>
    pem.replace(/-----BEGIN.*KEY-----/, '')
       .replace(/-----END.*KEY-----/, '')
       .replace(/\s+/g, '')

  const handlePublicKeyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const pem = await file.text()
    const key = await crypto.subtle.importKey(
      'spki',
      str2ab(pemToDer(pem)),
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      true,
      ['encrypt']
    )
    setPublicKey(key)
    showMessage('🔓 Clave pública cargada correctamente.', 'success')
  }

  const handlePrivateKeyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const pem = await file.text()
    const key = await crypto.subtle.importKey(
      'pkcs8',
      str2ab(pemToDer(pem)),
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      true,
      ['decrypt']
    )
    setPrivateKey(key)
    showMessage('🔐 Clave privada cargada correctamente.', 'success')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'text/plain') {
        showMessage('❌ Solo se permiten archivos de texto (.txt).', 'error')
        return
      }
      fileRef.current = file
      setFileName(file.name)
      showMessage(`📁 Archivo "${file.name}" listo para cifrar.`, 'success')
    }
  }

  const handleDecryptFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      decryptFileRef.current = file
      showMessage(`📥 Archivo cifrado "${file.name}" listo para descifrar.`, 'success')
    }
  }

  const handleEncrypt = async () => {
    if (!publicKey || !fileRef.current) {
      showMessage('❌ Debes cargar una clave pública y seleccionar un archivo .txt.', 'error')
      return
    }

    const aesKey = await crypto.subtle.generateKey(
      { name: 'AES-CBC', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
    const iv = crypto.getRandomValues(new Uint8Array(16))
    const fileData = await fileRef.current.arrayBuffer()

    const encryptedData = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, aesKey, fileData)
    const rawKey = await crypto.subtle.exportKey('raw', aesKey)
    const encryptedKey = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, rawKey)

    const keyLen = new Uint32Array([encryptedKey.byteLength])
    const combined = new Uint8Array(4 + encryptedKey.byteLength + iv.byteLength + encryptedData.byteLength)
    combined.set(new Uint8Array(keyLen.buffer), 0)
    combined.set(new Uint8Array(encryptedKey), 4)
    combined.set(iv, 4 + encryptedKey.byteLength)
    combined.set(new Uint8Array(encryptedData), 4 + encryptedKey.byteLength + iv.byteLength)

    const blob = new Blob([combined], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileRef.current.name + '.safedocs'
    link.click()
    URL.revokeObjectURL(url)

    showMessage('✅ Archivo cifrado y descargado con éxito.', 'success')
  }

  const handleDecrypt = async () => {
    if (!privateKey || !decryptFileRef.current) {
      showMessage('❌ Debes cargar una clave privada y un archivo cifrado (.safedocs).', 'error')
      return
    }

    try {
      const file = await decryptFileRef.current.arrayBuffer()
      const data = new Uint8Array(file)
      const keyLen = new DataView(data.buffer).getUint32(0)
      const encryptedKey = data.slice(4, 4 + keyLen)
      const iv = data.slice(4 + keyLen, 4 + keyLen + 16)
      const encryptedData = data.slice(4 + keyLen + 16)

      const aesKeyRaw = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, encryptedKey)
      const aesKey = await crypto.subtle.importKey('raw', aesKeyRaw, { name: 'AES-CBC' }, false, ['decrypt'])

      const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, aesKey, encryptedData)
      const text = new TextDecoder().decode(decrypted)

      setDecryptedOutput(text)
      showMessage('✅ Archivo descifrado correctamente.', 'success')
    } catch (e) {
      showMessage('❌ Error al descifrar el archivo.', 'error')
      setDecryptedOutput('')
    }
  }


  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10 max-w-3xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-center mb-6">🔐 SafePass&Docs</h1>

      {messageType && (
        <div className={`p-4 rounded text-sm ${messageType === 'success' ? 'bg-green-700' : 'bg-red-700'}`}>
          {message}
        </div>
      )}

      <section className="bg-[#1e1e1e] p-6 rounded-lg shadow space-y-3">
        <h2 className="text-lg font-semibold">🛠️ Crear Llaves</h2>
        <label className="text-sm">Nombre base para las claves:</label>
        <input
          type="text"
          value={keyName}
          onChange={e => setKeyName(e.target.value)}
          placeholder="ej: documento_seguro"
          className="w-full bg-black border border-gray-700 p-2 text-sm rounded text-white"
        />
        <button
          onClick={generateAndSaveKeys}
          className="mt-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white font-medium"
        >
          📥 Generar y Guardar Claves
        </button>
        <p className="text-sm mt-2">Estado: 🔓 Pública: {publicKey ? '✅' : '❌'} | 🔐 Privada: {privateKey ? '✅' : '❌'}</p>
      </section>

      <section className="bg-[#1e1e1e] p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold">📂 Cargar Claves desde Archivo</h2>
        <div className="space-y-2">
          <label className="block text-sm">🔓 Clave Pública (.pem)</label>
          <input type="file" accept=".pem" onChange={handlePublicKeyUpload} className="block w-full text-sm" />
          <label className="block text-sm mt-4">🔐 Clave Privada (.pem)</label>
          <input type="file" accept=".pem" onChange={handlePrivateKeyUpload} className="block w-full text-sm" />
        </div>
      </section>

      <section className="bg-[#1e1e1e] p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold">📁 Encriptar Archivo</h2>
        <input type="file" onChange={handleFileUpload} className="block w-full text-sm" />
        {fileName && <p className="text-sm text-gray-300">📎 {fileName}</p>}
        <button
          onClick={handleEncrypt}
          className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-medium disabled:opacity-50"
          disabled={!publicKey || !fileRef.current}
        >
          🔐 Encriptar y Descargar
        </button>
      </section>

      <section className="bg-[#1e1e1e] p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold">🔓 Descifrar Archivo</h2>
        <input type="file" accept=".safedocs" onChange={handleDecryptFileUpload} className="block w-full text-sm" />
        <button
          onClick={handleDecrypt}
          className="mt-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-white font-medium disabled:opacity-50"
          disabled={!privateKey || !decryptFileRef.current}
        >
          🔓 Descifrar Archivo Seleccionado
        </button>

        {decryptedOutput && (
          <div className="mt-6">
            <h3 className="text-md font-semibold">📝 Contenido Descifrado</h3>
            <textarea
              value={decryptedOutput}
              readOnly
              rows={10}
              className="w-full mt-2 p-2 rounded bg-black text-white border border-gray-700 text-sm"
            />
          </div>
        )}
      </section>
    </div>
  )
}
