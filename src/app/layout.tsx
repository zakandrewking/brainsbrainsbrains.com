import type { Metadata } from "next";
import { Exo_2 as FontSans } from "next/font/google";
import "./globals.css";

import Footer from "@/components/footer";
import { cn } from "@/lib/utils";

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
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div
          className="flex flex-col min-h-screen p-8 items-center"
          style={{ height: "2000px" }}
        >
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
