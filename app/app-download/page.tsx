'use client';

import React from 'react';

export default function AppPage() {
  return (
    <main className="min-h-screen bg-gray-900 px-6 py-16 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-emerald-400 mb-4">🧩 Aplicación: SafePass&Docs</h1>
        <p className="text-xl text-slate-300 mb-10">
          Descarga la versión de escritorio de SafePass&Docs: una aplicación en Python que combina cifrado RSA + AES y gestión local de contraseñas.
        </p>

        <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-left space-y-6">
          <h2 className="text-2xl font-bold text-sky-400">🚀 ¿Qué puedes hacer con SafePass&Docs?</h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>🔑 Generar y cargar claves RSA para cifrado seguro.</li>
            <li>📁 Cifrar y descifrar archivos con protección híbrida (AES + RSA).</li>
            <li>🗝️ Gestionar contraseñas en un vault cifrado localmente.</li>
            <li>💻 Todo en una interfaz de escritorio simple construida con Tkinter.</li>
          </ul>

          <h3 className="text-xl font-semibold text-amber-300">📦 ¿Qué incluye la descarga?</h3>
          <p className="text-slate-300">
            El archivo <code>safe_pass_docs.py</code> contiene todo el código fuente necesario para ejecutar la aplicación con interfaz gráfica en tu computadora.
            Solo necesitas tener Python 3 y las dependencias necesarias instaladas.
          </p>

          <p className="text-slate-400 text-sm italic">Dependencias: tkinter, cryptography, json, secrets, os</p>

          <div className="text-center mt-8">
            <a
              href="/safe_pass_docs.py"
              download
              className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-md transition-colors"
            >
              ⬇️ Descargar Código (.py)
            </a>
          </div>
        </div>

        <p className="mt-10 text-sm text-slate-500 italic">
          Proyecto desarrollado por <span className="text-white font-semibold">Sebastian Rojas</span> para fomentar la seguridad digital personal.
        </p>
      </div>
    </main>
  );
}
