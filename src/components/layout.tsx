// app/layout.tsx

import "./globals.css";
import SharedLayout from "@/components/SharedLayout";

export const metadata = {
  title: "Valur Family Hub",
  description: "Dashboard für Familie, Wetter, Termine, Chat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-gray-900 text-gray-100" suppressHydrationWarning>
        <SharedLayout>
          {children}
        </SharedLayout>
      </body>
    </html>
  );
}
