import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { ConfigCheck } from './components/ConfigCheck';
import './globals.css';

export const metadata: Metadata = {
  title: 'Galería de Imágenes',
  description: 'CRUD con Next.js, Supabase y Vercel Blob',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gallery-bg">
        {children}
        <ConfigCheck />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
