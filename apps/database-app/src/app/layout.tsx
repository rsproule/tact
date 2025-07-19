import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { UserProvider } from '@/components/user-context';
import { AuthUI } from '@/components/auth-ui';
import { Navbar } from '@/components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tact - Database Mode',
  description: 'An onchain strategy game - Database version for rapid prototyping',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <Navbar />
          <AuthUI />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}