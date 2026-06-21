import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quórum Comercio Electrónico | INFOTEP",
  description:
    "Registra tu interés en el curso de Comercio Electrónico con el profesor Randy Bautista en INFOTEP, República Dominicana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-dark">
        {children}
      </body>
    </html>
  );
}
