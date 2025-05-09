export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-900 px-6 py-16 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-white-400 mb-6">🔐 SafePass&Docs</h1>
        <p className="text-lg text-slate-300 mb-10">
          Una herramienta moderna para cifrar documentos y gestionar contraseñas de forma segura utilizando criptografía avanzada.
        </p>

        <section className="text-left bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-emerald-400">🧠 ¿Cómo funciona?</h2>

          <div className="space-y-4 text-slate-200">
            <p>
              <span className="font-semibold text-white">SafePass&Docs</span> combina dos funcionalidades principales:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="text-sky-300 font-medium">Cifrado de Documentos:</span> Protege tus archivos con una clave AES-256, la cual se cifra a su vez usando tu clave pública RSA. Esto asegura que solo tú, con tu clave privada, puedas descifrar el contenido.
              </li>
              <li>
                <span className="text-indigo-300 font-medium">Gestión de Contraseñas:</span> Crea y guarda entradas con usuario, contraseña, sitio y URL. Todos los datos se almacenan cifrados localmente en un archivo `.vault` usando tu clave maestra.
              </li>
            </ul>

            <p>
              Todo ocurre en tu navegador: <span className="text-emerald-400 font-semibold">nada se envía a servidores</span>. La seguridad está completamente bajo tu control.
            </p>
          </div>

          <hr className="border-slate-700" />

          <h3 className="text-xl font-semibold text-amber-300">🔐 ¿Qué es la criptografía que usamos?</h3>
          <p className="text-slate-200">
            Usamos una combinación de <span className="font-medium text-white">RSA (asimétrica)</span> y <span className="font-medium text-white">AES (simétrica)</span>:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>
              <strong className="text-sky-300">AES-CBC 256 bits:</strong> Ideal para cifrado rápido y seguro de archivos grandes.
            </li>
            <li>
              <strong className="text-sky-300">RSA-OAEP con SHA-256:</strong> Utilizado para cifrar la clave AES, asegurando que solo tú puedas descifrar los archivos.
            </li>
            <li>
              <strong className="text-sky-300">PBKDF2:</strong> Convierte tu clave maestra en una clave criptográfica robusta con miles de iteraciones y sal aleatoria.
            </li>
          </ul>

          <p className="text-slate-400 italic mt-4 text-center">
            Estas técnicas son ampliamente usadas en estándares internacionales de seguridad como OpenPGP y herramientas como Bitwarden o VeraCrypt.
          </p>

          <p className="mt-6 text-center text-slate-500 italic">Desarrollado por SebRVV para tu seguridad digital.</p>
        </section>
      </div>
    </main>
  );
}
