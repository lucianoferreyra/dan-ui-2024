import { Inter } from "next/font/google";
import "./globals.css";
import "./utilities.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DAN - Gestión de Pedidos",
  description: "Sistema de gestión de pedidos, productos y clientes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
