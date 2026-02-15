// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Valur Family Hub",
  description: "Euer smartes Zuhause Dashboard",
};

import ClientLayout from "../components/ClientLayout"; // Pfad ggf. anpassen

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gray-900 text-gray-100">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
