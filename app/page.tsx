export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-6">🔐 SafePass&Docs</h1>
        <p className="text-lg text-gray-700 mb-10">
          Una herramienta moderna para cifrar documentos y gestionar contraseñas de forma segura usando criptografía avanzada.
        </p>

        <section className="text-left space-y-6 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800">🧠 ¿Cómo funciona?</h2>

          <p className="mt-6 text-center text-gray-500 italic">Desarrollado por SebRVV para tu seguridad digital.</p>
        </section>
      </div>
    </main>
  )
}
