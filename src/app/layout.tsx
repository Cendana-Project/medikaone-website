// src/app/layout.tsx
import type { Metadata } from "next";
import { Nunito_Sans, Poppins } from "next/font/google"; 
import "./globals.css";
import { cn } from "@/lib/utils";

const fontSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ['400', '600', '700', '800'],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "Medika One - Login",
  description: "Akses informasi medis Anda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {children} 
      </body>
    </html>
  );
}