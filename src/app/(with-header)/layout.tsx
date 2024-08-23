"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import PaperHeader from "@/components/paper-header";
import useIsSSR from "@/hooks/useIsSSR";
import { PaperStoreProvider } from "@/stores/paper-store";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const isSSR = useIsSSR();
  const pathname = usePathname();

  return (
    <PaperStoreProvider>
      {!isSSR && <PaperHeader isRolledUp={pathname !== "/about-me"} />}
      {children}
    </PaperStoreProvider>
  );
}
