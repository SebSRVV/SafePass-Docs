export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-900 px-6 py-16 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-6">🔐 SafePass&Docs</h1>
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
              <strong className="text-sky-300">Scrypt (KDF):</strong> Convierte tu clave maestra en una clave criptográfica robusta con miles de iteraciones.
            </li>
          </ul>

          <p className="text-slate-400 italic mt-4 text-center">
            Estas técnicas son ampliamente usadas en estándares internacionales de seguridad como OpenPGP y herramientas como Bitwarden o VeraCrypt.
          </p>
        </section>

        {/* Nueva sección con explicación ampliada */}
        <section className="mt-12 bg-gray-800 p-8 rounded-lg shadow-md space-y-6 text-left">
          <h2 className="text-2xl font-bold text-cyan-400">📚 Explicación de los algoritmos</h2>

          <div className="space-y-6 text-slate-300">
            <div>
              <h3 className="text-xl font-semibold text-sky-300">AES (Advanced Encryption Standard)</h3>
              <p>
                AES es un sistema de cifrado simétrico, lo que significa que usa la misma clave tanto para cifrar como para descifrar la información. Es muy rápido y eficiente, por eso se utiliza ampliamente en aplicaciones que manejan grandes volúmenes de datos, como discos duros, comunicaciones seguras y almacenamiento en la nube. Su seguridad se basa en transformar los datos mediante una serie de operaciones matemáticas que son prácticamente imposibles de revertir sin conocer la clave. Sin embargo, su principal desafío es cómo compartir esa clave de forma segura.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-sky-300">RSA (Rivest–Shamir–Adleman)</h3>
              <p>
                RSA es un sistema de cifrado asimétrico que utiliza un par de claves: una pública para cifrar y una privada para descifrar. Esto permite que cualquiera pueda enviar información cifrada usando la clave pública, pero solo el dueño de la clave privada puede leerla. Es ideal para intercambiar datos sensibles sin necesidad de compartir una clave secreta de antemano. Aunque es más lento que AES, RSA es fundamental en la seguridad de Internet, especialmente para el intercambio inicial de claves en comunicaciones seguras.
              </p>
            </div>
          </div>
        </section>

        <p className="mt-10 text-center text-slate-500 italic">Desarrollado por Sebastian Rojas para tu seguridad digital.</p>
      </div>

      {/* Botón flotante de GitHub */}
      <a
        href="https://github.com/SebSRVV/safepassdocs"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
        title="Ver en GitHub"
      >
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
          alt="GitHub"
          className="w-8 h-8"
        />
      </a>
    </main>
  );
}
