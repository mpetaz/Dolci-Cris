import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gelateria Socio Fit - Masterclass Gelati & Caffè",
  description: "Assistente interattivo per la preparazione di gelati, sorbetti, granite e creme caffè fit ad alto contenuto proteico con attrezzature Moulinex e Russell Hobbs.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
