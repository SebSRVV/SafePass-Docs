import Link from 'next/link'
import './globals.css'

export const metadata = {
  title: 'SafePass&Docs',
  description: 'App para cifrado y contraseñas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-900 text-white font-sans">
        <nav className="bg-gray-800 px-6 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            {/* Marca / Logo */}
            <div className="text-xl font-bold text-white-400 tracking-wide">
              <Link href="/">🔐 SafePass&Docs</Link>
            </div>

            {/* Navegación */}
            <ul className="flex gap-6 text-sm sm:text-base">
              <li>
                <Link
                  href="/rsa"
                  className="hover:text-sky-300 transition-colors"
                >
                  🔑 RSA
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="hover:text-sky-300 transition-colors"
                >
                  📄 Documentos
                </Link>
              </li>
              <li>
                <Link
                  href="/vault"
                  className="hover:text-sky-300 transition-colors"
                >
                  🗝️ Vault
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-sky-300 transition-colors"
                >
                  🏠 Inicio
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="px-4 sm:px-8 py-6 bg-gray-900 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
