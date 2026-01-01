import { Outfit } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';
const outfit = Outfit({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
