"use client";

import { usePathname } from "next/navigation";
import { memo } from "react";

import PaperHeaderStatic from "@/components/header-static";
import useIsSSR from "@/hooks/useIsSSR";
import { PaperStoreProvider } from "@/stores/paper-store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isSSR = useIsSSR();
  const pathname = usePathname();

  //   const Header = memo(PaperHeaderStatic);

  console.log({ isSSR, pathname });

  return (
    <PaperStoreProvider>
      {!isSSR && <PaperHeaderStatic isRolledUp={pathname === "/"} />}
      {children}
    </PaperStoreProvider>
  );
}
