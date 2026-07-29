import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarketFlow — Achetez, Vendez, Grandissez",
  description: "Des milliers de produits soigneusement sélectionnés, livrés chez vous.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
