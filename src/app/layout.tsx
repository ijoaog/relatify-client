import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '../context/AuthContext';

export const metadata: Metadata = {
  title: "Relatify",
  description: "Sistema de Relatórios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
            <head>
        <link rel="icon" href="C:\Users\joao-lopes\Documents\Desenvolvimento\portifolio\relatify-client\src\public\favicon.png" /> {/* Adicione esta linha */}
      </head>
      <body className={`antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}