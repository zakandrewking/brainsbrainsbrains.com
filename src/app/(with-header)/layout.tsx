import { ReactNode } from "react";

import { PaperStoreProvider } from "@/stores/paper-store";

export default function WithHeaderLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <PaperStoreProvider>{children}</PaperStoreProvider>;
}
