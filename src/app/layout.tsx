import type { Metadata, Viewport } from "next";
import { Inter, Poppins, JetBrains_Mono } from 'next/font/google';
import "./globals.css";
import AppLayout from '@/components/layout/AppLayout';
import MockAuthProvider from '@/components/providers/MockAuthProvider';
import NextAuthProvider from '@/components/providers/NextAuthProvider';
import { Toaster } from '@/components/ui/sonner';

// Font configurations
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Dentist Appointment Management Platform",
  description: "Modern, secure, and HIPAA-compliant dental practice management system",
  keywords: ["dentist", "appointment", "healthcare", "dental practice", "patient management"],
  authors: [{ name: "Dentist Appointment Platform Team" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Dentist Appointment Management Platform",
    description: "Modern, secure, and HIPAA-compliant dental practice management system",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: false, // Don't index in production until ready
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${poppins.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <div id="root" className="relative flex min-h-screen flex-col">
          <NextAuthProvider>
            <MockAuthProvider>
              <AppLayout>
                {children}
              </AppLayout>
            </MockAuthProvider>
          </NextAuthProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
