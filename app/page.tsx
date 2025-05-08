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

          <p>
            <strong>SafePass&Docs</strong> combina dos tipos de criptografía:
          </p>

          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>RSA</strong>: un sistema de clave pública que se utiliza para cifrar y descifrar claves seguras.
              Se encarga de proteger la clave secreta de cada documento.
            </li>
            <li>
              <strong>AES (Advanced Encryption Standard)</strong>: un cifrado simétrico extremadamente rápido y seguro.
              Se usa para cifrar el contenido real del archivo.
            </li>
          </ul>

          <p>
            Cuando encriptas un archivo:
            <br />
            🔐 Se genera una clave AES aleatoria → 🔏 Se usa para cifrar el contenido → 🔒 Luego esa clave AES se cifra con tu clave pública RSA.
          </p>

          <p>
            Solo tú, con tu <strong>clave privada RSA</strong>, podrás descifrar la clave AES y con ella recuperar el contenido original del archivo.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800">🔐 Vault de Contraseñas</h2>
          <p>
            Además, puedes crear una bóveda cifrada para guardar tus contraseñas, URLs y usuarios. Se protege usando tu propia clave maestra, y todo se cifra localmente con <strong>AES y Scrypt</strong>.
          </p>

          <p className="mt-6 text-center text-gray-500 italic">Desarrollado con ❤️ para tu seguridad digital.</p>
        </section>
      </div>
    </main>
  )
}
