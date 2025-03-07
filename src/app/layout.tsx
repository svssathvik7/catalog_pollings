import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import DesktopSidebar from "@/components/DesktopSidebar";
import AppSidebar from "@/components/AppSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Garden Pollings",
  description: "A secure polling web application made with Next.js and Rust.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased w-screen`}
      >
        <div className="flex min-h-screen">
          <DesktopSidebar />
          <div className="flex-1">
            <div className="p-4 md:hidden z-50 absolute">
              <AppSidebar />
            </div>
            <main className="container mx-auto p-4 flex-grow h-screen flex items-center justify-center">{children}</main>
            <Toaster />
          </div>
        </div>
      </body>
    </html>
  );
}