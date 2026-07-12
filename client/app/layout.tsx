import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EcoSphere — ESG Management Platform",
    template: "%s | EcoSphere ESG",
  },
  description:
    "Enterprise ESG Management Platform for tracking environmental impact, social responsibility, and governance compliance. Built for Odoo Hackathon 2026.",
  keywords: [
    "ESG",
    "sustainability",
    "environment",
    "governance",
    "carbon tracking",
    "CSR",
    "compliance",
  ],
  authors: [{ name: "EcoSphere Team" }],
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0F17",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
          backgroundColor: "var(--bg-base)",
          color: "hsl(210 40% 95%)",
        }}
      >
        <QueryProvider>
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                color: "hsl(210 40% 95%)",
                fontFamily: "var(--font-geist-sans)",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
