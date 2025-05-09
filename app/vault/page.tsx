'use client';

import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';

type VaultEntry = {
  sitio: string;
  url: string;
  usuario: string;
  contraseña: string;
};

export default function VaultPage() {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [nombre, setNombre] = useState('');
  const [claveMaestra, setClaveMaestra] = useState('');
  const [archivoCargado, setArchivoCargado] = useState<File | null>(null);
  const [activo, setActivo] = useState(false);
  const [status, setStatus] = useState('');
  const [modo, setModo] = useState<'crear' | 'cargar'>('crear');

  useEffect(() => {
    const nombreGuardado = localStorage.getItem('vault_nombre');
    if (nombreGuardado) setNombre(nombreGuardado);
  }, []);

  useEffect(() => {
    if (activo && nombre) localStorage.setItem('vault_nombre', nombre);
  }, [activo, nombre]);

  const encode = (str: string) => new TextEncoder().encode(str);
  const decode = (data: ArrayBuffer) => new TextDecoder().decode(data);

  const deriveKey = async (password: string, salt: Uint8Array) => {
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    return await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-CBC', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  };

  const guardarVault = async () => {
    try {
      const json = JSON.stringify(entries);
      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const iv = window.crypto.getRandomValues(new Uint8Array(16));
      const key = await deriveKey(claveMaestra, salt);
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-CBC', iv },
        key,
        encode(json)
      );
      const blob = new Blob([salt, iv, encrypted], { type: 'application/octet-stream' });
      saveAs(blob, `vault_${nombre || 'nuevo'}.vault`);
      setStatus('✅ Vault guardado exitosamente');
    } catch {
      setStatus('❌ Error al guardar el Vault');
    }
  };

  const cargarVault = async () => {
    if (!archivoCargado) return;
    const buffer = new Uint8Array(await archivoCargado.arrayBuffer());
    const salt = buffer.slice(0, 16);
    const iv = buffer.slice(16, 32);
    const encrypted = buffer.slice(32);

    try {
      const key = await deriveKey(claveMaestra, salt);
      const decrypted = await window.crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, encrypted);
      const json = decode(decrypted);
      setEntries(JSON.parse(json));
      const nombreArchivo = archivoCargado.name.replace(/^vault_/, '').replace(/\.vault$/, '');
      setNombre(nombreArchivo);
      setActivo(true);
      setStatus('✅ Vault cargado correctamente');
    } catch {
      setStatus('❌ Clave incorrecta o archivo dañado');
    }
  };

  const agregarEntrada = () => {
    const sitio = prompt('Sitio');
    const url = prompt('URL');
    const usuario = prompt('Usuario');
    const contraseña = prompt('Contraseña');
    if (!sitio || !url || !usuario || !contraseña) return alert('Todos los campos son obligatorios');
    setEntries([...entries, { sitio, url, usuario, contraseña }]);
  };

  const editarEntrada = (index: number) => {
    const entry = entries[index];
    const sitio = prompt('Sitio', entry.sitio);
    const url = prompt('URL', entry.url);
    const usuario = prompt('Usuario', entry.usuario);
    const contraseña = prompt('Contraseña', entry.contraseña);
    if (!sitio || !url || !usuario || !contraseña) return alert('Todos los campos son obligatorios');
    const nuevas = [...entries];
    nuevas[index] = { sitio, url, usuario, contraseña };
    setEntries(nuevas);
  };

  const eliminarEntrada = (sitio: string) => {
    if (confirm(`¿Eliminar entrada para "${sitio}"?`)) {
      setEntries(entries.filter(e => e.sitio !== sitio));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-extrabold text-center text-white-400">🔐 Vault de Contraseñas</h1>

        {!activo && (
          <div className="flex justify-center space-x-4">
            {['crear', 'cargar'].map(opcion => (
              <button
                key={opcion}
                onClick={() => setModo(opcion as 'crear' | 'cargar')}
                className={`px-5 py-2 rounded border transition ${
                  modo === opcion
                    ? 'bg-sky-600 border-sky-400 text-white'
                    : 'border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {opcion === 'crear' ? '🆕 Crear Vault' : '📂 Cargar Vault'}
              </button>
            ))}
          </div>
        )}

        {!activo && modo === 'crear' && (
          <div className="space-y-4">
            <input
              value={nombre}
              placeholder="Nombre del Vault"
              onChange={e => setNombre(e.target.value)}
              className="w-full bg-transparent border border-slate-500 p-3 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <input
              type="password"
              placeholder="Clave Maestra"
              onChange={e => setClaveMaestra(e.target.value)}
              className="w-full bg-transparent border border-slate-500 p-3 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <button
              onClick={() => {
                if (nombre && claveMaestra) {
                  setActivo(true);
                  setStatus('🟢 Nuevo Vault iniciado');
                } else {
                  setStatus('❗ Nombre y clave maestra son obligatorios');
                }
              }}
              className="px-4 py-2 rounded border border-emerald-400 text-emerald-400 hover:bg-emerald-600 hover:text-white transition"
            >
              ✔️ Confirmar
            </button>
          </div>
        )}

        {!activo && modo === 'cargar' && (
          <div className="space-y-4">
            <input
              type="file"
              accept=".vault"
              onChange={e => setArchivoCargado(e.target.files?.[0] || null)}
              className="block text-white"
            />
            <input
              type="password"
              placeholder="Clave Maestra"
              value={claveMaestra}
              onChange={e => setClaveMaestra(e.target.value)}
              className="w-full bg-transparent border border-slate-500 p-3 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <button
              onClick={cargarVault}
              className="px-4 py-2 rounded border border-emerald-400 text-emerald-400 hover:bg-emerald-600 hover:text-white transition"
            >
              🔓 Ingresar
            </button>
          </div>
        )}

        {activo && (
          <>
            <div className="flex justify-between items-center mt-6 mb-2">
              <p className="text-lg text-sky-400 font-semibold">🗂️ Vault: {nombre}</p>
              <button
                onClick={guardarVault}
                className="px-4 py-2 rounded border border-sky-400 text-sky-400 hover:bg-sky-700 hover:text-white transition"
              >
                💾 Guardar Vault
              </button>
            </div>

            <button
              onClick={agregarEntrada}
              className="mb-4 px-4 py-2 rounded border border-indigo-400 text-indigo-400 hover:bg-indigo-700 hover:text-white transition"
            >
              ➕ Nueva Entrada
            </button>

            <div className="overflow-auto border border-slate-600 rounded-lg">
              <table className="w-full text-sm">
                <thead className="text-sky-300 border-b border-slate-700">
                  <tr>
                    <th className="p-3 text-left">Sitio</th>
                    <th className="p-3 text-left">URL</th>
                    <th className="p-3 text-left">Usuario</th>
                    <th className="p-3 text-left">Contraseña</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e, idx) => (
                    <tr key={idx} className="border-t border-slate-700">
                      <td className="p-3">{e.sitio}</td>
                      <td className="p-3">
                        <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-sky-400 underline hover:text-sky-300">
                          {e.url}
                        </a>
                      </td>
                      <td className="p-3">{e.usuario}</td>
                      <td className="p-3">{e.contraseña}</td>
                      <td className="p-3 flex justify-center gap-2">
                        <button
                          onClick={() => editarEntrada(idx)}
                          className="px-3 py-1 rounded border border-amber-400 text-amber-400 hover:bg-amber-600 hover:text-white transition"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => eliminarEntrada(e.sitio)}
                          className="px-3 py-1 rounded border border-rose-400 text-rose-400 hover:bg-rose-600 hover:text-white transition"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {status && (
          <div className="mt-6 p-4 rounded border border-emerald-500 text-center text-emerald-400 bg-gray-800">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
