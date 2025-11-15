import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Toon Exchange - Format Conversion & Token Optimization",
  description: "Convert between JSON, TOON, CSV, YAML, and XML formats. Save 30-60% on LLM token costs with real-time analysis. Free, no login required.",
  keywords: ["TOON", "token", "calculator", "LLM", "GPT", "savings", "JSON", "CSV", "YAML", "XML", "format converter", "data exchange"],
  authors: [{ name: "Mark Mate", url: "https://linkedin.com/in/mark-mate" }],
  icons: {
    icon: [
      { url: '/toon_logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/toon_logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: { url: '/toon_logo.png', sizes: '180x180', type: 'image/png' },
  },
  openGraph: {
    title: "Toon Exchange - Format Conversion & Token Optimization",
    description: "Convert between multiple data formats and optimize LLM token usage by understanding how TOON reduces token usage.",
    type: "website",
    images: [{ url: '/toon_logo.png' }],
  },
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ibmPlexMono.variable} ${spaceMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider defaultTheme="system" storageKey="toon-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
