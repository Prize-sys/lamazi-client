import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Lamazi — Mental Health Support',
  description: 'Connect with verified therapists in Kenya for secure, private online sessions.',
  keywords: ['therapy', 'mental health', 'Kenya', 'counseling', 'psychologist'],
  openGraph: {
    title: 'Lamazi — Mental Health Support',
    description: 'Connect with verified therapists in Kenya',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
