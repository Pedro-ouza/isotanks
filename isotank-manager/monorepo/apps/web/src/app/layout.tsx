import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Isotank Manager",
  description: "Gestão Avançada de Reservas e Frota de Isotanks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
