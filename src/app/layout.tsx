import './globals.css';

import { ReactNode } from 'react';

import type { Metadata } from 'next';
import {
  Caveat,
  Exo_2,
} from 'next/font/google';

import AmplitudeConfig from '@/components/amplitude';
import { PaperStoreProvider } from '@/stores/paper-store';
import { cn } from '@/util/ui-util';

const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-sans",
});
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwritten",
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
    <PaperStoreProvider>
      <AmplitudeConfig>
        <html lang="en">
          <head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <link
              rel="alternate"
              type="application/atom+xml"
              title="ATOM Feed for Zak King's Blog"
              href="atom.xml"
            />
          </head>
          <body
            className={cn(
              "min-h-screen bg-background font-sans antialiased overflow-y-scroll",
              exo2.variable,
              caveat.variable
            )}
          >
            {children}
          </body>
        </html>
      </AmplitudeConfig>
    </PaperStoreProvider>
  );
}
