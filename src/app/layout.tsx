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
  title: "Defensoria Penal Publica Chile | NewCooltura Informada",
  description: "Verificador de requisitos para Defensoria Penal Publica, derechos del imputado y proceso penal",
  keywords: ["defensoria penal", "abogado gratis", "derechos imputado", "proceso penal", "DPP"],
  openGraph: {
    title: "Defensoria Penal - NewCooltura Informada",
    description: "Defensoria Penal Publica y derechos del imputado",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
