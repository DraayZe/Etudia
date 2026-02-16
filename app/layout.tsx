import type { Metadata } from "next";
import { Anybody, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anybody = Anybody({
  variable: "--font-anybody",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Etudia — Révise plus intelligemment",
  description:
    "Transforme tes cours en outils de révision intelligents grâce à l'IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${anybody.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
