import Link from "next/link";

import Paper from "./paper";
import { Button } from "./ui/button";

export default function PaperHeaderStatic({
  isRolledUp,
}: {
  isRolledUp: boolean;
}) {
  const defaultHeight = "140px";
  return (
    <header className="min-w-[576px]">
      <Paper height={defaultHeight} isRolledUp={isRolledUp}>
        <Button variant="link" className="absolute top-2 right-2 w-20" asChild>
          {isRolledUp ? (
            <Link href="/about-me">About Me</Link>
          ) : (
            <Link href="/">Home</Link>
          )}
        </Button>
        <div className="flex flex-col gap-6 items-center">
          <div className="flex flex-col gap-2 items-center mb-6">
            <div className="underline underline-offset-4 text-xl">
              The personal website of
            </div>
            <span className="font-bold text-4xl">Zak King</span>
          </div>
        </div>
      </Paper>
    </header>
  );
}
