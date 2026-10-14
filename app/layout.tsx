import type { Metadata, Viewport } from 'next';
import './globals.css';
import { UpdateBanner } from '@/components/UpdateBanner';

export const metadata: Metadata = {
  title: 'OMNEX Conecta Interior - Sistema Táctico Humanitario',
  description: 'Sistema táctico de gestión humanitaria, censo offline-first, validación QR criptográfica y flujo de navegación para OMNEX Interior y Soluciones Integrales y Globales SM.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'OMNEX Conecta Interior - Sistema Táctico Humanitario',
    description: 'Sistema táctico de gestión humanitaria, censo offline-first, validación QR criptográfica y flujo de navegación para OMNEX Interior y Soluciones Integrales y Globales SM.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OMNEX Conecta Interior - Sistema Táctico Humanitario',
    description: 'Sistema táctico de gestión humanitaria, censo offline-first, validación QR criptográfica y flujo de navegación para OMNEX Interior y Soluciones Integrales y Globales SM.',
  },
};

export const viewport: Viewport = {
  themeColor: '#050B14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark bg-[#050B14]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Montserrat:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-[#050B14] text-slate-100 antialiased selection:bg-[#2DD4BF]/30">
        {children}
        <UpdateBanner />
      </body>
    </html>
  );
}
