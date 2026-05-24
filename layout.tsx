import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

// ————————————————————————————————————————————
// Fonts
// ————————————————————————————————————————————

const displayFont = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});

const bodyFont = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

// ————————————————————————————————————————————
// Metadata
// ————————————————————————————————————————————

export const metadata: Metadata = {
  title: {
    default: 'LBS Shop — Maillots & Accessoires Sportifs au Gabon',
    template: '%s | LBS Shop',
  },
  description:
    'LBS Shop est la référence gabonaise pour les maillots de clubs européens, africains et équipes nationales. Commandez en ligne via WhatsApp. Livraison à Libreville.',
  keywords: [
    'maillots football gabon',
    'maillots sportifs libreville',
    'maillots clubs européens',
    'maillots PSG Gabon',
    'maillots Real Madrid Gabon',
    'accessoires football',
    'boutique sport gabon',
    'LBS Shop',
  ],
  authors: [{ name: 'LBS Shop' }],
  creator: 'LBS Shop',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://lbs-shop.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'fr_GA',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'LBS Shop',
    title: 'LBS Shop — Maillots & Accessoires Sportifs',
    description: 'La référence gabonaise pour les maillots sportifs. Clubs européens, africains, sélections nationales.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'LBS Shop' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LBS Shop — Maillots & Accessoires Sportifs',
    description: 'La référence gabonaise pour les maillots sportifs.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
};

// ————————————————————————————————————————————
// Root Layout
// ————————————————————————————————————————————

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-dark text-light font-body antialiased overflow-x-hidden">
        {children}
        <Toaster
          position="top-right"
          gutter={8}
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1A1A1A',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'var(--font-body)',
            },
            success: {
              iconTheme: { primary: '#00D084', secondary: '#0A0A0A' },
            },
            error: {
              iconTheme: { primary: '#FF4444', secondary: '#0A0A0A' },
            },
          }}
        />
      </body>
    </html>
  );
}
