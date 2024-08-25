import { ReactNode } from "react";

import { StoreProvider } from "./test-header-store";

export default function LayoutText({ children }: { children: ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}
