import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlphaLux — Tableau de bord patrimonial pour montres de luxe",
  description: "Suivez, valorisez et analysez votre collection de montres de luxe. Prix marché en temps réel, graphiques et historique de performance.",
  metadataBase: new URL("https://alphalux.fr"),
  openGraph: {
    title: "AlphaLux",
    description: "Tableau de bord patrimonial pour montres de luxe",
    url: "https://alphalux.fr",
    siteName: "AlphaLux",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
