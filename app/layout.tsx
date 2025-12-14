// app/layout.tsx

import "./globals.css";

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
    <html lang="de">
      <head />
      <body className="min-h-screen bg-gray-900 text-gray-100">
        {children}
      </body>
    </html>
  );
}
