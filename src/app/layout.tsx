import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PickSide - Interactive English Learning Game",
  description: "A camera-based interactive English quiz game. Stand left or right to choose your answer!",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full bg-slate-950 text-slate-100">
      <body className="min-h-full flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
