import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. Adicione o import do Toaster aqui no topo:
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MVPCarLead",
  description: "Gestão de Leads e Estoque",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        {/* 2. Coloque o Toaster bem aqui, no final do body */}
        <Toaster />
      </body>
    </html>
  );
}