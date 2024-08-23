"use client";

import PaperHeaderStatic from "@/components/header-static";
import { H1 } from "@/components/ui/typography";
import useIsSSR from "@/hooks/useIsSSR";

export default function Home() {
  const isSSR = useIsSSR();
  return (
    <>
      {isSSR && <PaperHeaderStatic isRolledUp={true} />}
      {/* <main className="flex flex-col items-start w-full mt-8 px-8">
        <H1>Posts</H1>
      </main> */}
    </>
  );
}
