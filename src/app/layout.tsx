import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SaaS Turnos - Gestión de Citas Profesional",
  description: "La plataforma definitiva para gestionar turnos y citas en cualquier industria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen antialiased")}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
