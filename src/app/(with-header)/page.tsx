"use client";

import PaperHeader from "@/components/paper-header";
import { H1 } from "@/components/ui/typography";
import useIsSSR from "@/hooks/useIsSSR";

export default function Home() {
  const isSSR = useIsSSR();
  return (
    <>
      {isSSR && <PaperHeader isRolledUp={true} />}
      <main className="flex flex-col items-start w-full mt-40 px-8">
        <H1>Posts</H1>
      </main>
    </>
  );
}
