import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solar Intelligence Brasil",
  description: "Plataforma de inteligência de mercado solar com indicadores, oportunidades e alertas."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
