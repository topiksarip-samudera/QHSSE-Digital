import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QHSSE Platform',
  description: 'QHSSE Integrated Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
