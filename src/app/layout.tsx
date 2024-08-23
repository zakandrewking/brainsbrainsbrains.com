import "./globals.css";
import { Exo_2 as FontSans } from "next/font/google";
import { ReactNode } from "react";

import Footer from "@/components/footer";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  fallback: ["sans-serif"],
});

export const metadata: Metadata = {
  title: "The website of Zak King",
  description: "BrainsBrainsBrains",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className="flex flex-col min-h-screen p-8 items-center">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
