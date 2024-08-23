import { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="p-10">
      <Button variant="link" asChild>
        <a href="/">← Home</a>
      </Button>
      {children}
    </div>
  );
}
