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
      <body className={`antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}