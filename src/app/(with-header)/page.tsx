"use client";

import Link from "next/link";

import Footer from "@/components/footer";
import PaperHeader from "@/components/paper-header";
import { H3 } from "@/components/ui/typography";
import useIsSSR from "@/hooks/useIsSSR";

export default function Home() {
  const isSSR = useIsSSR();
  return (
    <>
      {isSSR && <PaperHeader isRolledUp={true} />}
      <main className="flex flex-col items-center w-full mt-48 px-8">
        <H3>:anticipation grows:</H3>
      </main>
      <Link href="/rollup-test">RollupTest</Link>
      <Footer />
    </>
  );
}
