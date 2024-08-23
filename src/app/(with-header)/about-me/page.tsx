"use client";

import PaperHeaderStatic from "@/components/header-static";
import useIsSSR from "@/hooks/useIsSSR";

export default function AboutMe() {
  const isSSR = useIsSSR();
  return <>{isSSR && <PaperHeaderStatic isRolledUp={false} />}</>;
}
