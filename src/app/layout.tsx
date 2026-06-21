import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Crowdfunding Film Gigi",
  description: "Dukung produksi Film Gigi — cerita tentang penerimaan diri dan tekanan sosial.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
