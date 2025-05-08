import Link from 'next/link'
import './globals.css'

export const metadata = {
  title: 'SafePass&Docs',
  description: 'App para cifrado y contraseñas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans">
        <nav className="bg-gray-800 text-white p-4">
          <div className="flex justify-between items-center">
            <ul className="flex space-x-6">
              <li><Link href="/rsa">🔑 RSA</Link></li>
              <li><Link href="/docs">📄 Documentos</Link></li>
              <li><Link href="/vault">🗝️ Vault</Link></li>
            </ul>
            <div>
              <Link href="/" className="hover:underline">🏠 Inicio</Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
