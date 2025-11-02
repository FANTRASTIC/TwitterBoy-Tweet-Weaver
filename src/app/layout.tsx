import type { Metadata } from 'next';
import { Inter, Literata } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const fontLiterata = Literata({
  subsets: ['latin'],
  variable: '--font-literata',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Tweet Weaver',
  description: 'Generate engaging tweets from news articles.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Literata:opsz,wght@7..72,400;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          'font-body antialiased',
          fontInter.variable,
          fontLiterata.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}